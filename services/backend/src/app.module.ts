import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { UserModule } from './user/user.module';

@Module({
  controllers: [HealthController],
  imports: [UserModule],
})
export class AppModule {}
