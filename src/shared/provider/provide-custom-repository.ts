import { Provider, Type } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';

export function provideCustomRepository<T>(
  entity: Type<T>,
  repository: Type<Repository<T>>,
  dataSource?: DataSource | DataSourceOptions | string
): Provider {
  return {
    provide: repository,
    inject: [getDataSourceToken(dataSource)],
    useFactory(dataSource: DataSource) {
      const baseRepository = dataSource.getRepository(entity);
      return new repository(
        baseRepository.target,
        baseRepository.manager,
        baseRepository.queryRunner
      );
    },
  };
}