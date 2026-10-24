import { Player } from "./player"
export class Game {
     /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas){
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.player = new Player(this)
        this.mouse = {
            x:this.width *0.5,
            y:this.height *0.5,
            pressed:false
        }
        window.addEventListener("mousedown",
            (e)=>{
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                console.log(e.offsetX,e.offsetY);
            
        })
        window.addEventListener("mouseup",
            (e)=>{
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                this.mouse.pressed=false
            
        })
        window.addEventListener("mousemove",(e)=>{
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            console.log(this.mouse.x);
            
        })
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    render(context){
        this.player.draw(context)
    }
}