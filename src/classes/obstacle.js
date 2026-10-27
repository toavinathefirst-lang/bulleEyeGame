import { Game } from "./gameManager";

export class Obstacle{
     /** @type {HTMLImageElement} */
    image;
    /**
     * 
     * @param {Game} game 
     */
    constructor(game){
        this.game=game;
         this.collisionRadius  = 40;
        this.collision = {
            x:this.collisionRadius + Math.random() * (this.game.width - this.collisionRadius*2),
            y:this.collisionRadius + Math.random() * (this.game.height - this.collisionRadius*2)
        }
        this.image=document.querySelector("img#obstacles")  
        this.spriteWidth = 250
        this.spriteHeight = 250
        this.width=this.spriteWidth
        this.height = this.spriteHeight
        this.sprite= {
            x:this.collision.x - this.width*0.5,
            y:this.collision.y - this.height*0.5-70,
        }
        this.frame= {
            x:Math.floor(Math.random()*4),
            y:Math.floor(Math.random()*3),
        }
    }
    /**
    * 
    * @param {CanvasRenderingContext2D} context 
    */
    draw(context){
            context.drawImage(this.image,
                this.frame.x*this.spriteWidth,this.frame.y*this.spriteHeight,
                this.spriteWidth,this.spriteHeight,
                this.sprite.x,this.sprite.y,this.width,this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI*2)
                context.save()
                context.globalAlpha = 0.5
                context.fill()
                context.restore()
                context.stroke()
            }
        }
}