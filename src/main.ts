import kaplay from "kaplay";
import { fetchMap, processMapFeatures } from "./mapProcessor";
import { showDialogue } from "./utils";

const scale = 3;

const k = kaplay({
    global: false,
    scale: scale,
    debug: true,
});

k.loadRoot("./"); // A good idea for Itch.io publishing later
k.loadSprite("map", "sprites/mapV1.png");
k.loadSprite("characters", "sprites/charactersV1.png", {
    sliceX: 10,
    sliceY: 4,
    anims: {
        "idle": 0,
        "walk-down": { from: 1, to: 3, loop: true, speed: 8 },
        "walk-side": { from: 11, to: 13, loop: true, speed: 8 },
        "walk-up": { from: 21, to: 23, loop: true, speed: 8 },
    }
})

k.setBackground(k.Color.fromHex("#2b202b"));

k.scene("game", async () => {
    const { boundaries, interactiveObjs } = await fetchMap("sprites/mapV2.json")

    const map = k.add([k.pos(0), k.sprite("map")]);

    const player = k.make([
        k.pos(100, 170),
        k.sprite("characters", { anim: "idle" }),
        k.area(),
        k.body(),
        k.scale(1.4),
        {
            speed: 50,
            isInDialogue: false,
        },
        "player"
    ])

    k.add(player)

    processMapFeatures(boundaries, (obj) => {
        map.add([
            k.rect(16, 16),
            k.area(),
            k.body({ isStatic: true }),
            k.pos(obj.x - 8, obj.y - 8), // - 8 to Center the boundary
            k.opacity(0),
            "boundary"
        ])

        player.onCollide("boundary", () => {
            player.stop();
        });
    });

    processMapFeatures(interactiveObjs, (obj) => {
        map.add([
            k.circle(1),
            k.area(),
            k.pos(obj.x, obj.y),
            k.opacity(0),
            "interactive"
        ]);

        player.onCollide("interactive", () => {
            showDialogue(k, "Hello! This is an interactive object. You can add more text here to create a conversation or provide information.");
        });
    });

    let isMoving = false;

    k.onKeyDown("w", () => {
        if (player.isInDialogue) return;
        player.move(0, -50)
        if (!isMoving) {
            player.play("walk-up")
            isMoving = true
        }
    })
    k.onKeyDown("s", () => {
        if (player.isInDialogue) return;
        player.move(0, 50)
        if (!isMoving) {
            player.play("walk-down")
            isMoving = true
        }
    })
    k.onKeyDown("a", () => {
        if (player.isInDialogue) return;
        player.move(-50, 0)
        if (!isMoving) {
            player.play("walk-side")
            player.flipX = true
            isMoving = true
        }
    })
    k.onKeyDown("d", () => {
        if (player.isInDialogue) return;
        player.move(50, 0)
        if (!isMoving) {
            player.play("walk-side")
            player.flipX = false
            isMoving = true
        }
    })

    k.onKeyRelease(["w", "s", "a", "d"], () => {
        isMoving = false
        player.play("idle")
    })
})

k.go("game");