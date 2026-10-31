import { Game } from "../core/gameManager";
import { Creature } from "./creature";
import { Larva } from "./larva";

export class Egg extends Creature {
    /** @param {Game} game */
    constructor(game) {
        const radius = 40
        const margin = radius * 2
        super(game, {
            x: margin + Math.random() * (game.width - margin * 2),
            y: game.TOPMARGIN + Math.random() * (game.height - game.TOPMARGIN - margin),
            collisionRadius: radius,
            imageId: "egg",
            spriteWidth: 110,
            spriteHeight: 135,
            spriteOffsetY: 30,
        })
        this.hatchTimer = 0
        this.hatchInterval = 3000
    }

    
    getBlockers() {
        return [...super.getBlockers(), ...this.game.enemies, ...this.game.hatchlings]
    }

   
    drawSprite(context) {
        context.drawImage(this.image, this.sprite.x, this.sprite.y, this.width, this.height)
    }

    drawDebug(context) {
        super.drawDebug(context)
        const seconds = (this.hatchTimer * 0.001).toFixed(0)
        context.fillText(seconds, this.collision.x, this.collision.y - this.collisionRadius * 2.5)
    }

    hatch() {
        this.game.hatchlings.push(new Larva(this.game, this.collision.x, this.collision.y))
        this.markedForDeletion = true
    }

    update(deltatime) {
        this.resolveCollisions()
        this.clampToArena()
        this.updateSprite()

        if (this.hatchTimer > this.hatchInterval) this.hatch()
        else this.hatchTimer += deltatime
    }
}