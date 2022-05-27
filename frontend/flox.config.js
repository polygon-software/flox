module.exports = {
  // Flox modules to enable
  modules: {
    auth: true,
    roles: true,
    file: true,
    user: true,
  },
  moduleOptions: {
    roles: {
      // Some options could go here
    },
    auth: {
      twoFactor: true // whether to use 2FA
    }
  },
};
