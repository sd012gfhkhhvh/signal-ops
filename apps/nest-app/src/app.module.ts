import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RemoteServersModule } from './remote-servers/remote-servers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RemoteServersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
