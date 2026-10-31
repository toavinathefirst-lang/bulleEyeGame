import { Game } from "../core/gameManager"

export class GameObject {
    /**
     * @param {Game} game
     * @param {Object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {number} options.collisionRadius
     * @param {string} options.imageId  id de la balise <img> dans le HTML
     * @param {number} options.spriteWidth
     * @param {number} options.spriteHeight
     * @param {number} [options.spriteOffsetY=0]
     */
    constructor(game, { x, y, collisionRadius, imageId, spriteWidth, spriteHeight, spriteOffsetY = 0 }) {
        this.game = game
        this.collision = { x, y }
        this.collisionRadius = collisionRadius

        /** @type {HTMLImageElement} */
        this.image = document.getElementById(imageId)
        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.width = spriteWidth
        this.height = spriteHeight
        this.spriteOffsetY = spriteOffsetY

        this.sprite = { x: 0, y: 0 }
        this.frame = { x: 0, y: 0 }
        this.markedForDeletion = false

        this.updateSprite()
    }

   

    /** Place le sprite par rapport au cercle de collision. */
    updateSprite() {
        this.sprite.x = this.collision.x - this.width * 0.5
        this.sprite.y = this.collision.y - this.height * 0.5 - this.spriteOffsetY
    }



    /**
     * 
     * 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        this.drawSprite(context)
        if (this.game.debug) this.drawDebug(context)
    }

    /** @param {CanvasRenderingContext2D} context */
    drawSprite(context) {
        context.drawImage(
            this.image,
            this.frame.x * this.spriteWidth, this.frame.y * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.sprite.x, this.sprite.y, this.width, this.height
        )
    }

    /** @param {CanvasRenderingContext2D} context */
    drawDebug(context) {
        context.beginPath()
        context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI * 2)
        context.save()
        context.globalAlpha = 0.5
        context.fill()
        context.restore()
        context.stroke()
    }

  

    /** À redéfinir dans les enfants qui bougent. */
    update(deltatime = 0) {}

   

    /**
     * @param {GameObject} other
     * @returns {{ collided: boolean, distance: number, sumOfRadii: number, dx: number, dy: number }}
     */
    measure(other) {
        const dx = this.collision.x - other.collision.x
        const dy = this.collision.y - other.collision.y
        const distance = Math.hypot(dx, dy)
        const sumOfRadii = this.collisionRadius + other.collisionRadius
        return { collided: distance < sumOfRadii, distance, sumOfRadii, dx, dy }
    }

    /** @param {GameObject} other */
    collidesWith(other) {
        return this.measure(other).collided
    }

    /**
     * @param {GameObject} other
     * @param {number} [buffer=0] distance de sécurité supplémentaire
     */
    overlaps(other, buffer = 0) {
        const { distance, sumOfRadii } = this.measure(other)
        return distance < sumOfRadii + buffer
    }

    /**
     * Liste des objets qui BLOQUENT celui-ci .
     * @returns {GameObject[]}
     */
    getBlockers() {
        return []
    }

    /** Repousse l'objet hors de tous ses bloqueurs. */
    resolveCollisions() {
        for (const other of this.getBlockers()) {
            const { collided, distance, sumOfRadii, dx, dy } = this.measure(other)
            if (collided && distance > 0) {
                this.collision.x = other.collision.x + (sumOfRadii + 1) * (dx / distance)
                this.collision.y = other.collision.y + (sumOfRadii + 1) * (dy / distance)
            }
        }
    }

    /** Garde le cercle de collision dans l'arène . */
    clampToArena() {
        const r = this.collisionRadius
        const g = this.game
        this.collision.x = Math.min(Math.max(this.collision.x, r), g.width - r)
        this.collision.y = Math.min(Math.max(this.collision.y, g.TOPMARGIN + r), g.height - r)
    }
}