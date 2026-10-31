import { Game } from "../core/gameManager";
import { GameObject } from "./gameObject";

export class Obstacle extends GameObject {
    /** @param {Game} game */
    constructor(game) {
        const radius = 80
        super(game, {
            x: radius + Math.random() * (game.width - radius * 2),
            y: radius + Math.random() * (game.height - radius * 2),
            collisionRadius: radius,
            imageId: "obstacles",
            spriteWidth: 250,
            spriteHeight: 250,
            spriteOffsetY: 70,
        })
        this.frame.x = Math.floor(Math.random() * 4)
        this.frame.y = Math.floor(Math.random() * 3)
    }
}