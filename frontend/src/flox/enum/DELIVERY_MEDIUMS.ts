/**
 * Defines how the password is delivered to the user after an admin created the user.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
enum DELIVERY_MEDIUMS {
  CUSTOM_EMAIL = 'CUSTOM_EMAIL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export default DELIVERY_MEDIUMS;
