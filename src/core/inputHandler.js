
export class InputHandler {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ onToggleDebug: () => void, onRestart: () => void }} callbacks
     */
    constructor(canvas, { onToggleDebug, onRestart }) {
        this.canvas = canvas
        this.mouse = {
            x: canvas.width * 0.5,
            y: canvas.height * 0.5,
            dx: 0,
            dy: 0,
            pressed: false,
        }

        window.addEventListener("mousemove", (e) => {
            this.updatePosition(e)
            this.mouse.dx += e.movementX
            this.mouse.dy += e.movementY
        })
        window.addEventListener("mousedown", (e) => {
            this.updatePosition(e)
            this.mouse.pressed = true
        })
        window.addEventListener("mouseup", (e) => {
            this.updatePosition(e)
            this.mouse.pressed = false
        })
        window.addEventListener("keydown", (e) => {
            if (e.key === "d") onToggleDebug()
            if (e.key === "r" || e.key === "R") onRestart()
        })
    }

    /** @param {MouseEvent} e */
    updatePosition(e) {
        const rect = this.canvas.getBoundingClientRect()
        this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width)
        this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height)
    }
}