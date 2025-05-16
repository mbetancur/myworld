import kaplay, { KAPLAYCtx } from "kaplay";
import { showDialogue } from "./utils";
import { MapObject } from "./mapProcessor";

export function createGameMap(k: KAPLAYCtx, boundaries: MapObject[], interactiveObjs: MapObject[]) {
    const map = k.add([k.pos(0), k.sprite("map")]);

    function setupBoundaries() {
        boundaries.forEach((obj) => {
            map.add([
                k.rect(16, 16),
                k.area(),
                k.body({ isStatic: true }),
                k.pos(obj.x - 8, obj.y - 8),
                k.opacity(0),
                "boundary"
            ]);
        });
    }

    function setupInteractiveObjects() {
        interactiveObjs.forEach((obj) => {
            map.add([
                k.circle(1),
                k.area(),
                k.pos(obj.x, obj.y),
                k.opacity(0),
                "interactive"
            ]);
        });
    }

    function setupCollisions(player: any) {
        player.onCollide("boundary", () => {
            player.stop();
        });

        player.onCollide("interactive", () => {
            showDialogue(k, "Hello! This is an interactive object. You can add more text here to create a conversation or provide information.");
        });
    }

    return {
        map,
        setupBoundaries,
        setupInteractiveObjects,
        setupCollisions
    };
} 