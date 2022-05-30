module.exports = {
  // Flox modules to enable
  modules: {
    auth: true,
    roles: true,
    file: true,
    user: true,
    sharing: false,
  },
  moduleOptions: {
    roles: {
      // Some options could go here
      options: ['ADMIN', 'USER']
    },
    auth: {
      twoFactor: true // whether to use 2FA
    }
  },
};
