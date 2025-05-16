import kaplay, { KAPLAYCtx } from "kaplay";

export function createPet1(k: KAPLAYCtx) {
    const pet1 = k.add([
        k.pos(130, 160),
        k.sprite("pet1", { anim: "idle" }),
        k.area(),
        k.body(),
        "pet1"
    ]);

    let isIdle = true;

    function updatePetAnimation() {
        isIdle = !isIdle;
        pet1.play(isIdle ? "idle" : "crouch");
    }

    k.loop(3, () => {
        updatePetAnimation();
    });

    return pet1;
}

export function createPet2(k: KAPLAYCtx) {
    const pet2 = k.add([
        k.pos(135, 170),
        k.sprite("pet2", { anim: "idle" }),
        k.area(),
        k.body(),
        k.scale(1.4),
        {
            speed: 150,
            direction: { x: 0, y: 0 }
        },
        "pet2"
    ]);

    function movePet2Randomly() {
        const directions = [
            { x: 0, y: -1, anim: "walk-up" },
            { x: 0, y: 1, anim: "walk-down" },
            { x: -1, y: 0, anim: "walk-side" },
            { x: 1, y: 0, anim: "walk-side" }
        ];

        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        pet2.direction = randomDir;
        pet2.play(randomDir.anim);
        if (randomDir.x < 0) pet2.flipX = true;
        else if (randomDir.x > 0) pet2.flipX = false;
    }

    k.loop(2, () => {
        movePet2Randomly();
    });

    k.onUpdate(() => {
        if (pet2.direction) {
            pet2.move(pet2.direction.x * pet2.speed * k.dt(), pet2.direction.y * pet2.speed * k.dt());
        }
    });

    pet2.onCollide("boundary", () => {
        pet2.stop();
        movePet2Randomly();
    });

    return pet2;
} 