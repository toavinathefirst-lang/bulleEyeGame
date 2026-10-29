import { Game } from "./gameManager";

export class Egg {
    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game
        this.collisionRadius = 40
        this.margin = this.collisionRadius * 2
        this.collision = {
            x: this.margin + Math.random() * (this.game.width - this.margin * 2),
            y: this.game.TOPMARGIN + Math.random() * (this.game.height - this.game.TOPMARGIN - this.margin)
        }

        /** @type {HTMLImageElement} */
        this.image = document.querySelector("img#egg")
        this.spriteWidth = 110
        this.spriteHeight = 135
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.sprite = {
            x: this.collision.x - this.width * 0.5,
            y: this.collision.y - this.height * 0.5 - 30
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @returns {void}
     */
    draw(context) {
        context.drawImage(this.image, this.sprite.x, this.sprite.y, this.width, this.height)
        if (this.game.debug) {
            context.beginPath()
            context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI * 2)
            context.save()
            context.globalAlpha = 0.5
            context.fill()
            context.restore()
            context.stroke()
        }
    }
    update(){
        
    }
}