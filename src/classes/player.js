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
      this.collisionRadius = 80

      this.angle = 0
      this.lineLength = 80
      this.speed = {
        x:0,
        y:0
      }
      /**
       * @type {HTMLImageElement}
       */
      this.image= document.querySelector("img#bull")
      this.spriteWidth=255
      this.spriteHeight = 255
      this.width = this.spriteWidth
      this.height = this.spriteHeight
      this.source= {
        x:0,
        y:0,
        w:this.spriteWidth,
        h:this.spriteHeight
      }
      this.sprite ={
        x:this.collision.x - this.width*0.5,
        y:this.collision.y - this.height*0.5
      }
  }
   /**
    * 
    * @param {CanvasRenderingContext2D} context 
    */
   draw(context){
    context.drawImage(this.image,this.source.x,this.source.y,this.source.w,this.source.h,
      this.sprite.x,this.sprite.y,this.width,this.height)
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
    this.sprite ={
        x:this.collision.x - this.width*0.5,
        y:this.collision.y - this.height*0.5-30
      }

    //collision with obstacles
    this.game.obstacles.forEach(obstacle=>{
      //destructive asssignement 
      let [collision,distance,sumOfRadi,dx,dy] =this.game.checkCollision(this,obstacle)
      if(collision){
        const unit= {
          x:dx/distance,y:dy/distance
        }
        this.collision.x=obstacle.collision.x+(sumOfRadi+1)*unit.x
        this.collision.y=obstacle.collision.y+(sumOfRadi+1)*unit.y
      }
    })
  }
}