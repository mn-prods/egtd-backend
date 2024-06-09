import { Module } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kcwsh.mongodb.net/`,
            {
              retryWrites: true,
              w: 'majority',
              appName: 'Cluster-0',
            }
          );

          return client.db('gtd');
        } catch (e) {
          throw e;
        }
      }
    }
  ],
  exports: ['DATABASE_CONNECTION']
})
export class MongodbModule {}
