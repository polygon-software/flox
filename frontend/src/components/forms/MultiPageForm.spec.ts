import { MultiPageForm } from 'components/forms/MultiPageForm';
import { FIELDS } from 'src/flox/modules/auth/components/forms/fields';

describe('Form Helpers', () => {
  describe('updateValue', () => {
    it('should update the value', () => {
      const form = new MultiPageForm();
      form.updateValue('testKey', 'test_value');
      expect(form.values.value).toStrictEqual({ testKey: 'test_value' });
    });
  });

  describe('forms', () => {
    let form: MultiPageForm;

    const accountFields = [FIELDS.EMAIL, FIELDS.USERNAME];
    const invalidPassword = 'Schnabeltier';
    const validPassword = 'Schnabeltier1234?';

    beforeEach(() => {
      form = new MultiPageForm();
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
          fields: accountFields,
        },
        {
          key: 'passwordRepeat',
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
          fields: accountFields,
        },
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value.passwordRepeat = validPassword;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that one filled page as a first page and one empty page as a second page, both together are valid', () => {
      form.pages.value = [
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
        {
          key: 'account_data',
          label: 'Account',
          fields: accountFields,
        },
      ];
      form.values.value.passwordRepeat = validPassword;
      expect(form.pageValid.value).toBe(true);
    });

    it('should return that one filled page is valid', () => {
      form.pages.value = [
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value.passwordRepeat = validPassword;
      expect(form.pageValid.value).toBe(true);
    });

    it('should return that one filled page with wrong key is not valid', () => {
      form.pages.value = [
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value.pw = validPassword;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that one filled page with invalid type is not valid', () => {
      form.pages.value = [
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value.passwordRepeat = 2737827;
      expect(form.pageValid.value).toBe(false);
    });

    it('should return that an invalid input is not valid', () => {
      form.pages.value = [
        {
          key: 'passwordRepeat',
          label: 'Password',
          fields: [FIELDS.PASSWORD_REPEAT],
        },
      ];
      form.values.value.passwordRepeat = invalidPassword;
      expect(form.pageValid.value).toBe(false);
    });
  });
});
