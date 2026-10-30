import { Particle } from "./particle";

export class fireFly extends Particle {
    update(){
        this.angle +=this.velocityAngle
        this.collision.x +=Math.cos(this.angle)*this.speed.x
        this.collision.y -=this.speed.y
        

        if(this.collision.y<0 - this.radius){
            this.markedForDeletion = true
            this.game.removeGameObjects()
        }
    }
}