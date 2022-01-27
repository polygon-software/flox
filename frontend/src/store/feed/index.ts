import { Module, createComposable } from 'vuex-smart-module';
import FeedState from './state';
import FeedActions from './actions';
import FeedGetters from './getters';
import FeedMutations from './mutations';

const feedModule = new Module({
  state: FeedState,
  getters: FeedGetters,
  mutations: FeedMutations,
  actions: FeedActions,
});

export default feedModule;

// Create composable function
export const useFeedStore = createComposable(feedModule);
