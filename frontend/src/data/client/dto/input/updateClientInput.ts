import { IsOptional, IsString } from 'class-validator';

import CreateClientInput from 'src/data/client/dto/input/createClientInput';

/**
 * A class representing an input object for updating a client data object
 */
export default class UpdateClientInput extends CreateClientInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
