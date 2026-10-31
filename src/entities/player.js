import { Game } from "../core/gameManager";
import { GameObject } from "./gameObject";


const DIRECTION_FRAMES = [6, 7, 0, 1, 2, 3, 4, 5, 6]

export class Player extends GameObject {
    /** @param {Game} game */
    constructor(game) {
        super(game, {
            x: game.width * 0.5,
            y: game.height * 0.5,
            collisionRadius: 45,
            imageId: "bull",
            spriteWidth: 255,
            spriteHeight: 255,
            spriteOffsetY: 80,
        })
        this.angle = 0
        this.lineLength = 80
        this.maxSpeed = 15
        this.speed = { x: 0, y: 0 }
    }

    restart() {
        this.collision.x = this.game.width * 0.5
        this.collision.y = this.game.height * 0.5
        this.speed.x = 0
        this.speed.y = 0
        this.angle = 0
        this.frame.y = 0
        this.updateSprite()
    }

    getBlockers() {
        return this.game.obstacles
    }

    /** @param {CanvasRenderingContext2D} context */
    drawDebug(context) {
        super.drawDebug(context)
        context.beginPath()
        context.moveTo(this.collision.x, this.collision.y)
        context.lineTo(
            this.collision.x + Math.cos(this.angle) * this.lineLength,
            this.collision.y + Math.sin(this.angle) * this.lineLength
        )
        context.stroke()
    }

    /**
     * @param {number} dx
     * @param {number} dy
     */
    updateDirectionFrame(dx, dy) {
        const sector = Math.round(Math.atan2(dy, dx) / (Math.PI / 4))
        this.frame.y = DIRECTION_FRAMES[sector + 4]
    }

    moveTowardMouse() {
        const { x, y } = this.game.mouse
        const dx = x - this.collision.x || 0
        const dy = y - this.collision.y || 0
        const distance = Math.hypot(dx, dy)

        if (distance > 1) {
            const speed = Math.min(this.maxSpeed, distance)
            this.speed.x = (dx / distance) * speed
            this.speed.y = (dy / distance) * speed
            this.collision.x += this.speed.x
            this.collision.y += this.speed.y
            this.angle = Math.atan2(dy, dx)
            this.updateDirectionFrame(dx, dy)
        } else {
            this.speed.x = 0
            this.speed.y = 0
        }
    }

    update() {
        this.moveTowardMouse()
        this.resolveCollisions()
        this.clampToArena()
        this.updateSprite()
    }
}