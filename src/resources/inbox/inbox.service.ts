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
      type: 'OK',
      data: { documents: [], checkpoint: null }
    };

    // Step 1: Fetch all the real master states for the documents corresponding to `changeRows`
    const changeRowIds = changeRows.map((changeRow) => changeRow.newDocumentState.id);
    const realMasterStates = await this.db
      .collection('inbox')
      .find({ id: { $in: changeRowIds } })
      .toArray();

    const realMasterStateMap = new Map();
    realMasterStates.forEach((state) => realMasterStateMap.set(state.id, state));

    // Step 2: Split `changeRows` into conflicts and non-conflicts
    const bulkOps = [];

    for (const changeRow of changeRows) {
      const realMasterState = realMasterStateMap.get(changeRow.newDocumentState.id);

      if (
        (realMasterState && !changeRow.assumedMasterState) ||
        (realMasterState &&
          changeRow.assumedMasterState &&
          realMasterState.updatedAt !== changeRow.assumedMasterState.updatedAt)
      ) {
        // We have a conflict
        conflicts.push(realMasterState);
      } else {
        const updateDoc = { ...changeRow.newDocumentState };
        delete updateDoc._id; // Remove _id to prevent MongoBulkWriteError
        // No conflict -> prepare for bulk write
        const updateOp = {
          updateOne: {
            filter: { id: changeRow.newDocumentState.id },
            update: { $set: updateDoc },
            upsert: true
          }
        };
        bulkOps.push(updateOp);
        event.data.documents.push(changeRow.newDocumentState);
        event.data.checkpoint = {
          id: changeRow.newDocumentState.id,
          updatedAt: changeRow.newDocumentState.updatedAt
        };
      }
    }

    // Step 3: Perform bulk update/insert operations for non-conflict documents
    if (bulkOps.length > 0) {
      await this.db.collection('inbox').bulkWrite(bulkOps);
    }

    // Step 4: Create an event for the non-conflict documents and push it to `pullStream$`
    if (event.data.documents.length > 0) {
      this.pullStream$.next(event);
    }

    // Step 5: Return the conflicts
    return conflicts;
  }
}
