  // Flox modules to enable
export const modules = {
  auth: true,
  roles: true,
  file: true,
  sharing: false,
}
export const moduleOptions = {
  roles: {
    // Some options could go here
    options: ['ADMIN', 'SUPERUSER', 'USER']
  },
  auth: {
    emailAsUsername: true,
  }
}
// TODO: This is not implemented yet, just an example.
export const theme = {
  flat: true,
  radius: '0',
  primaryColor: '#FFAB12',
}
