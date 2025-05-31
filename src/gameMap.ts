import { GameObj, KAPLAYCtx } from "kaplay";
import { getDialogueText, showDialogue } from "./utils";
import { MapObject } from "./mapProcessor";
import { Repository } from "./services/repositories";

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
        "interactive",
        obj.name
      ]);
    });
  }

  function setupCollisions(player: GameObj, repos: Repository[]) {
    player.onCollide("boundary", () => {
      player.stop();
    });

    player.onCollide("interactive", (obj) => {
      const text = getDialogueText(obj, repos);
      showDialogue(k, text);
    });
  }

  return {
    map,
    setupBoundaries,
    setupInteractiveObjects,
    setupCollisions
  };
} 