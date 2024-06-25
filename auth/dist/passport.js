"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github2_1 = require("passport-github2");
const passport_1 = __importDefault(require("passport"));
const prisma_1 = __importDefault(require("./db/prisma"));
function passportConfig() {
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5173/auth/github/callback",
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://api.github.com/user/emails`, {
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            });
            const data = yield res.json();
            const primaryEmail = data.find((item) => item.primary);
            const user = yield prisma_1.default.user.upsert({
                create: {
                    email: profile.email,
                    name: profile.displayName,
                },
                update: {
                    name: profile.displayName,
                },
                where: {
                    email: primaryEmail === null || primaryEmail === void 0 ? void 0 : primaryEmail.email,
                },
            });
            done(null, user);
        });
    }));
}
passport_1.default.serializeUser((user, done) => {
    done(null, {
        id: user.id,
        username: user.username,
    });
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});
exports.default = passportConfig;
