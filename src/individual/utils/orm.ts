import { DataSource, EntityManager } from 'typeorm';

export const withTransaction = async <T>(
  dataSource: DataSource,
  func: (manager: EntityManager) => Promise<T>,
): Promise<T> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const ret = await func(queryRunner.manager);
    await queryRunner.commitTransaction();
    return ret;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
