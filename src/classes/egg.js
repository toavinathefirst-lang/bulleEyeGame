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

    /**
     * @returns {void}
     */
    update() {
        const collisionObject = [this.game.player, ...this.game.obstacles,...this.game.enemies]
        collisionObject.forEach(object => {
            const [collision, distance, sumOfRadi, dx, dy] = this.game.checkCollision(this, object)
            if (collision && distance > 0) {
                const unit = { x: dx / distance, y: dy / distance }
                this.collision.x = object.collision.x + (sumOfRadi + 1) * unit.x
                this.collision.y = object.collision.y + (sumOfRadi + 1) * unit.y
            }
        })

        this.keepInBounds()

        this.sprite = {
            x: this.collision.x - this.width * 0.5,
            y: this.collision.y - this.height * 0.5 - 30
        }
    }

    /**
     * Remet l'œuf dans la map s'il touche ou dépasse un bord (gauche, droite, bas)
     * et le décale légèrement vers l'intérieur.
     * @returns {void}
     */
    keepInBounds() {
        const push = 3
        const r = this.collisionRadius
        const g = this.game

        const left = r
        const right = g.width - r
        const bottom = g.height - r
        const top = g.TOPMARGIN + r

        if (this.collision.x <= left) this.collision.x = left + push
        else if (this.collision.x >= right) this.collision.x = right - push

        if (this.collision.y >= bottom) this.collision.y = bottom - push

        if (this.collision.y < top) this.collision.y = top
    }
}