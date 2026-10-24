import { Game } from "./gameManager";

export class Player {
    /**
     * 
     * @param {Game} game 
     */
   constructor(game){
    this.game =game
    this.collisionX =this.game.width *0.5
    this.collisionY =this.game.height *0.5
    this.collisionRadius =30
   }
   /**
    * 
    * @param {CanvasRenderingContext2D} context 
    */
   draw(context){
    context.beginPath()
    context.arc(this.collisionX,this.collisionY,50,0,Math.PI*2)
    context.save()
    context.globalAlpha=0.5
    context.fill()
    context.restore()
    context.stroke()
   }
}