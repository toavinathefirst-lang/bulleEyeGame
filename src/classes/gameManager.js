import { Player } from "./player"

export class Game {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas){
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        this.mouse = { x: this.width*0.5, y: this.height*0.5, dx: 0, dy: 0, pressed: false }
        this.player = new Player(this)

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
    }
}