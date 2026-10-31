import { CONFIG } from "../config"
import { InputHandler } from "./inputHandler"
import { Player } from "../entities/player"
import { Obstacle } from "../entities/obstacle"
import { Egg } from "../entities/egg"
import { Enemy } from "../entities/enemie"
import { SoundManager } from "./audioManager"

import scoreUrl from "../assets/audio/LarvaReached.mp3"
import die from "../assets/audio/die.mp3"
import win from "../assets/audio/Win.mp3"
import hit from "../assets/audio/hit.mp3"

/**
 * @typedef {import("../entities/gameObject").GameObject} GameObject
 */


export class Game {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.TOPMARGIN = CONFIG.TOP_MARGIN

        this.sound = new SoundManager()
        this.sound.load("score", scoreUrl)
        this.sound.load("lose",die)
        this.sound.load("win",win)
        this.sound.load("hit",hit)

        this.debug = false
        this.gameOver = false
        this.score = 0
        this.lostHatching = 0

        // boucle à FPS fixe
        this.timer = 0
        this.interval = 1000 / CONFIG.FPS
        this.eggTimer = 0

        /** @type {Egg[]} */ this.eggs = []
        /** @type {import("../entities/larva").Larva[]} */ this.hatchlings = []
        /** @type {import("../particles/particle").Particle[]} */ this.particles = []
        /** @type {Enemy[]} */ this.enemies = []
        /** @type {Obstacle[]} */ this.obstacles = []

        this.input = new InputHandler(canvas, {
            onToggleDebug: () => { this.debug = !this.debug },
            onRestart: () => { if (this.gameOver) this.restart() },
        })
        this.mouse = this.input.mouse

        this.player = new Player(this)
    }

    // ================= Cycle de vie =================

    init() {
        this.spawnEnemies()
        this.placeObstacles()
    }

    restart() {
        this.score = 0
        this.lostHatching = 0
        this.gameOver = false
        this.timer = 0
        this.eggTimer = 0

        this.eggs = []
        this.hatchlings = []
        this.particles = []
        this.enemies = []
        this.obstacles = []

        this.player.restart()
        this.init()
    }

    // ================= Boucle principale =================

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {number} [deltatime=0]
     */
    render(context, deltatime = 0) {
        if (this.timer > this.interval) {
            const elapsed = this.timer
            this.timer = 0
            this.update(elapsed)
            this.draw(context)
        }
        this.timer += deltatime
        this.spawnEggs(deltatime)
    }

    /** @param {number} elapsed */
    update(elapsed) {
        this.player.update()
        if (!this.gameOver) {
            this.getUpdatables().forEach(object => object.update(elapsed))
        }
        this.removeMarkedObjects()
        this.checkGameOver()
    }

    /** @param {CanvasRenderingContext2D} context */
    draw(context) {
        context.clearRect(0, 0, this.width, this.height)
        this.getDrawables()
            .sort((a, b) => this.compareDepth(a, b))
            .forEach(object => object.draw(context))

        this.drawHud(context)
        if (this.gameOver) this.drawGameOver(context)
    }

    // ================= Listes d'objets =================

    /** @returns {GameObject[]} */
    getDrawables() {
        return [this.player, ...this.obstacles, ...this.enemies,
            ...this.eggs, ...this.hatchlings, ...this.particles]
    }

    /** Tout ce qui s'anime pendant la partie (le joueur est géré à part). */
    getUpdatables() {
        return [...this.eggs, ...this.enemies, ...this.hatchlings, ...this.particles]
    }

    /** Tri en profondeur : le plus bas à l'écran est dessiné devant, le joueur gagne les égalités. */
    compareDepth(a, b) {
        return a.collision.y - b.collision.y
            || (a === this.player ? 1 : b === this.player ? -1 : 0)
    }

    removeMarkedObjects() {
        const alive = object => !object.markedForDeletion
        this.eggs = this.eggs.filter(alive)
        this.hatchlings = this.hatchlings.filter(alive)
        this.particles = this.particles.filter(alive)
    }

    // ================= Règles du jeu =================

    addScore() {
        if (!this.gameOver) {
            this.sound.play("score")
            this.score++
        
        }
    }

    loseHatchling() {
        this.sound.play("hit")
        this.lostHatching++
        if (this.score > 0 && !this.gameOver) this.score--
    }

    hasWon() {
        return this.score >= CONFIG.WINNING_SCORE
    }

    checkGameOver() {
        if (this.gameOver) return
        if (this.hasWon() || this.lostHatching > CONFIG.MAX_LOST_HATCHLINGS) {
            this.gameOver = true
            this.sound.play(this.hasWon() ? "win" : "lose")
        }
    }

    /**
     * @param {new (game: Game, x: number, y: number, color: string) => import("../particles/particle").Particle} ParticleClass
     */
    spawnParticles(ParticleClass, x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new ParticleClass(this, x, y, color))
        }
    }

    // ================= Création =================

    addEnemy() {
        this.enemies.push(new Enemy(this))
    }

    addEgg() {
        this.eggs.push(new Egg(this))
    }

    spawnEnemies() {
        for (let i = 0; i < CONFIG.ENEMY_COUNT; i++) this.addEnemy()
    }

    spawnEggs(deltatime) {
        if (this.eggTimer > CONFIG.EGG_INTERVAL && this.eggs.length < CONFIG.MAX_EGGS && !this.gameOver) {
            this.addEgg()
            this.eggTimer = 0
        } else {
            this.eggTimer += deltatime
        }
    }

    placeObstacles() {
        let attempts = 0
        while (this.obstacles.length < CONFIG.OBSTACLE_COUNT && attempts < CONFIG.MAX_PLACEMENT_ATTEMPTS) {
            const candidate = new Obstacle(this)
            if (this.isValidObstaclePosition(candidate)) this.obstacles.push(candidate)
            attempts++
        }
    }

    /** @param {Obstacle} candidate */
    isValidObstaclePosition(candidate) {
        const margin = candidate.collisionRadius * 3
        const insideArena =
            candidate.sprite.x > 0 &&
            candidate.sprite.x < this.width - candidate.width &&
            candidate.collision.y > this.TOPMARGIN &&
            candidate.collision.y < this.height - margin
        const overlapping = this.obstacles.some(o => candidate.overlaps(o, CONFIG.OBSTACLE_BUFFER))
        return insideArena && !overlapping
    }

    // ================= Interface =================

    /** @param {CanvasRenderingContext2D} context */
    drawHud(context) {
        context.save()
        context.textAlign = "left"
        context.fillText(`Score:${this.score}`, 25, 50)
        if (this.debug) {
            context.font = "40px Helvetica"
            context.fillText(`Lost:${this.lostHatching}`, 25, 100)
        }
        context.restore()
    }

    getEndMessage() {
        return this.hasWon()
            ? "Congratulation !!!"
            : "be careful next time"
    }

    /** @param {CanvasRenderingContext2D} context */
    drawGameOver(context) {
        context.save()
        context.fillStyle = "rgba(0,0,0,0.5)"
        context.fillRect(0, 0, this.width, this.height)
        context.fillStyle = "white"
        context.textAlign = "center"
        context.font = "130px Bangers, Helvetica"
        context.fillText(this.getEndMessage(), this.width * 0.5, this.height * 0.5 - 20)
        context.fillText("press R to Restart", this.width * 0.5, this.height * 0.5 + 80)
        context.restore()
    }
}