const descriptors = {
  Employee: ['uuid', 'readable_id', 'first_name', 'last_name'],
};

/**
 * prettifies important information of an entity
 * @param {unknown} entity - to prettify
 * @returns {string} - pretty representation
 */
export function prettify(entity: unknown): Record<string, unknown> {
  const res = {};
  Object.keys(entity).forEach((key) => {
    const value = entity[key];
    if (value instanceof Date || typeof value !== 'object') {
      res[key] = value;
    }
    if (Array.isArray(value)) {
      res[key] = value.map((item) => {
        return prettify(item);
      });
    }
    const cls = value.constructor.name;
    if (descriptors[cls]) {
      res[key] = {};
      descriptors[cls].forEach((field) => {
        res[key][field] = prettify(value[key]);
      });
    }
  });
  return res;
}
