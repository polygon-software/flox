
export interface ssrStateInterface {
  prefetchedData:  Record<string, unknown>
}
function state() {
  return {
    prefetchedData: {}
  }
}

export default state;
