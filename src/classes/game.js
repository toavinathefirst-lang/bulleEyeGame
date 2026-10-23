import { Player } from "./player"
export class Game {
     /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas){
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        const player = new Player(this)
    }
}