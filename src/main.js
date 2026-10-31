import "./style.css"
import { Game } from "./core/gameManager"

window.addEventListener("load", async() => {
    await document.fonts.load("40px Bangers")
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = 1280
    canvas.height = 720

    ctx.lineWidth = 3
    ctx.fillStyle = "white"
    ctx.strokeStyle = "red"
    ctx.font= '40px Helvetica'
    ctx.textAlign = "center"

    const game = new Game(canvas)
    game.init()

    let lastTime = 0

    /**
     * @param {DOMHighResTimeStamp} timeStamp
     * @returns {void}
     */
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        game.render(ctx, deltaTime)
        requestAnimationFrame(animate)
    }

    animate(0)
    
})