import FeedState from './state';
import { Getters } from 'vuex-smart-module';
import { CATEGORY } from '../../../../shared/definitions/ENUM';

/**
 * Getters
 */
class FeedGetters extends Getters<FeedState> {
  /**
   * Get feed categories
   * @returns {CATEGORY[]} - feed categories
   */
  getCategories(): CATEGORY[] {
    return this.state.categories;
  }
  /**
   * Get feed brands
   * @returns {string[]} - feed brands
   */
  getBrands(): string[] {
    return this.state.brands;
  }
}

export default FeedGetters;
