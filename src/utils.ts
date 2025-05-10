import { KAPLAYCtx } from "kaplay";

export function showDialogue(k: KAPLAYCtx, text: string) {
    const dialogue = k.add([
        k.rect(300, 80),
        k.pos(k.width() / 2 - 150, k.height() / 2 - 40),
        k.color(0, 0, 0),
        k.opacity(0.8),
        "dialogue"
    ]);

    dialogue.add([
        k.rect(296, 76),
        k.pos(2, 2),
        k.color(255, 255, 255),
        k.opacity(0.1)
    ]);

    dialogue.add([
        k.text(text, {
            size: 13,
            width: 280,
        }),
        k.pos(10, 10),
        k.color(255, 255, 255)
    ]);

    const indicator = dialogue.add([
        k.text("Press ESC to continue", {
            size: 8,
        }),
        k.pos(150, 55),
        k.color(255, 255, 255),
        k.opacity(0.8)
    ]);

    k.loop(0.5, () => {
        indicator.opacity = indicator.opacity === 0.8 ? 0.2 : 0.8;
    });

    const player = k.get("player")[0];
    if (player) {
        player.isInDialogue = true;
    }

    k.onKeyPress("escape", () => {
        dialogue.destroy();
        if (player) {
            player.isInDialogue = false;
        }
    });
}
