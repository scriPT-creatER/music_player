const musicPlayerBox = document.getElementById("music-player");
const playlistBox = document.getElementById("songs");
const songPlayList = document.getElementById("song-playlist");
const showPlaylist = document.getElementById("shuffle");
const musicBoxTitle = document.getElementById("title");
const allSongs = document.querySelectorAll(".song");
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const loopBtn = document.getElementById("loop");
const previousBtn = document.getElementById("previous");
const shuffleBtn = document.getElementById("shuffle-btn");
const songDuration = document.getElementById("duration");
const circle = document.getElementById("progress-ring");
const svg = document.getElementById("progress-svg");
const showPlayer = document.querySelector(".show-music-player");
const shuffleBox = document.getElementById("shuffle-box");

const totalLength = circle.getTotalLength();

circle.style.strokeDasharray = totalLength;
circle.style.strokeDashoffset = totalLength;

console.log(totalLength);


let currentIndex = null;
let isLooping = false;
let isShuffle = false;
let isSeeking = false;

musicPlayerBox.hidden = true;
playlistBox.hidden = false;
shuffleBox.hidden = true;


showPlaylist.addEventListener("click", () => {
    musicPlayerBox.hidden = true;
    playlistBox.hidden = false;
    shuffleBox.hidden = false;
});


playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";

    }

});


allSongs.forEach((song, index) => {
    song.addEventListener("click",() => {
        audio.src = song.dataset.file;
        audio.play();
        playBtn.textContent = "⏸️";
        loopBtn.textContent = "🔁"
        shuffleBtn.textContent = "🔀"
        currentIndex = index;
        console.log(currentIndex);

        musicPlayerBox.hidden = false;
        playlistBox.hidden = true;

        const songName = song.querySelector(".music-name").textContent;

        musicBoxTitle.textContent = songName;
    });
});


function nextSong(){
    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= allSongs.length) {
            currentIndex = 0;
        }

        playSong(currentIndex);

    });
}

function previousSong() {
    previousBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = allSongs.length - 1;
        }

        playSong(currentIndex);
    });
}

function playSong(index) {
    const song = allSongs[index];
    audio.src = song.dataset.file;
    audio.play();
    playBtn.textContent = "⏸️";

    musicBoxTitle.textContent = song.querySelector(".music-name").textContent;
}


audio.addEventListener("timeupdate", () => {
    const current = audio.currentTime;
    const total = audio.duration;

    const remaining = total - current;
    songDuration.textContent = (foramtTime(remaining));

    if (total > 0) {
        const progress = current / total;

        const offset = totalLength * (1 - progress);
        circle.style.strokeDashoffset = offset;
        console.log("Progress:", progress);
    }
});

function foramtTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

function loopStart() {
    loopBtn.addEventListener("click", () => {
        
        isLooping = !isLooping;

        isShuffle = false;
        shuffleBtn.textContent = "🔀";

        if (isLooping) {
            loopBtn.textContent = "🔂";
            audio.loop = true;
        } else {
            loopBtn.textContent = "🔁";
            audio.loop = false;
            shuffleOff();
        }
    });
}

function shuffleOff() {
    audio.onended = () => {
        currentIndex++;
        if (currentIndex >= allSongs.length) {
            currentIndex = 0;
        }
        playSong(currentIndex);
    };
}


function shuffleOn() {
    shuffleBtn.addEventListener("click", () => {
        isLooping = false;
        audio.loop = false;
        loopBtn.textContent = "🔁"
        isShuffle = !isShuffle;

        if (isShuffle) {
            shuffleBtn.textContent = "🔛";
            audio.onended = () => {
                const randomIndex = Math.floor(Math.random() * allSongs.length);
                currentIndex = randomIndex;
                playSong(currentIndex);
            }
        } else {
            shuffleBtn.textContent = "🔀";
            shuffleOff();
        }
    });
}

svg.addEventListener("click", (event) => {
    const rect = svg.getBoundingClientRect();

    const x = event.clientX - rect.left - 200;
    const y = event.clientY - rect.top - 200;

    let angle = Math.atan2(y, x);
    angle = angle + Math.PI / 2;

    if (angle < 0) angle += 2 * Math.PI;

    const progress = angle / (2 * Math.PI);

    audio.currentTime = audio.duration * progress;
});


svg.addEventListener("mousedown", () => {
    isSeeking = true;
});

document.addEventListener("mousemove", (event) => {
    if (!isSeeking) return;

    seekFromEvent(event);
});

document.addEventListener("mouseup", () => {
    isSeeking = false;
});

function seekFromEvent(event) {
    const rect = svg.getBoundingClientRect();


    const x = event.clientX - rect.left - 200;
    const y = event.clientY - rect.top - 200;

    let angle = Math.atan2(y, x);
    angle += Math.PI / 2;

    if (angle < 0) angle += 2 * Math.PI;

    const progress = angle / (2 * Math.PI);

    audio.currentTime = audio.duration * progress;
}

showPlayer.addEventListener("click", () => {
    musicPlayerBox.hidden = false;
    playlistBox.hidden = true;
});

shuffleOff();
shuffleOn();
nextSong();
previousSong();
loopStart();











