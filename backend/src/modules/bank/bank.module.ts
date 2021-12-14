import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankResolver } from './bank.resolver';
import { BankService } from './bank.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BankResolver, BankService, UserService],
})
export class BankModule {}
