import { formatDate } from 'src/format/date.format';

/**
 * Recursive search
 *
 * @param target - where to search
 * @param term - what to search
 * @param depthLimit - search limit
 * @returns found
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
    const numericComparison =
      !Number.isNaN(Number(term)) && Math.abs(Number(term) - target) < 0.1;
    const stringComparison = target.toString().includes(term);
    return numericComparison || stringComparison;
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

/**
 * Preprocessor for search, to be used in q-tables as :filter-method
 *
 * @param target - where to search
 * @param term - what to search
 * @param depthLimit - search limit
 * @returns found
 */
export function deepFilter(target: any, term: string, depthLimit = 5): boolean {
  const cleanTerm = term.trim();
  return cleanTerm.split(' ').every((part) => {
    return recursiveFilter(target, part.toLowerCase(), depthLimit);
  });
}

/**
 * Search Filter for Quasar <q-table>s
 *
 * @param rows - rows
 * @param terms - search key
 * @returns filtered rows
 */
export function tableFilter(
  rows: Record<string, unknown>[],
  terms: string
): Record<string, unknown>[] {
  return rows.filter((row) => deepFilter(row, terms));
}
