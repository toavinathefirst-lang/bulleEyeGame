import { Player } from "./player"
import { Obstacle } from "./obstacle"
import { Egg } from "./egg";

/**
 * @typedef {Object} Drawable
 * @property {{ x: number, y: number }} collision
 * @property {(context: CanvasRenderingContext2D) => void} draw
 */

export class Game {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        /**
         * @type {Egg[]}
         */
        this.eggs=[]
        this.maxEggs=10;
        this.eggTimer=0
        this.eggInterval=1500
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.TOPMARGIN = 260
        this.debug = false

        this.mouse = { x: this.width * 0.5, y: this.height * 0.5, dx: 0, dy: 0, pressed: false }
        this.player = new Player(this)

        this.timer=0
        this.fps = 25;
        this.interval= 1000/this.fps;

        this.numberOfObstacle = 5
        this.MAX_ATTEMPTS = 200

        /** @type {Obstacle[]} */
        this.obstacles = []

        /** @type {Drawable[]} */
        this.enemies = []

        /** @param {MouseEvent} e */
        const updatePos = (e) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width)
            this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height)
        }

        window.addEventListener("mousemove", (e) => {
            updatePos(e)
            this.mouse.dx += e.movementX
            this.mouse.dy += e.movementY
        })
        window.addEventListener("mousedown", (e) => { updatePos(e); this.mouse.pressed = true })
        window.addEventListener("mouseup", (e) => { updatePos(e); this.mouse.pressed = false })
        window.addEventListener("keydown",(e)=>{
            if(e.key == "d"){
                this.debug= !this.debug
            }
            
            
        })
    }

    /**
     * @returns {Drawable[]}
     */
    getDrawables() {
        return [this.player, ...this.obstacles, ...this.enemies,...this.eggs]
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {number} [deltatime=0]
     * @returns {void}
     */
    render(context, deltatime = 0) {
        if (this.timer > this.interval) {
            context.clearRect(0, 0, this.width, this.height)
            this.player.update()
            this.getDrawables()
                .sort((a, b) => a.collision.y - b.collision.y)
                .forEach(drawable => drawable.draw(context))
            this.timer = 0
            this.eggs.forEach(egg => egg.update())
        }
        this.timer += deltatime

        //add eggs progressively
        if(this.eggTimer>this.eggInterval && this.eggs.length<this.maxEggs){
            this.addEgg()
            this.eggTimer=0
        }else {
            this.eggTimer+=deltatime
        }

    }

    /**
     * @param {{ collision: { x: number, y: number }, collisionRadius: number }} a
     * @param {{ collision: { x: number, y: number }, collisionRadius: number }} b
     * @returns {[boolean, number, number, number, number]} collision, distance, sumOfRadi, dx, dy
     */
    checkCollision(a, b) {
        const dx = a.collision.x - b.collision.x
        const dy = a.collision.y - b.collision.y
        const distance = Math.hypot(dy, dx)
        const sumOfRadi = a.collisionRadius + b.collisionRadius
        return [(distance < sumOfRadi), distance, sumOfRadi, dx, dy]
    }

    /**
     * @returns {void}
     */
    init() {
        let attempts = 0
        while (this.obstacles.length < this.numberOfObstacle && attempts < this.MAX_ATTEMPTS) {
            let testObstacle = new Obstacle(this)
            let overlap = false
            this.obstacles.forEach(obstacle => {
                const dx = testObstacle.collision.x - obstacle.collision.x
                const dy = testObstacle.collision.y - obstacle.collision.y
                const distance = Math.hypot(dy, dx)
                const distanceBuffer = 100
                const sumOfRadi = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer
                if (distance < sumOfRadi) {
                    overlap = true
                }
            })
            const margin = testObstacle.collisionRadius * 3
           if (!overlap &&
                testObstacle.sprite.x > 0 &&
                testObstacle.sprite.x < this.width - testObstacle.width &&
                testObstacle.collision.y > this.TOPMARGIN &&
                testObstacle.collision.y < this.height - margin) {

                    this.obstacles.push(testObstacle)
            }
            attempts++
        }
    } 
    addEgg(){
        this.eggs.push(new Egg(this))
    }
}