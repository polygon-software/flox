import { formatDate } from 'src/format/date.format';

/**
 * Search Filter for Quasar <q-table>s
 * @param {Record<string, unknown>[]} rows - rows
 * @param {string} terms - search key
 * @returns {Record<string, unknown>[]} - filtered rows
 */
export function tableFilter(
  rows: Record<string, unknown>[],
  terms: string
): Record<string, unknown>[] {
  return rows.filter((row) => deepFilter(row, terms));
}

/**
 * Preprocessor for search, to be used in q-tables as :filter-method
 * @param {unknown} target - where to search
 * @param {string} term - what to search
 * @param {number} depthLimit - search limit
 * @returns {boolean} - found
 */
export function deepFilter(target: any, term: string, depthLimit = 5): boolean {
  const cleanTerm = term.trim();
  return cleanTerm.split(' ').every((part) => {
    return recursiveFilter(target, part.toLowerCase(), depthLimit);
  });
}

/**
 * Recursive search
 * @param {unknown} target - where to search
 * @param {string} term - what to search
 * @param {number} depthLimit - search limit
 * @returns {boolean} - found
 */
function recursiveFilter(target: any, term: string, depthLimit = 5): boolean {
  if (target === term) {
    return true;
  }

  if (target instanceof Date) {
    return formatDate(target) === term;
  }

  if (typeof target === 'boolean') {
    return String(target) === term;
  }

  if (typeof target === 'number') {
    const numeric_comparison =
      !isNaN(Number(term)) && Math.abs(Number(term) - target) < 0.1;
    const string_comparison = target.toString().includes(term);
    return numeric_comparison || string_comparison;
  }

  if (typeof target === 'string') {
    return target.toLowerCase().includes(term);
  }
  // Cutoff
  if (depthLimit === 0) {
    return false;
  }

  if (Array.isArray(target)) {
    return target.some((item) => {
      return recursiveFilter(item, term, depthLimit - 1);
    });
  }
  if (typeof target === 'object') {
    return Object.values(target as Record<string, unknown>).some((field) => {
      if (field !== undefined && field !== null) {
        return recursiveFilter(field, term, depthLimit - 1);
      }
      return false;
    });
  }
  return false;
}
