import { Game } from "./gameManager";

export class Player {
    /**
     * 
     * @param {Game} game 
     */
   constructor(game){
      this.game = game
      this.collision = {
        x:game.width * 0.5,
        y: game.height * 0.5
      }
      this.collisionRadius = 30

      this.angle = 0
      this.lineLength = 80
      this.speed = {
        x:0,
        y:0
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

    context.beginPath()
    context.moveTo(this.collision.x, this.collision.y)
    context.lineTo(
        this.collision.x + Math.cos(this.angle) * this.lineLength,
        this.collision.y + Math.sin(this.angle) * this.lineLength
    )
    context.stroke()
   }  
  update(){
    const m = this.game.mouse
    const dx = m.x - this.collision.x || 0
    const dy = m.y - this.collision.y  || 0
    const distance = Math.hypot(dx, dy)

    const maxSpeed = 15

    if (distance > 1) {
        // direction normalisée (longueur 1) x vitesse, sans jamais dépasser la cible
        const speedModifier = Math.min(maxSpeed, distance)
        this.speed.x = (dx / distance) * speedModifier
        this.speed.y = (dy / distance) * speedModifier

        this.collision.x += this.speed.x
        this.collision.y += this.speed.y

        this.angle = Math.atan2(dy, dx)
    } else {
        this.speed.x = 0
        this.speed.y = 0
    }

    //collision with obstacles
    this.game.obstacles.forEach(obstacle=>{
      if(this.game.checkCollision(this,obstacle)){
        console.log(this.game.checkCollision(this,obstacle));
        
      }
    })
  }
}