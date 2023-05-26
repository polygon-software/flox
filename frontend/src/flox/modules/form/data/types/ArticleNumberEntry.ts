/**
 * ArticleNumberEntry class containing the article number entry details
 */
export default class ArticleNumberEntry {
  articleNumber: string | null;

  manufacturerNumber: string | null;

  count: number | null;

  discount: number | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    articleNumber: string | null,
    manufacturerNumber: string | null,
    count: number | null,
    discount: number | null
  ) {
    this.articleNumber = articleNumber;
    this.manufacturerNumber = manufacturerNumber;
    this.count = count;
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
      this.count !== null &&
      this.discount !== null
    );
  }
}
