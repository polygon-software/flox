// Minimal representation of the entities
const descriptors = {
  Employee: ['uuid', 'readable_id', 'first_name', 'last_name'],
  Offer: ['uuid', 'bank', 'documents'],
  PrivateFile: ['uuid', 'key'],
  Address: ['street', 'number', 'city', 'zip_code'],
  Bank: ['uuid', 'readable_id', 'first_name', 'last_name'],
  Company: ['uuid', 'readable_id', 'first_name', 'last_name', 'company_name'],
  Dossier: ['uuid', 'readable_id', 'first_name', 'last_name', 'employee'],
  SoiAdmin: ['uuid', 'readable_id', 'first_name', 'last_name'],
  SoiEmployee: ['uuid', 'readable_id', 'first_name', 'last_name'],
};
/**
 * Prettifies important information of an entity
 * @param {unknown} entity - to prettify
 * @returns {string} - pretty representation
 */
export function prettify(entity: unknown): string {
  return JSON.stringify(reduce(entity, true));
}

/**
 * Reduces the entities field to only the primitives and a minimal representation of the non-primitives
 * @param {unknown} entity - to reduce
 * @param {boolean} allPrimitives - keep all primitives or take the minimal representation
 * @returns {Record<string, unknown>} - minimal object
 */
function reduce(
  entity: unknown,
  allPrimitives = false,
): Record<string, unknown> | unknown {
  if (entity === undefined || entity === null) {
    return;
  }
  if (entity instanceof Date || typeof entity !== 'object') {
    return entity;
  }
  if (Array.isArray(entity)) {
    return entity.map((item) => reduce(item));
  }

  const res = {};
  if (allPrimitives) {
    Object.keys(entity).forEach((key) => {
      res[key] = reduce(entity[key]);
    });
    return res;
  }

  const cls = entity.constructor.name;
  if (descriptors[cls]) {
    descriptors[cls].forEach((field) => {
      res[field] = reduce(entity[field]);
    });
  }
  return res;
}
