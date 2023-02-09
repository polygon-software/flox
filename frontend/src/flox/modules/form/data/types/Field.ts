/**
 * This type represents a field used in forms.
 */
export type Field = {
  key: string;
  component: unknown;
  attributes: {
    rules: Array<(val: any) => boolean | string>;
    [key: string]: unknown;
  };
};
