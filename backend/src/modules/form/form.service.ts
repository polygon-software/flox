import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import AbstractSearchService from '../../flox/modules/abstracts/search/abstract-search.service';

import Form from './entities/form.entity';

@Injectable()
export default class FormService extends AbstractSearchService<Form> {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {
    super();
  }

  /**
   * @returns form repository
   */
  get repository(): Repository<Form> {
    return this.formRepository;
  }
}
