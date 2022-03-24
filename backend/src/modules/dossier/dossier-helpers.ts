import { Dossier } from './entity/dossier.entity';
import { DOSSIER_FILE_TYPE, PROPERTY_TYPE } from '../../ENUM/ENUMS';

const needed = [
  DOSSIER_FILE_TYPE.ID,
  DOSSIER_FILE_TYPE.SALARY,
  DOSSIER_FILE_TYPE.PENSION,
  DOSSIER_FILE_TYPE.LAST_YEAR_SALARY,
  DOSSIER_FILE_TYPE.PENSION_ID,
  DOSSIER_FILE_TYPE.MORTGAGE_CONTRACT,
  DOSSIER_FILE_TYPE.PRODUCT_AGREEMENT,
  DOSSIER_FILE_TYPE.FLOOR_PLANS,
  DOSSIER_FILE_TYPE.PICTURES,
  DOSSIER_FILE_TYPE.PURCHASE_CONTRACT,
];

/**
 * Checks whether all required files are present
 * @param {Dossier} dossier - the dossier
 * @returns {boolean} - complete
 */
export function isCompleted(dossier: Dossier): boolean {
  // Dossiers with existing offers are by definition completed
  if (dossier.offers && dossier.offers.length > 0) {
    return true;
  }

  const complete = needed.every((type) => {
    return !!dossier.documents.find((docu) => {
      return (docu.file_type as unknown as DOSSIER_FILE_TYPE) == type;
    });
  });
  const owner_regulations =
    dossier.property_type !== PROPERTY_TYPE.APARTMENT ||
    !!dossier.documents.find(
      (docu) =>
        (docu.file_type as unknown as DOSSIER_FILE_TYPE) ==
        DOSSIER_FILE_TYPE.OWNER_REGULATIONS,
    );
  const management_regulations =
    dossier.property_type !== PROPERTY_TYPE.APARTMENT ||
    !!dossier.documents.find(
      (docu) =>
        (docu.file_type as unknown as DOSSIER_FILE_TYPE) ==
        DOSSIER_FILE_TYPE.MANAGEMENT_REGULATIONS,
    );

  const building_insurance =
    dossier.property_type !== PROPERTY_TYPE.ONE_FAMILY_HOUSE ||
    !!dossier.documents.find(
      (docu) =>
        (docu.file_type as unknown as DOSSIER_FILE_TYPE) ==
        DOSSIER_FILE_TYPE.BUILDING_INSURANCE,
    );
  return (
    complete &&
    owner_regulations &&
    management_regulations &&
    building_insurance
  );
}
