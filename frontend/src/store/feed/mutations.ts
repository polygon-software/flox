import FeedState from './state';
import { Mutations } from 'vuex-smart-module';
import { CATEGORY } from '../../../../shared/definitions/ENUM';

/**
 * Feed mutations
 */
class FeedMutations extends Mutations<FeedState> {
  /**
   * Set categories that are in the current feed
   * @param {CATEGORY[]} categories - feed categories
   * @returns {void} - void
   */
  setCategories(categories: CATEGORY[]): void {
    this.state.categories = categories;
  }
  /**
   * Set brands that are in the current feed
   * @param {string[]} brands - feed brands
   * @returns {void} - void
   */
  setBrands(brands: string[]): void {
    this.state.brands = brands;
  }
}

export default FeedMutations;
