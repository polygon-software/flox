module.exports = {
  // Flox modules to enable
  modules: {
    auth: true,
    roles: false,
    file: true,
    sharing: false,
  },
  moduleOptions: {
    auth: {
      emailAsUsername: true,
    },
    roles: {
      roles: ['CHUNGUS', 'YEETUS', 'ADMIN'],
    },
  },
};
