import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmModuleOptions } from './configs/orm.config';
// accounts
import { Entities } from './individual/individual.entity';

export const getTypeOrmModuleForRoot = () =>
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    // to configure the DataSourceOptions.
    useFactory: (): TypeOrmModuleOptions => ({
      ...getTypeOrmModuleOptions(Entities),
    }),
  });
