import kaplay from "kaplay";
import { fetchMap } from "./mapProcessor";
import { createPlayer } from "./player";
import { createPet1, createPet2 } from "./pets";
import { createGameMap } from "./gameMap";

const scale = 3;

const k = kaplay({
    global: false,
    scale: scale,
    debug: true,
});

k.loadRoot("./");
k.loadSprite("map", "sprites/mapV1.png");

k.loadSprite("characters", "sprites/characterV2.png", {
    sliceX: 7,
    sliceY: 4,
    anims: {
        "idle": { from: 0, to: 3, loop: true, speed: 1 },
        "idle-up": { from: 4, to: 6, loop: true, speed: 1 },
        "idle-side": { from: 7, to: 10, loop: true, speed: 1 },
        "walk-down": { from: 11, to: 16, loop: true, speed: 8 },
        "walk-up": { from: 17, to: 21, loop: true, speed: 8 },
        "walk-side": { from: 22, to: 27, loop: true, speed: 8 },
    }
});

k.loadSprite("pet1", "sprites/pearlV1.png", {
    sliceX: 2,
    anims: {
        "idle": 0,
        "crouch": 1,
    }
});

k.loadSprite("pet2", "sprites/pet2V1.png", {
    sliceX: 10,
    anims: {
        "idle": 0,
        "walk-down": { from: 0, to: 3, loop: true, speed: 8 },
        "walk-side": { from: 4, to: 5, loop: true, speed: 8 },
        "walk-up": { from: 6, to: 9, loop: true, speed: 8 },
    }
});

k.setBackground(k.Color.fromHex("#2b202b"));

k.scene("game", async () => {
    const { boundaries, interactiveObjs } = await fetchMap("sprites/mapV2.json");

    const gameMap = createGameMap(k, boundaries, interactiveObjs);
    gameMap.setupBoundaries();
    gameMap.setupInteractiveObjects();

    const { player } = createPlayer(k);
    const pet1 = createPet1(k);
    const pet2 = createPet2(k);

    gameMap.setupCollisions(player);
});

k.go("game");