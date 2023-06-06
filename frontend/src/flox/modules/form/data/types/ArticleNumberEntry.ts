/**
 * ArticleNumberEntry class containing the article number entry details
 */
export default class ArticleNumberEntry {
  articleNumber: string | null;

  manufacturerNumber: string | null;

  amount: number | null;

  discount: number | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    articleNumber: string | null,
    manufacturerNumber: string | null,
    amount: number | null,
    discount: number | null
  ) {
    this.articleNumber = articleNumber;
    this.manufacturerNumber = manufacturerNumber;
    this.amount = amount;
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
      this.amount !== null &&
      this.discount !== null
    );
  }
}
