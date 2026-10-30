import { Game } from "./gameManager";

export class Particle {
    /**
     * @param {Game} game 
     * @param {number} x
     * @param {number} y  
     */
    constructor(game,x,y,color){
        this.game= game
        this.collision = {
            x:x,y:y
        }
        this.color=color
        this.radius= Math.floor(Math.random()*10+5)
        this.speed = {
            x:Math.random() *6 -3,y:Math.random()*2 +0.5
        }
        this.angle=0
        this.velocityAngle=Math.random()*0.1+0.01
        this.markedForDeletion=false
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        if (this.radius <= 0) return
        context.save()
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.collision.x, this.collision.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
    }
}