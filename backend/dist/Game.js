"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(user1, user2) {
        this.user1 = user1;
        this.user2 = user2;
        this.board = new chess_js_1.Chess();
        this.user1.send(JSON.stringify({
            type: Messages_1.MESSAGE_TYPES.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.user2.send(JSON.stringify({
            type: Messages_1.MESSAGE_TYPES.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
        this.moveCount = 0;
    }
    makeMove(user, move) {
        try {
            this.board.move(move);
        }
        catch (err) {
            user.send("Invalid Move ! NOT ALLOWED");
            console.log(err);
        }
        if (this.board.isGameOver()) {
            this.user1.emit(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.user2.emit(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
        }
        if (this.moveCount % 2 === 0) {
            this.user2.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.MOVE,
                payload: move,
            }));
        }
        else {
            this.user1.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
