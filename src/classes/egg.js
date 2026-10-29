import { Game } from "./gameManager";

export class Egg{
    /**
     * @param {Game} game 
     */
    constructor(game){
        this.game=game
        this.collision= {
            x:Math.random()*this.game.width,
            y:Math.random()*this.game.height
            
        }
        this.collisionRadius = 40
        
        /** @type {HTMLImageElement} */
        this.image = document.querySelector("img#egg")
        this.spriteWidth = 110
        this.spriteHeight =135
        this.width=this.spriteWidth
        this.height = this.spriteHeight
        this.sprite= {
            x:this.collision.x - this.width*0.5,
            y:this.collision.y - this.height*0.5,
        }
    }
    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        context.drawImage(this.image,this.sprite.x,this.sprite.y)
         if(this.game.debug){
            context.beginPath()
            context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI * 2)
            context.save()
            context.globalAlpha = 0.5
            context.fill()
            context.restore()
            context.stroke()

            context.beginPath()
            context.moveTo(this.collision.x, this.collision.y)
            context.lineTo(
                this.collision.x + Math.cos(this.angle) * this.lineLength,
                this.collision.y + Math.sin(this.angle) * this.lineLength
            )
            context.stroke()
        }
    }
}