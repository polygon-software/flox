import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Dossier } from './entity/dossier.entity';
import { Public } from '../../auth/authentication.decorator';
import {DossierService} from "./dossier.service";
import {UpdateDossierStatus} from "./dto/input/update-dossier.input";

@Resolver(() => Dossier)
export class DossierResolver {
  constructor(private readonly dossierService: DossierService) {}
  @Public()
  @Mutation(() => Dossier)
  async update(
    @Args('updateDossierStatus') updateDossierStatus: UpdateDossierStatus,
  ): Promise<Dossier> {
    return await this.dossierService.update(updateDossierStatus);
  }
}
