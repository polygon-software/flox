import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankResolver } from './bank.resolver';
import { BankService } from './bank.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bank]), UserModule],
  providers: [BankResolver, BankService],
  exports: [BankService],
})
export class BankModule {}
