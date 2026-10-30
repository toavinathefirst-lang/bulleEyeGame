import { Particle } from "./particle";

export class Spark extends Particle {
    /**
     * @param {import("./gameManager").Game} game
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    constructor(game, x, y, color) {
        super(game, x, y, color)
        this.radius = Math.random() * 5 + 4
        const direction = Math.random() * Math.PI * 2
        const force = Math.random() * 10 + 4
        this.velocity = {
            x: Math.cos(direction) * force,
            y: Math.sin(direction) * force
        }
        this.friction = 0.94
        this.gravity = 0.25
        this.shrink = 0.12
    }

    /**
     * @returns {void}
     */
    update() {
        this.velocity.x *= this.friction
        this.velocity.y *= this.friction
        this.velocity.y += this.gravity

        this.collision.x += this.velocity.x
        this.collision.y += this.velocity.y

        this.radius = Math.max(0, this.radius - this.shrink)
        if (this.radius <= 0.2) {
            this.markedForDeletion = true
            this.game.removeGameObjects()
        }
    }
}