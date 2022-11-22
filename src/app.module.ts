import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
