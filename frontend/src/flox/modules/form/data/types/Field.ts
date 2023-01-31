/**
 * This type represents a field used in forms.
 * Required attributes
 * @key: Unique identifier
 * @component: A Vue component, which may also be custom. Must be marked as raw using 'markRaw'

 * Optional attributes
 * @type: A quasar type
 * @label: The fields displayed name
 * @lazyRules: Check at https://quasar.dev/vue-components/input
 * @rules: Rules that get applied to the input field, e.g. to check if a password is valid.
 * */
export type Field = {
  key: string;
  component: any;
  attributes: {
    rules: Array<(val: any) => boolean | string>;
    [key: string]: any;
  };
};
