import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import FormEntityInput from 'src/data/form/dto/input/createFormEntityInput';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import UpdateJobInput from 'src/data/job/dto/input/updateJobInput';
import FullName from 'src/flox/modules/form/data/types/FullName';
import { LEGAL_FORM } from 'src/data/ENUM';
import AddressInput from 'src/flox/modules/form/data/types/AddressInput';
import UpdateClientInput from 'src/data/client/dto/input/updateClientInput';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';
import UpdateTenantInput from 'src/data/tenant/dto/input/updateTenantInput';
import UpdateBillingInput from 'src/data/billing/dto/input/updateBillingInput';
import UpdateDeviceInput from 'src/data/device/dto/input/updateDeviceInput';
import ArticleNumberEntry from 'src/flox/modules/form/data/types/ArticleNumberEntry';
import TimeRecordingEntry from 'src/flox/modules/form/data/types/TimeRecordingEntry';
import UpdateArticleInput from 'src/data/article/dto/input/updateArticleInput';
import UpdateExpenseInput from 'src/data/expense/dto/input/updateExpenseInput';
import FormEntity from 'src/data/form/entities/form.entity';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import UpdateImageFileInput from 'src/data/imageFile/dto/input/updateImageFileInput';
import ImageFileEntity from 'src/data/imageFile/entities/imageFileEntity';
import ProtocolEntry from 'src/flox/modules/form/data/types/ProtocolEntry';
import UpdateProtocolInput from 'src/data/protocol/input/updateProtocolInput';

/**
 * Helper function for getting field contents
 * @param {FormStateKey} storeKey - key for where contents are stored in form store
 * @param {{key: string}} field - fieldKey override for FormStateKey
 * @returns {unknown} - value stored in store for given key
 */
function getFieldValue(
  storeKey: FormStateKey,
  field: { key: string }
): unknown {
  const store = useFormStore();
  const modifiedStoreKey = { ...storeKey, fieldKey: field.key };
  return store.getField(modifiedStoreKey);
}

/**
 * Fill formstore with fetched form entity values
 * @param formKey - key of form
 * @param formEntity - fetched form entity
 * @returns - input for updating a form entity
 */
export function fillFormStoreWithFormEntityValues(
  formEntity: FormEntity,
  formKey: string
): void {
  const store = useFormStore();
  const storeKey = {
    formKey,
    pageKey: 'formData',
    cardKey: '',
    fieldKey: '',
  } as FormStateKey;
  const setFieldValue = (field: { key: string }, val: unknown): void => {
    storeKey.fieldKey = field.key;
    store.setValue(storeKey, val);
  };

  // basic data
  storeKey.cardKey = 'basicData';
  setFieldValue(FIELDS.START_DATE, formEntity.startDate);
  setFieldValue(FIELDS.END_DATE, formEntity.endDate);
  setFieldValue(FIELDS.EXTERNAL_ORDER_NUMBER, formEntity.externalOrderNumber);
  setFieldValue(FIELDS.INTERNAL_ORDER_NUMBER, formEntity.internalOrderNumber);
  setFieldValue(FIELDS.OWNER, formEntity.owner);
  setFieldValue(FIELDS.OBJECT_NUMBER, formEntity.objectNumber);

  // job data
  storeKey.cardKey = 'jobInformation';
  setFieldValue(FIELDS.JOB_INFORMATION, formEntity.job);

  // client data
  storeKey.cardKey = 'clientData';
  setFieldValue(FIELDS.FULL_NAME, {
    firstName: formEntity.client?.firstName,
    lastName: formEntity.client?.lastName,
  } as FullName);
  setFieldValue(FIELDS.COMPANY_NAME, formEntity.client?.companyName);
  setFieldValue(FIELDS.COMPANY_LEGAL_FORM, formEntity.client?.companyLegalForm);
  setFieldValue(FIELDS.ADDRESS, formEntity.client?.address);
  setFieldValue(FIELDS.SIMPLE_PHONE_NUMBER, formEntity.client?.phoneNumber);
  setFieldValue(FIELDS.EMAIL, formEntity.client?.email);
  setFieldValue({ key: 'uuid' }, formEntity.client?.uuid);

  // tenant data
  storeKey.cardKey = 'tenantData';
  setFieldValue(FIELDS.FULL_NAME, {
    firstName: formEntity.tenant?.firstName,
    lastName: formEntity.tenant?.lastName,
  } as FullName);
  setFieldValue(FIELDS.EXTENDED_ADDRESS, formEntity.tenant?.address);
  setFieldValue(FIELDS.SIMPLE_PHONE_NUMBER, formEntity.tenant?.phoneNumber);
  setFieldValue(FIELDS.EMAIL, formEntity.tenant?.email);
  setFieldValue(FIELDS.SIMPLE_FLOOR, formEntity.tenant?.floor);
  setFieldValue({ key: 'uuid' }, formEntity.tenant?.uuid);

  // billing data
  storeKey.cardKey = 'billingData';
  setFieldValue(FIELDS.FULL_NAME, {
    firstName: formEntity.billing?.firstName,
    lastName: formEntity.billing?.lastName,
  } as FullName);
  setFieldValue(FIELDS.COMPANY_NAME, formEntity.billing?.companyName);
  setFieldValue(FIELDS.EXTENDED_ADDRESS, formEntity.billing?.address);
  setFieldValue(FIELDS.EMAIL, formEntity.billing?.email);
  setFieldValue({ key: 'uuid' }, formEntity.billing?.uuid);

  // device data
  storeKey.cardKey = 'devices';
  setFieldValue(FIELDS.DEVICES, formEntity.devices);

  // additional data
  storeKey.cardKey = 'additionalData';
  setFieldValue(FIELDS.SELECT_POWER_MEASUREMENT, formEntity.measurePower);
  setFieldValue(FIELDS.PROBLEM_DESCRIPTION, formEntity.description);
  setFieldValue(FIELDS.PROTOCOL_DATE, formEntity.protocolDate);
  setFieldValue(FIELDS.PROTOCOL, formEntity.protocolText);

  // productsAndTimeRecording
  storeKey.cardKey = 'productsAndTimeRecording';
  setFieldValue(FIELDS.ARTICLE_NUMBERS, formEntity.articles);
  setFieldValue(FIELDS.TIME_RECORDINGS, formEntity.expenses);

  // final data
  storeKey.cardKey = 'finalInformation';
  setFieldValue(FIELDS.TOTAL_AMOUNT, formEntity.totalAmount);
  setFieldValue(FIELDS.EMPLOYEE_ABBREVIATION, formEntity.employeeId);
  setFieldValue(FIELDS.FREE_TEXT, formEntity.freeText);

  // file upload
  storeKey.cardKey = 'fileUpload';
  setFieldValue(FIELDS.FILE_UPLOAD, formEntity.images);

  // protocol
  storeKey.cardKey = 'protocols';
  setFieldValue(FIELDS.PROTOCOLS, formEntity.protocols);
}

/**
 * Transform the FormValues to FormEntityValues
 * @param formKey - key of form
 * @param uuid - uuid of form
 * @param oldImages - old images of form
 * @returns - input for creating/updating a form entity
 */
export default function formValuesToFormEntityValues(
  formKey: string,
  uuid?: string,
  oldImages?: ImageFileEntity[]
): FormEntityInput {
  const storeKey = {
    formKey,
    pageKey: 'formData',
    cardKey: '',
    fieldKey: '',
  } as FormStateKey;

  storeKey.cardKey = 'jobInformation';
  const job = getFieldValue(storeKey, FIELDS.JOB_INFORMATION) as
    | UpdateJobInput
    | undefined;

  storeKey.cardKey = 'basicData';
  const creationDate = getFieldValue(storeKey, FIELDS.START_DATE) as
    | Date
    | undefined;
  const endDate = getFieldValue(storeKey, FIELDS.END_DATE) as Date | undefined;
  const externalOrderNumber = getFieldValue(
    storeKey,
    FIELDS.EXTERNAL_ORDER_NUMBER
  ) as string | undefined;
  const internalOrderNumber = getFieldValue(
    storeKey,
    FIELDS.INTERNAL_ORDER_NUMBER
  ) as string | undefined;
  const owner = getFieldValue(storeKey, FIELDS.OWNER) as string | undefined;
  const objectNumber = getFieldValue(storeKey, FIELDS.OBJECT_NUMBER) as
    | string
    | undefined;

  storeKey.cardKey = 'billingData';
  const billingCompanyName = getFieldValue(storeKey, FIELDS.COMPANY_NAME) as
    | string
    | undefined;
  const billingFullName = getFieldValue(storeKey, FIELDS.FULL_NAME) as
    | FullName
    | undefined;
  const billingAddress = getFieldValue(storeKey, FIELDS.EXTENDED_ADDRESS) as
    | AddressInput
    | undefined;
  const billingEmail = getFieldValue(storeKey, FIELDS.EMAIL) as
    | string
    | undefined;

  const billing = new UpdateBillingInput(
    billingCompanyName,
    billingFullName?.firstName,
    billingFullName?.lastName,
    billingAddress
      ? new UpdateAddressInput(
          billingAddress?.street,
          billingAddress?.number,
          billingAddress?.city,
          Number(billingAddress?.zipCode),
          billingAddress?.additionalAddress
        )
      : undefined,
    billingEmail,
    uuid ? (getFieldValue(storeKey, { key: 'uuid' }) as string) : undefined
  );

  storeKey.cardKey = 'clientData';
  const clientFullName = getFieldValue(storeKey, FIELDS.FULL_NAME) as
    | FullName
    | undefined;
  const clientCompanyName = getFieldValue(storeKey, FIELDS.COMPANY_NAME) as
    | string
    | undefined;
  const companyLegalForm = getFieldValue(
    storeKey,
    FIELDS.COMPANY_LEGAL_FORM
  ) as LEGAL_FORM | undefined;
  const clientAddress = getFieldValue(storeKey, FIELDS.ADDRESS) as
    | AddressInput
    | undefined;
  const clientPhoneNumber = getFieldValue(
    storeKey,
    FIELDS.SIMPLE_PHONE_NUMBER
  ) as number | undefined;
  const clientEmail = getFieldValue(storeKey, FIELDS.EMAIL) as
    | string
    | undefined;
  const client = new UpdateClientInput(
    clientFullName?.firstName,
    clientFullName?.lastName,
    clientCompanyName,
    companyLegalForm,
    clientAddress
      ? new UpdateAddressInput(
          clientAddress?.street,
          clientAddress?.number,
          clientAddress?.city,
          Number(clientAddress?.zipCode)
        )
      : undefined,
    clientPhoneNumber?.toString(),
    clientEmail,
    uuid ? (getFieldValue(storeKey, { key: 'uuid' }) as string) : undefined
  );

  storeKey.cardKey = 'tenantData';
  const tenantFullName = getFieldValue(storeKey, FIELDS.FULL_NAME) as
    | FullName
    | undefined;
  const tenantAddress = getFieldValue(storeKey, FIELDS.EXTENDED_ADDRESS) as
    | AddressInput
    | undefined;

  const tenantPhoneNumber = getFieldValue(
    storeKey,
    FIELDS.SIMPLE_PHONE_NUMBER
  ) as string | undefined;
  const tenantEmail = getFieldValue(storeKey, FIELDS.EMAIL) as
    | string
    | undefined;
  const floor = getFieldValue(storeKey, FIELDS.SIMPLE_FLOOR) as
    | string
    | undefined;
  const tenant = new UpdateTenantInput(
    tenantFullName?.firstName,
    tenantFullName?.lastName,
    tenantAddress
      ? new UpdateAddressInput(
          tenantAddress?.street,
          tenantAddress?.number,
          tenantAddress?.city,
          Number(tenantAddress?.zipCode),
          tenantAddress?.additionalAddress
        )
      : undefined,
    tenantPhoneNumber?.toString(),
    tenantEmail,
    floor,
    uuid ? (getFieldValue(storeKey, { key: 'uuid' }) as string) : undefined
  );

  storeKey.cardKey = 'additionalData';
  const measurePower = getFieldValue(
    storeKey,
    FIELDS.SELECT_POWER_MEASUREMENT
  ) as boolean | undefined;
  const problemDescription = getFieldValue(
    storeKey,
    FIELDS.PROBLEM_DESCRIPTION
  ) as string | undefined;
  const protocol = getFieldValue(storeKey, FIELDS.PROTOCOL) as
    | string
    | undefined;
  const protocolDate = getFieldValue(storeKey, FIELDS.PROTOCOL_DATE) as
    | Date
    | undefined;

  storeKey.cardKey = 'devices';
  const devices = getFieldValue(storeKey, FIELDS.DEVICES) as
    | UpdateDeviceInput[]
    | undefined;

  storeKey.cardKey = 'productsAndTimeRecording';
  const articleEntries = getFieldValue(storeKey, FIELDS.ARTICLE_NUMBERS) as
    | ArticleNumberEntry[]
    | undefined;
  const articleInput = articleEntries?.map((entry) => {
    return new UpdateArticleInput(
      entry.articleNumber ?? undefined,
      entry.manufacturerNumber?.toString() ?? undefined,
      entry.name ?? undefined,
      entry.description ?? undefined,
      entry.amount ?? undefined,
      entry.price ?? undefined,
      entry.discount ?? undefined
    );
  });

  storeKey.cardKey = 'protocols';
  const protocolEntries = getFieldValue(storeKey, FIELDS.PROTOCOLS) as
    | ProtocolEntry[]
    | undefined;
  const protocolInput = protocolEntries?.map((entry) => {
    return new UpdateProtocolInput(
      entry.date ?? undefined,
      entry.articleNumber ?? undefined,
      entry.label ?? undefined,
      entry.description ?? undefined,
      entry.unit ?? undefined,
      entry.amount ?? undefined,
      entry.price ?? undefined,
      entry.discount ?? undefined,
      entry.sum ?? undefined
    );
  });

  const timeRecordings = getFieldValue(storeKey, FIELDS.TIME_RECORDINGS) as
    | TimeRecordingEntry[]
    | undefined;
  const expensesInput = timeRecordings?.map((entry) => {
    return new UpdateExpenseInput(
      entry.name ?? undefined,
      entry.timeAmount ?? undefined,
      entry.discount ?? undefined
    );
  });

  storeKey.cardKey = 'finalInformation';
  const totalAmount = getFieldValue(storeKey, FIELDS.TOTAL_AMOUNT) as
    | number
    | undefined;
  const employeeAbbreation = getFieldValue(
    storeKey,
    FIELDS.EMPLOYEE_ABBREVIATION
  ) as string | undefined;
  const freeText = getFieldValue(storeKey, FIELDS.FREE_TEXT) as
    | string
    | undefined;
  storeKey.cardKey = 'fileUpload';
  const images = getFieldValue(storeKey, FIELDS.FILE_UPLOAD) as
    | FileEntity[]
    | undefined;
  if (oldImages) {
    images?.push(...oldImages);
  }
  const imageFileInputs = images?.map((image) => {
    return new UpdateImageFileInput(
      image.filename,
      image.path,
      image.mimetype,
      image.size,
      image.uuid
    );
  });

  // return the input object for creating/updating a form entity
  return new FormEntityInput(
    uuid ?? undefined,
    job,
    creationDate,
    endDate,
    internalOrderNumber,
    externalOrderNumber,
    client,
    owner,
    objectNumber,
    tenant,
    measurePower,
    billing,
    problemDescription,
    devices,
    protocolDate,
    protocol,
    articleInput,
    expensesInput,
    protocolInput,
    totalAmount,
    employeeAbbreation,
    freeText,
    imageFileInputs
  );
}
