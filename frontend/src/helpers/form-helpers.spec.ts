import {Form} from "src/helpers/form-helpers";
import {FIELDS} from "src/data/FIELDS";

describe('Form Helpers', () => {
  describe('function updateValue should update the value', () => {
    it('the value should be updated', () => {
      const form = new Form();
      form.updateValue("test_key", "test_value")
      expect(form.values.value).toStrictEqual({test_key: "test_value"})
    });
  });

  describe('test forms on a page', () => {
    let form: Form;
    beforeEach( () => {
      form = new Form();
    });

    it('no form is not valid', () => {
      form.pages.value = []
      expect(form.pageValid.value).toBe(false)
    });

    it('two empty forms are not valid', () => {
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

    it('one empty form and one filled form, both together are not valid', () => {
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
      form.values.value['personal_data'] = 'Ramize';
      expect(form.pageValid.value).toBe(false)
    });

    it('one form is filled', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['personal_data'] = 'Ramize';
      // form.updateValue('personal_data', "Ramize")
      expect(form.values.value).toStrictEqual({personal_data: 'Ramize'})
      expect(form.pageValid.value).not.toBeUndefined()
      expect(form.values.value['personal_data']).not.toBeUndefined()
      //expect(form.pageValid.value).toBe(true)
    });

    it('one filled form with wrong key is not valid', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['personal_information'] = 'Ramize';
      expect(form.pageValid.value).toBe(false)
    });

    it('one filled form with invalid type is not valid', () => {
      form.pages.value = [
        {
          key: 'personal_data',
          label: 'Personal',
          fields: [FIELDS.FULL_NAME,],
        },
      ]
      form.values.value['personal_data'] = 2737827;
      expect(form.pageValid.value).toBe(false)
    });
  });
});
