import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getTypeOrmModuleForRoot } from './app.typeorm';
import { IndividualModule } from './individual/individual.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev'],
      isGlobal: true,
    }),
    getTypeOrmModuleForRoot(),
    IndividualModule,
  ],
})
export class AppModule {}
