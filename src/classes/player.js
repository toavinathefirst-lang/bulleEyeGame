import { Game } from "./gameManager";


export class Player {
    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game
        this.collision = {
            x: game.width * 0.5,
            y: game.height * 0.5
        }
        this.collisionRadius = 45

        this.angle = 0
        this.lineLength = 80
        
        this.speed = {
            x: 0,
            y: 0
        }

        /** @type {HTMLImageElement} */
        this.image = document.querySelector("img#bull")
        this.spriteWidth = 255
        this.spriteHeight = 255
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.frame = {
            x: 0,
            y: 0
        }
        this.spriteOffsetY = 80
        this.sprite = {
            x: 0,
            y: 0
        }

        this.horizontalBoundaries()
        this.verticalBoundary()
        this.updateSprite()
    }
    restart(){
         this.collision.x = this.game.width * 0.5
        this.collision.y = this.game.height * 0.5
        this.speed.x = 0
        this.speed.y = 0
        this.angle = 0
        this.frame.y = 0
        this.updateSprite()
    }

    horizontalBoundaries() {
        if (this.collision.x < this.collisionRadius) {
            this.collision.x = this.collisionRadius
        } else if (this.collision.x > this.game.width - this.collisionRadius) {
            this.collision.x = this.game.width - this.collisionRadius
        }
    }

    verticalBoundary() {
        if (this.collision.y < this.game.TOPMARGIN + this.collisionRadius) {
            this.collision.y = this.game.TOPMARGIN + this.collisionRadius
        } else if (this.collision.y > this.game.height - this.collisionRadius) {
            this.collision.y = this.game.height - this.collisionRadius
        }
    }

    updateSprite() {
        this.sprite.x = this.collision.x - this.width * 0.5
        this.sprite.y = this.collision.y - this.height * 0.5 - this.spriteOffsetY
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        context.drawImage(
            this.image,
            this.frame.x * this.spriteWidth, this.frame.y * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.sprite.x, this.sprite.y, this.width, this.height
        )


        if(this.game.debug){
            context.beginPath()
            context.arc(this.collision.x, this.collision.y, this.collisionRadius, 0, Math.PI * 2)
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
    }

    /**
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    animation(dx, dy) {
        const angle = Math.atan2(dy, dx)
        if (angle < -2.74 || angle > 2.74) this.frame.y = 6
        else if (angle < -1.96) this.frame.y = 7
        else if (angle < -1.17) this.frame.y = 0
        else if (angle < -0.39) this.frame.y = 1
        else if (angle < 0.39) this.frame.y = 2
        else if (angle < 1.17) this.frame.y = 3
        else if (angle < 1.96) this.frame.y = 4
        else if (angle < 2.74) this.frame.y=5
        else if (angle< -2.74 || angle >2.74) this.frame.y = 6
        else if(angle <-1.96) this.frame.y=7
    }

    /**
     * @returns {void}
     */
    update() {
        const m = this.game.mouse
        const dx = m.x - this.collision.x || 0
        const dy = m.y - this.collision.y || 0
        const distance = Math.hypot(dx, dy)

        const maxSpeed = 15

        if (distance > 1) {
            const speedModifier = Math.min(maxSpeed, distance)
            this.speed.x = (dx / distance) * speedModifier
            this.speed.y = (dy / distance) * speedModifier

            this.collision.x += this.speed.x
            this.collision.y += this.speed.y

            this.angle = Math.atan2(dy, dx)
            this.animation(dx, dy)
        } else {
            this.speed.x = 0
            this.speed.y = 0
        }

        this.game.obstacles.forEach(obstacle => {
            const [collision, obstacleDistance, sumOfRadi, odx, ody] = this.game.checkCollision(this, obstacle)
            if (collision && obstacleDistance > 0) {
                const unit = {
                    x: odx / obstacleDistance,
                    y: ody / obstacleDistance
                }
                this.collision.x = obstacle.collision.x + (sumOfRadi + 1) * unit.x
                this.collision.y = obstacle.collision.y + (sumOfRadi + 1) * unit.y
            }
        })

        this.horizontalBoundaries()
        this.verticalBoundary()
        this.updateSprite()
    }
}