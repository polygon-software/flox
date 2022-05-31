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
      twoFactor: true,
      emailAsUsername: true,
    }
  },
};
