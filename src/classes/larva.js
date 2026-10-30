import { Game } from "./gameManager";
export class larva{
    /**
     * @param {Game} game 
     */
    constructor(game,x,y){
        this.game=game
        this.collision={
            x:x,
            y:y
        }
        this.collisionRadius = 30
        /**
         * @type {HTMLImageElement}
         */
        this.image = document.querySelector("img#larva")

        this.spriteWidth = 150
        this.sppriteHeight=150

        this.width = this.spriteWidth
        this.height= this.sppriteHeight
        this.sprite={
            x:0,y:0
        }
        this.speed={
            y:1+Math.random()
        }
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        context.drawImage(this.image,this.sprite.x,this.sprite.y)
    }
    update(){
        this.collision.y -= this.speed.y
        this.sprite.x = this.game.width + Math.random() * this.game.width * 0.5
        this.sprite.y = this.game.height + Math.random() * this.game.height * 0.5
        
    }
}