import FormEntity from 'src/data/form/entities/form.entity';
import UpdateJobInput from 'src/data/job/dto/input/updateJobInput';
import UpdateClientInput from 'src/data/client/dto/input/updateClientInput';
import UpdateExpenseInput from 'src/data/expense/dto/input/updateExpenseInput';
import UpdateArticleInput from 'src/data/article/dto/input/updateArticleInput';
import UpdateDeviceInput from 'src/data/device/dto/input/updateDeviceInput';
import UpdateBillingInput from 'src/data/billing/dto/input/updateBillingInput';
import UpdateTenantInput from 'src/data/tenant/dto/input/updateTenantInput';
import UpdateImageFileInput from 'src/data/imageFile/dto/input/updateImageFileInput';

/**
 * A class representing a form entity input
 */
export default class FormEntityInput {
  constructor(
    private uuid?: string,
    private job?: UpdateJobInput | null,
    private startDate?: Date | undefined,
    private endDate?: Date | undefined,
    private internalOrderNumber?: string | undefined,
    private externalOrderNumber?: string | undefined,
    private client?: UpdateClientInput | undefined,
    private owner?: string | undefined,
    private objectNumber?: string | undefined,
    private tenant?: UpdateTenantInput | undefined,
    private measurePower?: boolean | undefined,
    private billing?: UpdateBillingInput | undefined,
    private description?: string | undefined,
    private devices?: UpdateDeviceInput[] | undefined,
    private protocolDate?: Date | undefined,
    private protocolText?: string | undefined,
    private articles?: UpdateArticleInput[] | undefined,
    private expenses?: UpdateExpenseInput[] | undefined,
    private totalAmount?: number | undefined,
    private employeeId?: string | undefined,
    private freeText?: string | undefined,
    private images?: UpdateImageFileInput[] | undefined,
    private isPullable?: boolean | undefined,
    private pulledAt?: Date | undefined,
    private isEmergency?: boolean | undefined,
    private isFinished?: boolean | undefined
  ) {}

  /**
   * From db entry to input
   * @param formEntity - The form entity from db
   * @returns - The form input for update
   */
  static fromFormEntity(formEntity: FormEntity): FormEntityInput {
    return new FormEntityInput(
      formEntity.uuid,
      formEntity.job,
      formEntity.startDate,
      formEntity.endDate,
      formEntity.internalOrderNumber,
      formEntity.externalOrderNumber,
      formEntity.client,
      formEntity.owner,
      formEntity.objectNumber,
      formEntity.tenant,
      formEntity.measurePower,
      formEntity.billing,
      formEntity.description,
      formEntity.devices,
      formEntity.protocolDate,
      formEntity.protocolText,
      formEntity.articles,
      formEntity.expenses,
      formEntity.totalAmount,
      formEntity.employeeId,
      formEntity.freeText,
      formEntity.images,
      formEntity.isPullable,
      formEntity.pulledAt,
      formEntity.isEmergency,
      formEntity.isFinished
    );
  }
}
