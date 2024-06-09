import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { Subject } from 'rxjs';
import { ReplicationPushData } from 'src/mongodb/replication-push.interface';
import { ReplicationPullParams } from 'src/shared/replication-pull-params.dto';

@Injectable()
export class InboxService {
  lastEventId = 0;
  pullStream$ = new Subject();

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db
  ) {}

  async replicatePull(params: ReplicationPullParams) {
    const { id, updatedAt, batchSize } = params;

    const documents = await this.db
      .collection('inbox')
      .find({
        $or: [
          /**
           * Notice that we have to compare the updatedAt AND the id field
           * because the updateAt field is not unique and when two documents have
           * the same updateAt, we can still "sort" them by their id.
           */
          {
            updatedAt: { $gt: updatedAt }
          },
          {
            updatedAt: { $eq: updatedAt },
            id: { $gt: id }
          }
        ]
      })
      .limit(batchSize)
      .toArray();

    const lastOfArray = documents.sort((a, b) => b.updatedAt - a.updatedAt).at(0);
    const checkpoint =
      documents.length === 0
        ? { id, updatedAt }
        : {
            id: lastOfArray.id,
            updatedAt: lastOfArray.updatedAt
          };

    return { documents, checkpoint };
  }
  async replicatePush(changeRows: ReplicationPushData[]) {
    const conflicts = [];
    const event = {
      id: this.lastEventId++,
      documents: [],
      checkpoint: null
    };
    let documentIds = changeRows.map(({ assumedMasterState }) => assumedMasterState.id);

    const docs = await this.db.collection('inbox').find({ id: { $in: documentIds } }).toArray();

    for (const changeRow of changeRows) {
      const realMasterState = await this.db
        .collection('inbox')
        .findOne({ id: changeRow.newDocumentState.id });
      if (
        (realMasterState && !changeRow.assumedMasterState) ||
        (realMasterState &&
          changeRow.assumedMasterState &&
          /*
           * For simplicity we detect conflicts on the server by only compare the updateAt value.
           * In reality you might want to do a more complex check or do a deep-equal comparison.
           */
          realMasterState.updatedAt !== changeRow.assumedMasterState.updatedAt)
      ) {
        // we have a conflict
        conflicts.push(realMasterState);
      } else {
        // no conflict -> write the document
        this.db
          .collection('inbox')
          .updateOne({ id: changeRow.newDocumentState.id }, changeRow.newDocumentState);
        event.documents.push(changeRow.newDocumentState);
        event.checkpoint = {
          id: changeRow.newDocumentState.id,
          updatedAt: changeRow.newDocumentState.updatedAt
        };
      }
    }
    if (event.documents.length > 0) {
      this.pullStream$.next(event);
    }
    return conflicts;
  }
}
