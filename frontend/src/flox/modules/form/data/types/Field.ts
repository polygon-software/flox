import { ValidationRule } from 'quasar';

/**
 * This type represents a field used in forms.
 */
export interface Field<ComponentType = any, ComponentProps = any> {
  key: string;
  component: ComponentType;
  prependIcon?: string;
  appendIcon?: string;
  attributes: {
    rules: ValidationRule[];
    [key: string]: unknown;
  } & Omit<ComponentProps, 'modelValue'>;
}
