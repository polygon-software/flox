module.exports = {
  // Flox modules to enable
  modules: {
    auth: true,
    roles: true,
    file: true,
    sharing: false,
  },
  moduleOptions: {
    roles: {
      // Some options could go here
      options: ['ADMIN', 'USER']
    },
    auth: {
      emailAsUsername: true,
    }
  },
  // TODO: This is not implemented yet, just an example.
  theme: {
    flat: true,
    radius: '0',
    primaryColor: '#FFAB12',
  }
};
