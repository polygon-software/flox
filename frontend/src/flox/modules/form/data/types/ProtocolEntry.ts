/**
 * ProtocolEntry class containing the protocol entry details
 */
export default class ProtocolEntry {
  date: Date | null;

  articleNumber: string | null;

  label: string | null;

  description: string | null;

  unit: string | null;

  amount: string | null;

  price: string | null;

  discount: string | null;

  sum: string | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    date: Date | null,
    articleNumber: string | null,
    label: string | null,
    description: string | null,
    unit: string | null,
    amount: string | null,
    price: string | null,
    discount: string | null,
    sum: string | null
  ) {
    this.date = date;
    this.articleNumber = articleNumber;
    this.label = label;
    this.description = description;
    this.unit = unit;
    this.amount = amount;
    this.price = price;
    this.discount = discount;
    this.sum = sum;
  }

  /**
   * Determines whether the protocol entry is complete
   * @returns - whether it's complete
   */
  isComplete(): boolean {
    return (
      this.date !== null &&
      this.articleNumber !== null &&
      this.label !== null &&
      this.description !== null &&
      this.unit !== null &&
      this.amount !== null &&
      this.price !== null &&
      this.discount !== null &&
      this.sum !== null
    );
  }
}
