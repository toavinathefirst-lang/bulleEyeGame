import "./style.css"
import { Game } from "./classes/Game"
window.addEventListener("load",()=>{
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 1280
    canvas.height= 720
    
    const game = new Game(canvas)
    console.log(game);
    
    function animate(){

    }
})