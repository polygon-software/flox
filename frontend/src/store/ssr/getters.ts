import SSRState from 'src/store/ssr/state';
import {Getters} from 'vuex-smart-module';


class SSRGetters extends Getters<SSRState>{

  getPrefetchedData(): (key: string) => unknown | undefined {
    return (key) => this.state.prefetchedData[key]
  }
}



export default SSRGetters;
