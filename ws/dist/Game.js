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
        this.user1.socket.send(JSON.stringify({
            type: Messages_1.MESSAGE_TYPES.INIT_GAME,
            payload: {
                color: "white",
                opponentDetails: {
                    name: user2.name,
                    email: user2.email,
                    userId: user2.userId,
                },
            },
        }));
        this.user2.socket.send(JSON.stringify({
            type: Messages_1.MESSAGE_TYPES.INIT_GAME,
            payload: {
                color: "black",
                opponentDetails: {
                    name: user1.name,
                    email: user1.email,
                    userId: user1.userId,
                },
            },
        }));
        this.moveCount = 0;
    }
    makeMove(user, move) {
        try {
            this.board.move(move);
        }
        catch (err) {
            user.socket.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.INVALID_MOVE,
                payload: {
                    message: "Invalid Move ! NOT ALLOWED",
                },
            }));
            this.error = err;
            console.log(err);
        }
        //  Game Over
        if (this.board.isGameOver()) {
            this.user1.socket.emit(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.user2.socket.emit(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
        }
        // Game Draw
        if (this.board.isDraw()) {
            this.user1.socket.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.DRAW,
                payload: {
                    message: "Game Draw",
                },
            }));
        }
        //
        if (this.moveCount % 2 === 0) {
            this.user2.socket.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.MOVE,
                payload: { move },
            }));
        }
        else {
            this.user1.socket.send(JSON.stringify({
                type: Messages_1.MESSAGE_TYPES.MOVE,
                payload: { move },
            }));
        }
        if (!this.error) {
            this.moveCount++;
            this.error = null;
        }
        console.log(this.moveCount);
    }
}
exports.Game = Game;
