import { Howl, Howler } from "howler";

/* =============== Declare Event Listeners =============== */
const rainSlider = document.querySelector("#rain-slider") as HTMLInputElement;
const forestBirdSlider = document.querySelector(
    "#forest-bird-slider"
) as HTMLInputElement;
const powerButton = document.querySelector("#power") as HTMLButtonElement;

const effects = {
    rain: new Howl({
        src: ["/assets/sounds/heavy-rain-drops.wav"],
        loop: true,
    }),
    forestBird: new Howl({
        src: ["/assets/sounds/forest-bird.wav"],
        loop: true,
    }),
};

function handleRainChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    effects.rain.volume(Number(value) / 100);
}

function handleForestBirdChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    effects.forestBird.volume(Number(value) / 100);
}

rainSlider.addEventListener("input", (e) => {
    handleRainChange(e);
});

forestBirdSlider.addEventListener("input", (e) => {
    handleForestBirdChange(e);
});

powerButton.addEventListener("click", () => {
    Object.values(effects).forEach((effect) => {
        if (effect.playing()) {
            effect.stop();
        } else {
            effect.play();
        }
    });
    powerButton.classList.toggle("active");
});
