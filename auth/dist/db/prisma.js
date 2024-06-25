"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient({
    log: ["query", "info", "warn"],
});
exports.default = db;
