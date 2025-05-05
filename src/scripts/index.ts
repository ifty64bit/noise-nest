import { Howl } from "howler";

const soundConfigs = [
    { id: "rain", src: ["/assets/sounds/heavy-rain-drops.wav"] },
    { id: "forest-bird", src: ["/assets/sounds/forest-bird.wav"] },
    { id: "frog", src: ["/assets/sounds/frog.mp3"] },
    {
        id: "campfire",
        src: ["/assets/sounds/campfire.mp3"],
    },
    {
        id: "wolf",
        src: ["/assets/sounds/wolf-howling-1.mp3"],
    },
];

const effects: Record<string, Howl> = {};

soundConfigs.forEach(({ id, src }) => {
    effects[id] = new Howl({
        src: [...src],
        loop: true,
        html5: true,
    });

    const slider = document.querySelector(
        `#${id}-slider`
    ) as HTMLInputElement | null;
    if (slider) {
        slider.addEventListener("input", (e) => {
            const value = (e.target as HTMLInputElement).value;
            effects[id].volume(Number(value) / 100);
        });
    }
});

const powerButton = document.querySelector(
    "#power"
) as HTMLButtonElement | null;
if (powerButton) {
    powerButton.addEventListener("click", () => {
        const anyPlaying = Object.values(effects).some((effect) =>
            effect.playing()
        );
        Object.values(effects).forEach((effect) => {
            if (anyPlaying) {
                effect.stop();
            } else {
                effect.play();
            }
        });
        powerButton.classList.toggle("active", !anyPlaying);
    });
}
