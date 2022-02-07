import {Form} from 'src/helpers/form-helpers';
import {FIELDS} from 'src/data/FIELDS';

describe('Form Helpers', () => {
  describe('updateValue', () => {
    it('should update the value', () => {
      const form = new Form();
      form.updateValue('test_key', 'test_value')
      expect(form.values.value).toStrictEqual({test_key: 'test_value'})
    });
  });

  describe('forms', () => {
    let form: Form;
    let any_name: string;
    beforeEach( () => {
      form = new Form();
      any_name = 'Ramize Abdili';
    });
    it('should return that no form is not valid', () => {
      form.pages.value = []
      expect(form.pageValid.value).toBe(false)
    });
    it('should return that two empty pages are not valid', () => {
      const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
      form.pages.value = [
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      expect(form.pageValid.value).toBe(false)
      });
    it('should return that one empty page as a first page and one filled page as a second page, both together are not valid', () => {
      const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
      form.pages.value = [
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['full_name'] = any_name
      expect(form.pageValid.value).toBe(false)
    });
    it('should return that one filled page as a first page and one empty page as a second page, both together are valid', () => {
      const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
        {
          key: 'account_data',
          label: 'Account',
          fields: account_fields,
        },
      ]
      form.values.value['full_name'] = any_name
      expect(form.pageValid.value).toBe(true)
    });
    it('should return that one filled page is valid', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['full_name'] = any_name // {first_name: 'Ramize', last_name: 'Abdili'}
      expect(form.pageValid.value).not.toBeUndefined()
      expect(form.values.value['full_name']).toStrictEqual(any_name)
      expect(form.pageValid.value).toBe(true)
    });
    it('should return that one filled page with wrong key is not valid', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['name'] = any_name
      expect(form.pageValid.value).toBe(false)
    });
    it('should return that one filled page with invalid type is not valid', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['full_name'] = 2737827;
      expect(form.pageValid.value).toBe(false)
    });
  });
});
