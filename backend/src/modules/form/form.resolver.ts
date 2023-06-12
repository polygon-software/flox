import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AdminOnly } from '../../flox/modules/roles/authorization.decorator';
import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';
import GetOneArgs from '../../flox/modules/abstracts/crud/dto/args/get-one.args';
import DeleteInput from '../../flox/modules/abstracts/crud/dto/input/delete.input';

import FormService from './form.service';
import Form from './entities/form.entity';
import CreateFormInput from './dto/input/create-form.input';
import UpdateFormInput from './dto/input/update-form.input';
import FormSearchOutput from './outputs/form-search.output';
import FormSearchArgs from './dto/args/form-search.args';

@Resolver(() => Form)
export default class FormResolver extends AbstractSearchResolver<
  Form,
  FormService
> {
  formRelations = [
    'articles',
    'billing.address',
    'client',
    'client.address',
    'devices',
    'expenses',
    'job',
    'images',
    'tenant',
    'tenant.address',
  ];

  constructor(private readonly formService: FormService) {
    super([
      'devices.deviceManufacturer',
      'devices.deviceModel',
      'devices.deviceInformation',
      'devices.deviceProductionNumber',
      'externalOrderNumber',
      'internalOrderNumber',
      'objectNumber',
      'description',
      'owner',
      'protocolText',
      'employeeId',
      'freeText',
      'client.firstName',
      'client.lastName',
      'client.companyName',
      'client.phoneNumber',
      'client.email',
      'tenant.firstName',
      'tenant.lastName',
      'tenant.phoneNumber',
      'tenant.email',
      'billing.companyName',
      'billing.firstName',
      'billing.lastName',
      'billing.email',
    ]);
  }

  /**
   * @returns form service
   */
  get service(): FormService {
    return this.formService;
  }

  /**
   * Creates a new form
   *
   * @param createFormInput - Form input data
   * @returns The newly created form
   */
  @AdminOnly()
  @Mutation(() => Form, { name: 'createForm' })
  async createForm(
    @Args('createFormInput') createFormInput: CreateFormInput,
  ): Promise<Form> {
    return super.create(createFormInput);
  }

  /**
   * Updates an existing form
   *
   * @param updateFormInput - Form input data to update
   * @returns The newly updated form
   */
  @AdminOnly()
  @Mutation(() => Form, { name: 'updateForm' })
  async updateForm(
    @Args('updateFormInput') updateFormInput: UpdateFormInput,
  ): Promise<Form> {
    return super.updateNestedEntity(updateFormInput, {
      relations: this.formRelations,
    });
  }

  /**
   * Deletes a form
   *
   * @param deleteInput - Contains the form's UUID
   * @returns The deleted form
   */
  @AdminOnly()
  @Mutation(() => Form, { name: 'deleteForm' })
  async deleteForm(
    @Args('deleteInput') deleteInput: DeleteInput,
  ): Promise<Form> {
    return super.delete(deleteInput);
  }

  /**
   * Returns a form for the given UUID, if it exists
   *
   * @param getOneArgs - Contains the form's UUID
   * @returns The form, if it was found
   */
  @AdminOnly()
  @Query(() => Form, { name: 'getForm' })
  async getForm(@Args() getOneArgs: GetOneArgs): Promise<Form> {
    return super.getOne(getOneArgs, {
      relations: this.formRelations,
    });
  }

  /**
   * Returns all existing forms
   *
   * @param formSearchArgs - Pagination and sorting data
   * @returns All exisiting forms
   */
  @AdminOnly()
  @Query(() => FormSearchOutput, { name: 'searchForms' })
  async searchForms(
    @Args() formSearchArgs: FormSearchArgs,
  ): Promise<FormSearchOutput> {
    return super.search(formSearchArgs, {
      relations: this.formRelations,
    });
  }
}
