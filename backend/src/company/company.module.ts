import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CompanyResolver, CompanyService],
})
export class CompanyModule {}
