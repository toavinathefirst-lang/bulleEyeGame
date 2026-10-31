import { GameObject } from "./gameObject";

/**
 * Tout ce qui est bloqué par le joueur et les obstacles :
 * Enemy, Larva et Egg .
 */
export class Creature extends GameObject {
    getBlockers() {
        return [this.game.player, ...this.game.obstacles]
    }
}