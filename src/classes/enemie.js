import { Game } from "./gameManager";

export class Enemy {
    /**
     * @param {Game} game
     */
    constructor(game) {
        
        this.game = game
        this.collisionRadius = 30
        this.collision = {
            x: this.game.width,
            y:this.game.TOPMARGIN+(Math.random() * (this.game.height - this.game.TOPMARGIN))
        }
        this.speed = {
            x: Math.random() * 3 + 5
        }

        /** @type {HTMLImageElement} */
        this.image = document.querySelector("img#toad")
        console.log(this.image.naturalWidth, this.image.naturalHeight)
        this.spriteWidth = 140
        this.spriteHeight = 260
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteOffsetY = 105
        this.sprite = { x: 0, y: 0 }
        this.frame = {
            x: 0,
            y: Math.floor(Math.random() * 4)
        }
        this.updateSprite()
    }

    /**
     * @returns {void}
     */
    updateSprite() {
        this.sprite.x = this.collision.x - this.width * 0.5
        this.sprite.y = this.collision.y - this.height * 0.5 - this.spriteOffsetY
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @returns {void}
     */
    draw(context) {
        context.drawImage(
            this.image,
            this.frame.x * this.spriteWidth, this.frame.y * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.sprite.x, this.sprite.y, this.width, this.height
        )
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
        this.collision.x -= this.speed.x

        if (this.collision.x + this.width * 0.5 < 0 && !this.game.gameOver) {
            this.collision.x = this.game.width + Math.random() * this.game.width * 0.5
            this.collision.y = this.game.TOPMARGIN + Math.random() * (this.game.height - this.game.TOPMARGIN)
        }

        this.updateSprite()
        let collisionObjects = [this.game.player, ...this.game.obstacles]
        collisionObjects.forEach(object=>{
            let [collisionCheck, distance, sumOfRadi, dx, dy] =this.game.checkCollision(this,object)
            if(collisionCheck){
                const unit={
                    x:dx/distance,y:dy/distance,
                }
                this.collision.x=object.collision.x + (sumOfRadi + 1) * unit.x
                this.collision.y=object.collision.y + (sumOfRadi + 1) * unit.y
            }
        })
    }
}