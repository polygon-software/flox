import FeedState from './state';
import { Actions } from 'vuex-smart-module';
import FeedGetters from './getters';
import FeedMutations from './mutations';

/**
 * This file contains all feedentication actions
 */
class FeedActions extends Actions<
  FeedState,
  FeedGetters,
  FeedMutations,
  FeedActions
> {}

export default FeedActions;
