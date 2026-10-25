import { Game } from "./gameManager";

export class Obstacle{
    /**
     * 
     * @param {Game} game 
     */
    constructor(game){
        this.game=game;
         this.collisionRadius  = 100;
        this.collision = {
            x:this.collisionRadius + Math.random() * (this.game.width - this.collisionRadius*2),
            y:this.collisionRadius + Math.random() * (this.game.height - this.collisionRadius*2)
        }
       
    }
    /**
    * 
    * @param {CanvasRenderingContext2D} context 
    */
    draw(context){
        context.beginPath()
        context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI*2)
        context.save()
        context.globalAlpha = 0.5
        context.fill()
        context.restore()
        context.stroke()
        }
}