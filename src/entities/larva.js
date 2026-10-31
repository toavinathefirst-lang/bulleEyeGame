import { Game } from "../core/gameManager";
import { Creature } from "./creature";
import { fireFly } from "../particles/fireFly";
import { Spark } from "../particles/spark";

export class Larva extends Creature {
    /**
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     */
    constructor(game, x, y) {
        super(game, {
            x, y,
            collisionRadius: 30,
            imageId: "larva",
            spriteWidth: 150,
            spriteHeight: 150,
            spriteOffsetY: 75, 
        })
        this.frame.y = Math.floor(Math.random() * 2)
        this.frameTimer = 0
        this.frameInterval = 3.5
        this.speed = { y: 1.5 + Math.random() }
        this.updateSprite()
    }

    animate() {
        this.frameTimer++
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0
            this.frame.y = this.frame.y === 0 ? 1 : 0
        }
    }

    hasReachedSafeZone() {
        return this.collision.y < this.game.TOPMARGIN
    }

    isTouchingEnemy() {
        return this.game.enemies.some(enemy => this.collidesWith(enemy))
    }

    
    escape() {
        this.markedForDeletion = true
        this.game.addScore()
        this.game.spawnParticles(fireFly, this.collision.x, this.collision.y, "yellow", 8)
    }

    
    die() {
        this.markedForDeletion = true
        this.game.loseHatchling()
        this.game.spawnParticles(Spark, this.collision.x, this.collision.y, "blue", 5)
    }

    update() {
        this.collision.y -= this.speed.y
        this.animate()
        this.updateSprite()

        if (this.hasReachedSafeZone()) {
            this.escape()
            return
        }

        this.resolveCollisions()
        this.updateSprite()

        if (this.isTouchingEnemy()) this.die()
    }
}