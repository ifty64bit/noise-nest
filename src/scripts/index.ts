import { Howl, Howler } from "howler";

/* =============== Declare Event Listeners =============== */
const rainSlider = document.querySelector("#rain-slider") as HTMLInputElement;
const forestBirdSlider = document.querySelector(
    "#forest-bird-slider"
) as HTMLInputElement;

const rain = new Howl({
    src: ["/assets/sounds/heavy-rain-drops.wav"],
    loop: true,
});

const forestBird = new Howl({
    src: ["/assets/sounds/forest-bird.wav"],
    loop: true,
});

function handleRainChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    rain.volume(Number(value) / 100);
}

function handleForestBirdChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    forestBird.volume(Number(value) / 100);
}

rainSlider.addEventListener("input", (e) => {
    handleRainChange(e);
});

forestBirdSlider.addEventListener("input", (e) => {
    handleForestBirdChange(e);
});

rain.play();
forestBird.play();
