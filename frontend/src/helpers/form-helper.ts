import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import FormEntityInput from 'src/data/form/dto/input/createFormEntityInput';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import UpdateJobInput from 'src/data/job/dto/input/updateJobInput';
import FullName from 'src/flox/modules/form/data/types/FullName';
import { DEVICE_TYPE, FLOOR, LEGAL_FORM } from 'src/data/ENUM';
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
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import UpdateImageFileInput from 'src/data/imageFile/dto/input/updateImageFileInput';

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
 * Transform the FormValues to FormEntityValues
 * @param {string} formKey - key of form
 * @returns {FormEntityInput} - input for creating/updating a form entity
 */
export default function formValuesToFormEntityValues(
  formKey: string
): FormEntityInput {
  const storeKey = {
    formKey,
    pageKey: 'formData',
    cardKey: '',
    fieldKey: '',
  } as FormStateKey;

  storeKey.cardKey = 'jobInformation';
  const job = getFieldValue(
    storeKey,
    FIELDS.JOB_INFORMATION
  ) as UpdateJobInput | null;

  storeKey.cardKey = 'basicData';
  const endDate = getFieldValue(storeKey, FIELDS.END_DATE) as Date | undefined;
  const externalOrderNumber = getFieldValue(
    storeKey,
    FIELDS.EXTERNAL_ORDER_NUMBER
  ) as number | undefined;
  const internalOrderNumber = getFieldValue(
    storeKey,
    FIELDS.INTERNAL_ORDER_NUMBER
  ) as number | undefined;
  const owner = getFieldValue(storeKey, FIELDS.OWNER) as string | undefined;
  const objectNumber = getFieldValue(storeKey, FIELDS.OBJECT_NUMBER) as
    | number
    | undefined;

  storeKey.cardKey = 'billingData';
  const billingCompanyName = getFieldValue(storeKey, FIELDS.COMPANY_NAME) as
    | string
    | undefined;
  const billingFullName = getFieldValue(storeKey, FIELDS.FULL_NAME) as
    | FullName
    | undefined;
  const billingAddress = getFieldValue(storeKey, FIELDS.ADDRESS) as
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
          Number(billingAddress?.zipCode)
        )
      : undefined,
    billingEmail
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
  const clientPhoneNumber = getFieldValue(storeKey, FIELDS.PHONE_NUMBER) as
    | number
    | undefined;
  const clientEmail = getFieldValue(storeKey, FIELDS.EMAIL) as
    | string
    | undefined;
  const client = new UpdateClientInput(
    clientFullName?.firstName,
    clientFullName?.lastName,
    clientCompanyName,
    companyLegalForm,
    companyLegalForm
      ? new UpdateAddressInput(
          clientAddress?.street,
          clientAddress?.number,
          clientAddress?.city,
          Number(clientAddress?.zipCode)
        )
      : undefined,
    clientPhoneNumber?.toString(),
    clientEmail,
    undefined
  );

  storeKey.cardKey = 'tenantData';
  const tenantFullName = getFieldValue(storeKey, FIELDS.FULL_NAME) as
    | FullName
    | undefined;
  const tenantAddress = getFieldValue(storeKey, FIELDS.EXTENDED_ADDRESS) as
    | AddressInput
    | undefined;
  const tenantPhoneNumber = getFieldValue(storeKey, FIELDS.PHONE_NUMBER) as
    | string
    | undefined;
  const tenantEmail = getFieldValue(storeKey, FIELDS.EMAIL) as
    | string
    | undefined;
  const floorType = getFieldValue(storeKey, FIELDS.FLOOR) as FLOOR | undefined;
  const floorNumber = getFieldValue(storeKey, FIELDS.FLOOR_NUMBER) as
    | number
    | undefined;
  const tenant = new UpdateTenantInput(
    tenantFullName?.firstName,
    tenantFullName?.lastName,
    tenantAddress
      ? new UpdateAddressInput(
          tenantAddress?.street,
          tenantAddress?.number,
          tenantAddress?.city,
          Number(tenantAddress?.zipCode)
        )
      : undefined,
    tenantPhoneNumber?.toString(),
    tenantEmail,
    floorType,
    floorNumber
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

  // TODO: add possibility for n devices
  storeKey.cardKey = 'deviceData1';
  const deviceType1 = getFieldValue(storeKey, FIELDS.SELECT_DEVICE_TYPE) as
    | DEVICE_TYPE
    | undefined;
  const deviceManufacturer1 = getFieldValue(storeKey, FIELDS.MANUFACTURER) as
    | string
    | undefined;
  const deviceModel1 = getFieldValue(storeKey, FIELDS.MODEL) as
    | string
    | undefined;
  const deviceSerialNumber1 = getFieldValue(
    storeKey,
    FIELDS.PRODUCTION_NUMBER
  ) as string | undefined;
  const deviceYearOfManufacture1 = getFieldValue(
    storeKey,
    FIELDS.PRODUCTION_YEAR
  ) as number | undefined;
  const deviceInformation1 = getFieldValue(storeKey, FIELDS.INFORMATION) as
    | string
    | undefined;
  const device1 = new UpdateDeviceInput(
    deviceType1,
    deviceManufacturer1,
    deviceModel1,
    deviceSerialNumber1,
    deviceYearOfManufacture1,
    deviceInformation1
  );

  storeKey.cardKey = 'deviceData2';
  const deviceType2 = getFieldValue(storeKey, FIELDS.SELECT_DEVICE_TYPE) as
    | DEVICE_TYPE
    | undefined;
  const deviceManufacturer2 = getFieldValue(storeKey, FIELDS.MANUFACTURER) as
    | string
    | undefined;
  const deviceModel2 = getFieldValue(storeKey, FIELDS.MODEL) as
    | string
    | undefined;
  const deviceSerialNumber2 = getFieldValue(
    storeKey,
    FIELDS.PRODUCTION_NUMBER
  ) as string | undefined;
  const deviceYearOfManufacture2 = getFieldValue(
    storeKey,
    FIELDS.PRODUCTION_YEAR
  ) as number | undefined;
  const deviceInformation2 = getFieldValue(storeKey, FIELDS.INFORMATION) as
    | string
    | undefined;
  const device2 = new UpdateDeviceInput(
    deviceType2,
    deviceManufacturer2,
    deviceModel2,
    deviceSerialNumber2,
    deviceYearOfManufacture2,
    deviceInformation2
  );

  storeKey.cardKey = 'productsAndTimeRecording';
  const articleEntries = getFieldValue(storeKey, FIELDS.ARTICLE_NUMBERS) as
    | ArticleNumberEntry[]
    | undefined;
  const articleInput = articleEntries?.map((entry) => {
    return new UpdateArticleInput(
      entry.articleNumber ?? undefined,
      entry.manufacturerNumber?.toString() ?? undefined,
      entry.count ?? undefined,
      entry.discount ?? undefined
    );
  });

  const timeRecordings = getFieldValue(storeKey, FIELDS.TIME_RECORDINGS) as
    | TimeRecordingEntry[]
    | undefined;
  const expensesInput = timeRecordings?.map((entry) => {
    return new UpdateExpenseInput(
      entry.taskType ?? undefined,
      entry.duration ?? undefined,
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
    undefined,
    job,
    undefined,
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
    [device1, device2],
    protocolDate,
    protocol,
    articleInput,
    expensesInput,
    totalAmount,
    employeeAbbreation,
    freeText,
    imageFileInputs
  );
}
