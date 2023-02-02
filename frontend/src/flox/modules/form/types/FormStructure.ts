import { computed, ref, Ref } from 'vue';

import { useFormStore } from '../stores/form';

import FormPage from './FormPage';
import FormCard from './FormCard';
import { Field } from './Field';

/**
 * A class representing a form's structure (pages, cards, fields). Used to store data in Pinia stores
 */
export default class FormStructure {
  key: string;

  pages: FormPage[] = [];

  step: Ref<number> = ref(1);

  store;

  // eslint-disable-next-line require-jsdoc
  constructor(key: string, pages: FormPage[]) {
    this.key = key;
    this.pages = pages;
    this.store = useFormStore();
  }

  /**
   * Determines whether the current page is filled with valid data
   * (used to determine whether to allow going to next step within form)
   */
  pageValid = computed(() => {
    // If page structure does not exist, page can't be valid
    if (this.pages.length === 0) {
      return false;
    }

    // Offset by 1, since step starts at 1
    const currentPage = this.pages[this.step.value - 1];

    // For every card on current page, check every field's validity
    return currentPage.cards.every((card: FormCard) => {
      return card.fields.every((field: Field) => {
        const { rules } = field.attributes;
        return rules.every((rule: (valueElement: any) => boolean | string) => {
          // Get relevant value from stores
          const fieldValue =
            this.store.data[this.key]?.[currentPage.key]?.[card.key]?.[
              field.key
            ];
          // If the rule returns true, it is fulfilled (otherwise, it will return an error message)
          return (
            typeof rule(fieldValue) === 'boolean' && rule(fieldValue) === true
          );
        });
      });
    });
  });
}
