import FormCard from './FormCard';

/**
 * A class representing a page of a form. Can hold multiple cards
 */
export default class FormPage {
  key: string;

  label: string;

  cards: FormCard[];

  // eslint-disable-next-line require-jsdoc
  constructor(key: string, label: string, cards: FormCard[]) {
    this.key = key;
    this.label = label;
    this.cards = cards;
  }

  /**
   * Returns all cards of the page.
   * @return {FormCard[]} - All cards
   */
  getAllCards(): FormCard[] {
    return this.cards;
  }

  /**
   * Returns the card for the given key.
   * @param {string} key - Name of the card to retrieve
   * @return {FormCard | null} - The matching card
   */
  getCard(key: string): FormCard | null {
    return (
      this.cards.find((card) => {
        return card.key === key;
      }) ?? null
    );
  }

  /**
   * Adds or updates a card to the page
   * @param {string} key - Name of the card to add or update
   * @param {FormCard} value - Card to add or update
   * @return {void}
   */
  setCard(key: string, value: FormCard): void {
    const existingCard = this.cards.find((card) => card.key === key);
    if (existingCard) {
      this.cards[this.cards.indexOf(existingCard)] = value;
    } else {
      this.cards.push(value);
    }
  }
}
