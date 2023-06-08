import { Controller, Get, Headers, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { addSeconds, isBefore } from 'date-fns';

import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';
import { BasicAuth } from '../../flox/modules/auth/authentication.decorator';
import ImageFileService from '../image-file/image-file.service';

import Form from './entities/form.entity';
import FormService from './form.service';

@Controller()
export default class FormController extends AbstractSearchResolver<
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

  constructor(
    private readonly formService: FormService,
    private readonly imageFileService: ImageFileService,
  ) {
    super([
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
   * Gets all forms which can be pulled, regardless whether they have already been pulled.
   *
   * @param headers - Request headers
   * @param req - Request object
   * @param res - Response object
   * @param page - Page index for pagination (defaults to 0)
   * @param size - Page size for pagination (defaults to 500)
   * @returns Promise<void>
   */
  @BasicAuth()
  @Get('/allForms')
  async allForms(
    @Headers() headers: Record<string, unknown>,
    @Req() req: Request,
    @Res() res: Response,
    @Param('page') page = 0,
    @Param('size') size = 500,
  ): Promise<void> {
    const forms = await super.getAll(
      { take: size, skip: page * size },
      { where: { isPullable: true }, relations: this.formRelations },
    );

    // Mark all forms as pulled
    const promiseArray: Promise<Form>[] = [];
    forms.forEach((form) => {
      const updateInput = {
        uuid: form.uuid,
        pulledAt: new Date(),
      };
      promiseArray.push(super.updateNestedEntity(updateInput));
    });
    await Promise.all(promiseArray);

    try {
      res.send(await this.loadFormImages(forms));
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  }

  /**
   * Gets all forms which can be pulled.
   *
   * @param headers -Request headers
   * @param req - Request object
   * @param res - Response object
   * @returns Promise<void>
   */
  @BasicAuth()
  @Get('/newForms')
  async newForms(
    @Headers() headers: Record<string, unknown>,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const forms = await super.getAll(
      { take: 500, skip: 0 },
      {
        relations: this.formRelations,
        where: { isPullable: true },
      },
    );

    // Only pick forms that have been updated since they were pulled or have never
    // been pulled. One second is added to the pulledAt date, since its own update
    // will always set the updatedAt date 1ms later (therefore the form would always
    // be marked as pullable).
    const validForms = forms.filter((form) => {
      if (form.pulledAt && form.updatedAt) {
        return isBefore(addSeconds(form.pulledAt, 1), form.updatedAt);
      }
      return true;
    });

    // Mark all forms as pulled
    const promiseArray: Promise<Form>[] = [];
    validForms.forEach((form) => {
      const updateInput = {
        uuid: form.uuid,
        pulledAt: new Date(),
      };
      promiseArray.push(super.updateNestedEntity(updateInput));
    });
    await Promise.all(promiseArray);

    try {
      res.send(await this.loadFormImages(validForms));
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  }

  /**
   * Loads the images of the given forms as base64 strings.
   *
   * @param forms - Forms to load the images for
   * @returns Forms with images as base64 strings
   */
  async loadFormImages(forms: Form[]): Promise<Form[]> {
    // Load the images and convert them to base64
    return Promise.all(
      forms.map(async (form) => {
        const imageStrings: string[] = [];

        // Convert all images to base64
        await Promise.all(
          form.images.map(async (image) => {
            try {
              imageStrings.push(
                await this.imageFileService.fileToBase64(image),
              );
            } catch (error) {
              throw new Error(
                `An error occurred while loading the images of the form with uuid ${form.uuid}`,
              );
            }
          }),
        );

        // Update form object
        form.imageStrings = imageStrings;
        return form;
      }),
    );
  }
}
