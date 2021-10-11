import { Injectable } from '@nestjs/common';
import { CreateGlobiInput } from './dto/create-globi.input';
import { UpdateGlobiInput } from './dto/update-globi.input';

@Injectable()
export class GlobiService {
  create(createGlobiInput: CreateGlobiInput) {
    return 'This action adds a new globi';
  }

  findAll() {
    return `This action returns all globi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globi`;
  }

  update(id: number, updateGlobiInput: UpdateGlobiInput) {
    return `This action updates a #${id} globi`;
  }

  remove(id: number) {
    return `This action removes a #${id} globi`;
  }
}
