import { Player } from "./player"
import { Obstacle } from "./obstacle"
export class Game {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas){
        
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        this.mouse = { x: this.width*0.5, y: this.height*0.5, dx: 0, dy: 0, pressed: false }
        this.player = new Player(this)
        this.numberOfObstacle =5
        /**
         * @type Obstacle[]
         */
        this.obstacles = []

        // position de la souris dans le repère du canvas, quelle que soit sa taille CSS
        const updatePos = (e) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mouse.x = (e.clientX - rect.left) * (this.canvas.width  / rect.width)
            this.mouse.y = (e.clientY - rect.top)  * (this.canvas.height / rect.height)
        }

        window.addEventListener("mousemove", (e) => {
            updatePos(e)
            this.mouse.dx += e.movementX
            this.mouse.dy += e.movementY
        })
        window.addEventListener("mousedown", (e) => { updatePos(e); this.mouse.pressed = true })
        window.addEventListener("mouseup",   (e) => { updatePos(e); this.mouse.pressed = false })
    }

    /** @param {CanvasRenderingContext2D} context */
    render(context){
        this.player.update()
        this.player.draw(context)
        this.obstacles.forEach(obstacle=>{
            obstacle.draw(context)
        })
    }
    init(){
        let attempts = 0
        while(this.obstacles.length <this.numberOfObstacle &&  attempts<150){
            let testObstacle =new Obstacle(this)
            let overlap=false
            this.obstacles.forEach(obstacle=>{
                const dx = testObstacle.collision.x - obstacle.collision.x
                const dy = testObstacle.collision.y - obstacle.collision.y
                const distance = Math.hypot(dy,dx)
                const sumOfRadi =testObstacle.collisionRadius +obstacle.collisionRadius
                if(distance<sumOfRadi){
                    overlap=true
                }          
            })
            if(!overlap){
                this.obstacles.push(testObstacle)
            }
            attempts++
        }
    }
}