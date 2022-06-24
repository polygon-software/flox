module.exports = {
  // Flox modules to enable
  modules: {
    auth: true,
    roles: true,
    file: true,
    sharing: false,
    email: true,
  },
  moduleOptions: {
    auth: {
      emailAsUsername: true,
    },
    roles: {
      roles: ['ADMIN', 'SUPERUSER', 'USER'],
    },
    email: {
      emailSender: 'david.wyss@polygon-software.ch',
    },
  },
};
