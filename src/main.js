import "./style.css"
import { Game } from "./classes/gameManager"
window.addEventListener("load",()=>{
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    
    ctx.lineWidth = 3
    canvas.width = 1280
    canvas.height= 720

    ctx.fillStyle="white"
    ctx.strokeStyle = "red"
    
    const game = new Game(canvas)
    game.render(ctx)
    
    function animate(){
        
    }
})