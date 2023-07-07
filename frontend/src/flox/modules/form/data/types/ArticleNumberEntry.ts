/**
 * ArticleNumberEntry class containing the article number entry details
 */
export default class ArticleNumberEntry {
  articleNumber: string | null;

  manufacturerNumber: string | null;

  name: string | null;

  amount: number | null;

  price: number | null;

  discount: number | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    articleNumber: string | null,
    manufacturerNumber: string | null,
    name: string | null,
    amount: number | null,
    price: number | null,
    discount: number | null
  ) {
    this.articleNumber = articleNumber;
    this.manufacturerNumber = manufacturerNumber;
    this.name = name;
    this.amount = amount;
    this.price = price;
    this.discount = discount;
  }

  /**
   * Determines whether the article number entry is complete
   * @returns - whether it's complete
   */
  isComplete(): boolean {
    return (
      this.articleNumber !== null &&
      this.manufacturerNumber !== null &&
      this.name !== null &&
      this.amount !== null &&
      this.price !== null &&
      this.discount !== null
    );
  }
}
