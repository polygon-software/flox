"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    server: {
        port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
});
//# sourceMappingURL=configuration.js.map