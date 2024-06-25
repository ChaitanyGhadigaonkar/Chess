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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const passport_1 = __importDefault(require("passport"));
const authRouter = (0, express_1.Router)();
authRouter.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const user = req.user;
        const userFromDb = yield prisma_1.default.user.findFirst({
            where: {
                id: user.id,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.id }, process.env.JWT_SECRET);
        res.status(200).json({
            user: {
                userId: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.id,
                name: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.name,
                email: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.email,
            },
            token: token,
        });
    }
    else {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}));
authRouter.get("/login/failed", (req, res) => {
    res.status(401).json({ success: false, message: "failed to login" });
});
authRouter.get("/logout", (req, res) => {
    req.logout((error) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "failed to logout" });
        }
        else {
            res.clearCookie("jwt");
            res.redirect("http://localhost:5173");
        }
    });
});
authRouter.get("/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
authRouter.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "/auth/login/failed",
}));
exports.default = authRouter;
