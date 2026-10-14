import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TasksModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        database: configService.getOrThrow<string>('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        port: Number(configService.getOrThrow('DB_PORT')),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development', //development only
      }),
    }),
  ],
  providers: [],
})
export class AppModule {}
