"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const Messages_1 = require("./Messages");
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(user) {
        const isExists = this.users.find((element) => element === user);
        if (!isExists) {
            this.users.push(user);
            this.addHandler(user);
        }
    }
    removeUser(user) {
        this.users.filter((item) => user !== item);
        // stop the game here
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === Messages_1.MESSAGE_TYPES.INIT_GAME) {
                    if (this.pendingUser) {
                        console.log("initiating the game");
                        const game = new Game_1.Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    }
                    else {
                        console.log("waiting for another user");
                        this.pendingUser = socket;
                    }
                }
                if (message.type === Messages_1.MESSAGE_TYPES.MOVE) {
                    const game = this.games.find((item) => item.user1 === socket || item.user2 === socket);
                    if (!game) {
                        return;
                    }
                    if (game) {
                        // type validation with zod
                        console.log(message.payload.move);
                        game.makeMove(socket, message.payload.move);
                    }
                }
            }
            catch (error) {
                console.log("error");
            }
        });
    }
}
exports.GameManager = GameManager;
