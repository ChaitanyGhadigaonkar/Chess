"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const passport_1 = __importDefault(require("passport"));
function passportConfig() {
    passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
        // match user
        const user = { id: 1, username: username, password: password };
        return done(null, user);
    }));
}
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    // find user by id
    const user = { id: 1, username: "admin", password: "admin" };
    return done(null, user);
});
exports.default = passportConfig;
