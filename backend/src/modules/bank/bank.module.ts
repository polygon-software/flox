import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankResolver } from './bank.resolver';
import { BankService } from './bank.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bank, User]), UserModule],
  providers: [BankResolver, BankService],
})
export class BankModule {}
