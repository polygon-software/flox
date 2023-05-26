import { Field } from './Field';

/**
 * A class representing a card of a form. Holds multiple fields that belong logically together.
 */
export default class FormCard {
  key: string;

  fieldRows: Array<Field[] | Field>;

  label?: string;

  imagePath?: string;

  constructor(
    key: string,
    fieldRows: Array<Field[] | Field>,
    label?: string,
    imagePath?: string
  ) {
    this.key = key;
    this.fieldRows = fieldRows;
    this.label = label ?? undefined;
    this.imagePath = imagePath ?? undefined;
  }

  /**
   * Returns all fields of the card.
   * @return - All fields
   */
  getAllFields(): Array<Field[] | Field> {
    return this.fieldRows;
  }
}
