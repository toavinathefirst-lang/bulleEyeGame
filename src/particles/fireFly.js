import { Game } from "../core/gameManager";
import { Particle } from "./particle";

export class fireFly extends Particle {
    /**
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    constructor(game, x, y, color) {
        super(game, x, y, color)
        this.speed.y = Math.random() * 3 + 2
    }

    /**
     * @returns {void}
     */
    update() {
        this.angle += this.velocityAngle
        this.collision.x += Math.cos(this.angle) * this.speed.x
        this.collision.y -= this.speed.y

        if (this.collision.y < 0 - this.radius) {
            this.markedForDeletion = true
            
        }
    }
}