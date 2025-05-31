import { KAPLAYCtx } from "kaplay";

export interface PlayerState {
  isMoving: boolean;
  lastDirection: string;
  isInDialogue: boolean;
}

export function createPlayer(k: KAPLAYCtx) {
  const player = k.add([
    k.pos(100, 170),
    k.sprite("characters", { anim: "idle" }),
    k.area(),
    k.body(),
    k.scale(1.2),
    {
      speed: 50,
      isInDialogue: false,
    },
    "player"
  ]);

  const state: PlayerState = {
    isMoving: false,
    lastDirection: "down",
    isInDialogue: false
  };

  function setupPlayerControls() {
    k.onKeyDown("w", () => {
      if (player.isInDialogue) return;
      player.move(0, -50);
      if (!state.isMoving || state.lastDirection !== "up") {
        player.play("walk-up");
        state.isMoving = true;
        state.lastDirection = "up";
      }
    });

    k.onKeyDown("s", () => {
      if (player.isInDialogue) return;
      player.move(0, 50);
      if (!state.isMoving || state.lastDirection !== "down") {
        player.play("walk-down");
        state.isMoving = true;
        state.lastDirection = "down";
      }
    });

    k.onKeyDown("a", () => {
      if (player.isInDialogue) return;
      player.move(-50, 0);
      if (!state.isMoving || state.lastDirection !== "left") {
        player.play("walk-side");
        player.flipX = true;
        state.isMoving = true;
        state.lastDirection = "left";
      }
    });

    k.onKeyDown("d", () => {
      if (player.isInDialogue) return;
      player.move(50, 0);
      if (!state.isMoving || state.lastDirection !== "right") {
        player.play("walk-side");
        player.flipX = false;
        state.isMoving = true;
        state.lastDirection = "right";
      }
    });

    k.onKeyRelease(["w", "s", "a", "d"], () => {
      state.isMoving = false;
      switch (state.lastDirection) {
        case "up":
          player.play("idle-up");
          break;
        case "down":
          player.play("idle");
          break;
        case "left":
          player.play("idle-side");
          player.flipX = true;
          break;
        case "right":
          player.play("idle-side");
          player.flipX = false;
          break;
      }
    });
  }

  setupPlayerControls();

  return {
    player,
    state
  };
} 