/* ═══════════════════════════════════════════════════════════════
   LOFI PIXEL VISUALIZER - JavaScript
   Animations, effects, and Spotify integration
═══════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    stars: {
        count: 50,
        minSize: 2,
        maxSize: 4
    },
    rain: {
        count: 100,
        minSpeed: 0.8,
        maxSpeed: 1.5,
        minLength: 10,
        maxLength: 25
    },
    particles: {
        count: 15,
        minSize: 2,
        maxSize: 6,
        minSpeed: 15,
        maxSpeed: 30
    },
    steam: {
        count: 3,
        interval: 800
    }
};

// ═══════════════════════════════════════════════════════════════
// DEMO MUSIC PLAYER (No Spotify / No audio — just UI + fake tracks)
// ═══════════════════════════════════════════════════════════════

const DEMO_TRACKS = [
    { name: 'Lake Shore Loops', artist: 'Pixel Daydream', durationMs: 186000 },
    { name: 'Midnight CTA', artist: 'Neon Transit', durationMs: 204000 },
    { name: 'Snowy Streetlights', artist: 'Warm Static', durationMs: 174000 },
    { name: 'Rooftop Rain', artist: 'Lo-Fi Lanterns', durationMs: 195000 },
    { name: 'Afterglow Arcade', artist: 'Chill Circuit', durationMs: 210000 }
];

class DemoPlayer {
    constructor(tracks) {
        this.tracks = tracks;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.progressMs = 0;
        this.lastTickMs = null;
        this.tickInterval = null;

        this.trackNameEl = document.getElementById('trackName');
        this.artistNameEl = document.getElementById('artistName');
        this.progressEl = document.getElementById('progress');
        this.vinylEl = document.querySelector('.vinyl');
        this.playBtnEl = document.getElementById('playBtn');
        this.visualizerEl = document.getElementById('visualizer');

        this.setTrack(0, { autoplay: false });
        this.applyPlaybackUI();
    }

    get currentTrack() {
        return this.tracks[this.currentIndex];
    }

    setTrack(index, { autoplay } = { autoplay: this.isPlaying }) {
        const len = this.tracks.length;
        if (len === 0) return;

        this.currentIndex = ((index % len) + len) % len;
        this.progressMs = 0;
        this.lastTickMs = Date.now();

        this.renderTrack();
        this.renderProgress();

        if (autoplay) this.play();
        else this.pause();
    }

    renderTrack() {
        if (this.trackNameEl) this.trackNameEl.textContent = this.currentTrack.name;
        if (this.artistNameEl) this.artistNameEl.textContent = this.currentTrack.artist;
    }

    renderProgress() {
        if (!this.progressEl) return;
        const duration = Math.max(1, this.currentTrack.durationMs);
        const pct = Math.min(100, (this.progressMs / duration) * 100);
        this.progressEl.style.width = `${pct}%`;
    }

    applyPlaybackUI() {
        if (this.vinylEl) {
            if (this.isPlaying) this.vinylEl.classList.add('playing');
            else this.vinylEl.classList.remove('playing');
        }

        if (this.playBtnEl) {
            this.playBtnEl.textContent = this.isPlaying ? '❚❚' : '▶';
        }

        if (this.visualizerEl) {
            if (this.isPlaying) this.visualizerEl.classList.remove('paused');
            else this.visualizerEl.classList.add('paused');
        }
    }

    startTicker() {
        this.stopTicker();
        this.lastTickMs = Date.now();

        this.tickInterval = setInterval(() => {
            if (!this.isPlaying) return;

            const now = Date.now();
            const delta = now - (this.lastTickMs ?? now);
            this.lastTickMs = now;
            this.progressMs += delta;

            if (this.progressMs >= this.currentTrack.durationMs) {
                this.nextTrack();
                return;
            }

            this.renderProgress();
        }, 250);
    }

    stopTicker() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastTickMs = Date.now();
        this.startTicker();
        this.applyPlaybackUI();
    }

    pause() {
        if (!this.isPlaying) {
            this.applyPlaybackUI();
            return;
        }
        this.isPlaying = false;
        this.stopTicker();
        this.applyPlaybackUI();
    }

    togglePlayback() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    nextTrack() {
        this.setTrack(this.currentIndex + 1, { autoplay: this.isPlaying });
    }

    previousTrack() {
        this.setTrack(this.currentIndex - 1, { autoplay: this.isPlaying });
    }
}

// ═══════════════════════════════════════════════════════════════
// VISUAL EFFECTS
// ═══════════════════════════════════════════════════════════════

/**
 * Create stars in the night sky
 */
function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;

    for (let i = 0; i < CONFIG.stars.count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * (CONFIG.stars.maxSize - CONFIG.stars.minSize) + CONFIG.stars.minSize;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        
        container.appendChild(star);
    }
}

/**
 * Create rain effect
 */
function createRain() {
    const container = document.getElementById('rain');
    if (!container) return;

    for (let i = 0; i < CONFIG.rain.count; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        
        const length = Math.random() * (CONFIG.rain.maxLength - CONFIG.rain.minLength) + CONFIG.rain.minLength;
        const speed = Math.random() * (CONFIG.rain.maxSpeed - CONFIG.rain.minSpeed) + CONFIG.rain.minSpeed;
        
        drop.style.height = `${length}px`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${speed}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.opacity = Math.random() * 0.3 + 0.1;
        
        container.appendChild(drop);
    }
}

/**
 * Create floating particles
 */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < CONFIG.particles.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
        const speed = Math.random() * (CONFIG.particles.maxSpeed - CONFIG.particles.minSpeed) + CONFIG.particles.minSpeed;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${speed}s`;
        particle.style.animationDelay = `${Math.random() * speed}s`;
        
        container.appendChild(particle);
    }
}

/**
 * Create steam effect for the coffee cup
 */
function createSteam() {
    const container = document.getElementById('steam');
    if (!container) return;

    setInterval(() => {
        for (let i = 0; i < CONFIG.steam.count; i++) {
            setTimeout(() => {
                const steam = document.createElement('div');
                steam.className = 'steam-particle';
                steam.style.left = `${-5 + Math.random() * 10}px`;
                container.appendChild(steam);

                setTimeout(() => {
                    steam.remove();
                }, 2000);
            }, i * 200);
        }
    }, CONFIG.steam.interval);
}

/**
 * Update the time display
 */
const CHICAGO_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
});

function updateTime() {
    const display = document.getElementById('timeDisplay');
    if (!display) return;

    display.textContent = CHICAGO_TIME_FORMATTER.format(new Date());
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Initialize visual effects
    createStars();
    createRain();
    createParticles();
    createSteam();

    // Start time display
    updateTime();
    setInterval(updateTime, 1000);

    // Demo music player (fake songs / no audio)
    const demo = new DemoPlayer(DEMO_TRACKS);

    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => demo.togglePlayback());
    }

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => demo.previousTrack());
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => demo.nextTrack());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                demo.togglePlayback();
                break;
            case 'ArrowRight':
                demo.nextTrack();
                break;
            case 'ArrowLeft':
                demo.previousTrack();
                break;
        }
    });

    console.log(`
╔════════════════════════════════════════════════════════════╗
║              🎵 LOFI PIXEL VISUALIZER 🎵                  ║
╠════════════════════════════════════════════════════════════╣
║  Enjoy the chill vibes!                                    ║
║                                                            ║
║  Demo Player Shortcuts:                                    ║
║  • Space: Play/Pause                                       ║
║  • → : Next track                                          ║
║  • ← : Previous track                                      ║
╚════════════════════════════════════════════════════════════╝
    `);
});
