import { Form } from 'src/helpers/form/form-helpers';
import { FIELDS } from 'src/data/FIELDS';
import { expect } from '@jest/globals';

describe('Form Helpers', () => {
  describe('updateValue', () => {
    it('should update the value', () => {
      const form = new Form();
      form.updateValue('test_key', 'test_value');
      expect(form.values.value).toStrictEqual({ test_key: 'test_value' });
    });
  });

  describe('forms', () => {
    let form: Form;

    const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME];
    const invalidPassword = 'Schnabeltier';
    const validPassword = 'Schnabeltier1234?';

    beforeEach(() => {
      form = new Form();
    });

    it('should return that no form is not valid', () => {
      form.pages.value = [];
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that two empty pages are not valid', () => {
      form.pages.value = [
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that one empty page as a first page and one filled page as a second page, both together are not valid', () => {
      form.pages.value = [
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value['password_repeat'] = validPassword;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that one filled page as a first page and one empty page as a second page, both together are valid', () => {
      form.pages.value = [
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
      ];
      form.values.value['password_repeat'] = validPassword;
      expect(form.pageValid.value).toBe(true);
    });

    it('should return that one filled page is valid', () => {
      form.pages.value = [
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value['password_repeat'] = validPassword;
      expect(form.pageValid.value).toBe(true);
    });

    it('should return that one filled page with wrong key is not valid', () => {
      form.pages.value = [
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value['pw'] = validPassword;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that one filled page with invalid type is not valid', () => {
      form.pages.value = [
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value['password_repeat'] = 2737827;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that an invalid input is not valid', () => {
      form.pages.value = [
        {
          key: 'password_repeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value['password_repeat'] = invalidPassword;
      expect(form.pageValid.value).toBe(false);
    });
  });
});
