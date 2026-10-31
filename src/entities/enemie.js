import { Game } from "../core/gameManager";
import { Creature } from "./creature";

export class Enemy extends Creature {
    /** @param {Game} game */
    constructor(game) {
        super(game, {
            x: game.width,
            y: 0,
            collisionRadius: 30,
            imageId: "toad",
            spriteWidth: 140,
            spriteHeight: 260,
            spriteOffsetY: 105,
        })
        this.speed = { x: Math.random() * 3 + 5 }
        this.frame.y = Math.floor(Math.random() * 4)
        this.collision.y = this.randomY()
        this.updateSprite()
    }

    randomY() {
        const top = this.game.TOPMARGIN
        return top + Math.random() * (this.game.height - top)
    }

    isOffScreenLeft() {
        return this.collision.x + this.width * 0.5 < 0
    }

    respawn() {
        this.collision.x = this.game.width + Math.random() * this.game.width * 0.5
        this.collision.y = this.randomY()
    }

    update() {
        this.collision.x -= this.speed.x
        if (this.isOffScreenLeft() && !this.game.gameOver) this.respawn()
        this.resolveCollisions()
        this.updateSprite()
    }
}