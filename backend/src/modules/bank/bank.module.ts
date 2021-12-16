import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankResolver } from './bank.resolver';
import { BankService } from './bank.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank, User])],
  providers: [BankResolver, BankService, UserService],
})
export class BankModule {}
