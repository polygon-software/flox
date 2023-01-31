import { Field } from './Field';

/**
 * A class representing a card of a form. Holds multiple fields that belong logically together.
 */
export default class FormCard {
  key: string;

  fields: Field[];

  label?: string;

  imagePath?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    key: string,
    fields: Field[],
    label?: string,
    imagePath?: string
  ) {
    this.key = key;
    this.fields = fields;
    this.label = label ?? undefined;
    this.imagePath = imagePath ?? undefined;
  }

  /**
   * Returns all fields of the card.
   * @return {Field[]} - All fields
   */
  getAllFields(): Field[] {
    return this.fields;
  }

  /**
   * Returns the field(s) for the given key.
   * @param key - Name of the field
   * @returns The matching field
   */
  getField(key: string): unknown | null {
    return this.fields.find((field) => field.key === key) ?? null;
  }

  /**
   * Adds or updates a field.
   * @param key - Name of the field
   * @param value Field to add or update
   * @returns void
   */
  setField(key: string, value: Field): void {
    const existingField = this.fields.find((field) => field.key === key);
    if (existingField) {
      this.fields[this.fields.indexOf(existingField)] = value;
    } else {
      this.fields.push(value);
    }
  }
}
