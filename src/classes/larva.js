
import { Game } from "./gameManager";

export class larva {
    /**
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     */
    constructor(game, x, y) {
        this.game = game
        this.collision = {
            x: x,
            y: y
        }
        this.collisionRadius = 30

        /** @type {HTMLImageElement} */
        this.image = document.querySelector("img#larva")

        this.spriteWidth = 150
        this.spriteHeight = 150
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteOffsetY = 25
        this.markedForDeletion=false
        this.sprite = {
            x: 0,
            y: 0
        }
        this.frame = {
            x: 0,
            y: Math.floor(Math.random() * 2)
        }
        this.frameTimer = 0
        this.frameInterval = 3.5

        this.speed = {
            y: 1.5 + Math.random()
        }

        this.updateSprite()
    }

    /**
     * @returns {void}
     */
    updateSprite() {
        this.sprite.x = this.collision.x - this.width * 0.5
        this.sprite.y = this.collision.y - this.height * 0.5 - this.spriteOffsetY -50
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
        this.collision.y -= this.speed.y

        this.frameTimer++
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0
            this.frame.y = this.frame.y === 0 ? 1 : 0
        }

        this.updateSprite()
        if( this.collision.y<this.game.TOPMARGIN){
            this.markedForDeletion = true;
            this.game.removeGameObjects()
            this.game.score++
            console.log("Score:"+this.game.score );
                    
        }

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

        //collision with enemies 
        this.game.enemies.forEach(enemy=>{
            if(this.game.checkCollision(this,enemy)[0]){
                this.markedForDeletion = true
                this.game.removeGameObjects()
                this.game.lostHatching++
                if(this.game.score > 0){
                    this.game.score --
                    console.log("Score:"+this.game.score + "larve perdue:" +this.game.lostHatching);
                    
                }
            }
        })
    }
}