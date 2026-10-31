
export class SoundManager {
    constructor() {
        this.muted = false
        this.volume = 0.5
        /** @type {Record<string, HTMLAudioElement>} */
        this.sounds = {}
        /** @type {AudioContext | null} */
        this.ctx = null
    }

    /**
     * @param {string} name
     * @param {string} src 
     */
    load(name, src) {
        const audio = new Audio(src)
        audio.preload = "auto"
        this.sounds[name] = audio
    }

    /**
     * 
     * @param {string} name
     * @param {{ volume?: number, rate?: number }} [options]
     */
    play(name, { volume = 1, rate = 1 } = {}) {
        if (this.muted || !this.sounds[name]) return
        const audio = this.sounds[name].cloneNode()
        audio.volume = Math.min(1, this.volume * volume)
        audio.playbackRate = rate
        audio.play().catch(() => {}) 
    }

    /**
     * 
     * @param {number} [frequency=440] hauteur en Hz
     * @param {number} [duration=0.15] durée en secondes
     * @param {OscillatorType} [type="square"] "sine" | "square" | "sawtooth" | "triangle"
     * @param {number} [volume=0.2]
     */
    tone(frequency = 440, duration = 0.15, type = "square", volume = 0.2) {
        if (this.muted) return
        this.ctx ??= new AudioContext()
        if (this.ctx.state === "suspended") this.ctx.resume()

        const now = this.ctx.currentTime
        const oscillator = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, now)
        gain.gain.setValueAtTime(volume * this.volume * 2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration) // fondu de fin

        oscillator.connect(gain)
        gain.connect(this.ctx.destination)
        oscillator.start(now)
        oscillator.stop(now + duration)
    }

    toggleMute() {
        this.muted = !this.muted
    }
}