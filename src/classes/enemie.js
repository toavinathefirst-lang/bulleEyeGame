import { Game } from "./gameManager";

export class Enemy {
    /**
     * @param {Game} game 
     */
    constructor(game){
        this.game=game
        this.collisionRadius=30
        this.collision= {
            x:this.game.width,
            y:Math.random()*this.game.height
        }
        this.speed = {
            x:Math.random()*3 +0.5
        }

    }
}