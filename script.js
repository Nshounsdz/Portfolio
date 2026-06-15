console.log("✅ Script.js chargé !");

// =========================================================
// --- SYSTÈME DE MODES DE PERFORMANCE ---
// =========================================================

let performanceMode = localStorage.getItem('performanceMode') || 'normal';
document.body.classList.add(`mode-${performanceMode}`);

function togglePerformanceMode() {
    if (performanceMode === 'normal') {
        performanceMode = 'light';
    } else {
        performanceMode = 'normal';
    }
    localStorage.setItem('performanceMode', performanceMode);
    location.reload();
}

function applyPerformanceMode() {
    if (performanceMode === 'light') {
        console.log('⚡ Mode léger activé');
        window.videoAutoplayEnabled = false;
        window.reducedStars = true;
    } else {
        console.log('🚀 Mode normal activé');
        window.videoAutoplayEnabled = true;
        window.reducedStars = false;
    }
}
applyPerformanceMode();

// =========================================================
// --- LOADER SPATIAL TRADUIT ---
// =========================================================

const loaderContainer = document.getElementById('loader-container');
const loaderBar = document.getElementById('loader-bar');
const loaderPercentage = document.getElementById('loader-percentage');
const loaderMessage = document.getElementById('loader-message');
const loaderStarsCanvas = document.getElementById('loader-stars');
const loaderCtx = loaderStarsCanvas.getContext('2d');

loaderStarsCanvas.width = window.innerWidth;
loaderStarsCanvas.height = window.innerHeight;

const loaderStars = [];
for (let i = 0; i < 200; i++) {
    loaderStars.push({
        x: Math.random() * loaderStarsCanvas.width,
        y: Math.random() * loaderStarsCanvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random()
    });
}

function animateLoaderStars() {
    loaderCtx.clearRect(0, 0, loaderStarsCanvas.width, loaderStarsCanvas.height);
    
    loaderStars.forEach(star => {
        loaderCtx.beginPath();
        loaderCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        loaderCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        loaderCtx.fill();
        
        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        star.y += star.speed;
        if (star.y > loaderStarsCanvas.height) {
            star.y = 0;
            star.x = Math.random() * loaderStarsCanvas.width;
        }
    });
    
    if (!loaderContainer.classList.contains('hidden')) {
        requestAnimationFrame(animateLoaderStars);
    }
}
animateLoaderStars();

let loadProgress = 0;
let assetsLoaded = {
    scripts: false,
    models: false,
    fonts: false
};

// Choix des messages selon la langue globale active
const loadMessages = window.currentLang === 'en' ? [
    "Initializing...",
    "Loading stars...",
    "Preparing the galaxy...",
    "Loading 3D models...",
    "Finalizing..."
] : [
    "Initialisation...",
    "Chargement des étoiles...",
    "Préparation de la galaxie...",
    "Chargement des modèles 3D...",
    "Finalisation..."
];

function updateLoader(progress, force = false) {
    if (progress > loadProgress || force) {
        loadProgress = progress;
        loaderBar.style.width = progress + '%';
        loaderPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress < 20) loaderMessage.textContent = loadMessages[0];
        else if (progress < 40) loaderMessage.textContent = loadMessages[1];
        else if (progress < 60) loaderMessage.textContent = loadMessages[2];
        else if (progress < 90) loaderMessage.textContent = loadMessages[3];
        else loaderMessage.textContent = loadMessages[4];
    }
}

function checkAllAssetsLoaded() {
    if (Object.values(assetsLoaded).every(v => v === true)) {
        updateLoader(100);
        setTimeout(() => {
            loaderContainer.classList.add('hidden');
        }, 500);
    }
}

updateLoader(10);

document.fonts.ready.then(() => {
    assetsLoaded.fonts = true;
    updateLoader(30);
    checkAllAssetsLoaded();
});

setTimeout(() => {
    assetsLoaded.scripts = true;
    updateLoader(50);
    checkAllAssetsLoaded();
}, 500);

window.loaderModelLoaded = function() {
    assetsLoaded.models = true;
    updateLoader(90);
    checkAllAssetsLoaded();
};

setTimeout(() => {
    if (!loaderContainer.classList.contains('hidden')) {
        console.log("⚠️ Loader timeout - fermeture forcée");
        loaderContainer.classList.add('hidden');
    }
}, 8000);

// --- LENIS (Smooth Scroll) ---
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
}
requestAnimationFrame(raf);

// --- GSAP SCROLL & NAV ---
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function scrollToSection(id) { gsap.to(window, { duration: 1.5, scrollTo: id, ease: "power3.inOut" }); }

// =========================================================
// --- LIGHTBOX DYNAMIQUE TRADUITE ---
// =========================================================
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(card) {
    const type = card.getAttribute('data-type');
    const src = card.getAttribute('data-src');
    const youtubeId = card.getAttribute('data-youtube-id');
    
    const title = card.querySelector('h3').innerText;
    
    // Récupération et traduction dynamique des valeurs fallbacks via t()
    const softs = card.getAttribute('data-softs') || window.t('lightbox.unknownSoft');
    const date = card.getAttribute('data-date') || window.t('lightbox.unknownDate');

    lightboxContent.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.style.display = 'block';
    wrapper.style.margin = 'auto';
    wrapper.style.textAlign = 'center';
    
    if (type === 'youtube' && youtubeId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
        iframe.width = '1280';
        iframe.height = '720';
        iframe.style.maxWidth = '90vw';
        iframe.style.maxHeight = '80vh';
        iframe.style.borderRadius = '4px';
        iframe.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        wrapper.appendChild(iframe);
    }
    else if (type === 'video') {
        const video = document.createElement('video'); 
        video.src = src; 
        video.controls = true; 
        video.autoplay = true; 
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '80vh';
        video.style.borderRadius = '4px';
        video.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
        wrapper.appendChild(video);
    } else {
        const img = document.createElement('img'); 
        img.src = src; 
        img.style.maxWidth = '90vw';
        img.style.maxHeight = '80vh';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
        wrapper.appendChild(img);
    }

    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'center';
    infoDiv.style.color = 'white';
    infoDiv.style.marginTop = '15px';
    infoDiv.innerHTML = `
        <h2 style="margin: 0; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
        <p style="margin: 5px 0 0; color: #aaa; font-size: 0.9rem; font-style: italic;">${softs}</p>
        <p style="margin: 0; color: #666; font-size: 0.8rem;">${date}</p>
    `;
    
    wrapper.appendChild(infoDiv);
    lightboxContent.appendChild(wrapper);

    if(lightboxCaption) lightboxCaption.innerText = ""; 

    lightbox.style.display = 'flex';
    gsap.to(lightbox, { opacity: 1, duration: 0.3 });
    lenis.stop();
}

function closeLightbox() {
    const activeVideo = lightboxContent.querySelector('video');
    if (activeVideo) { activeVideo.pause(); activeVideo.src = ""; }
    gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => { lightbox.style.display = 'none'; lightboxContent.innerHTML = ''; } });
    lenis.start();
}
lightboxContent.addEventListener('click', (e) => e.stopPropagation());

// --- FILTRAGE PROJETS ---
function filterProjects(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            if (card.style.display === 'none') {
                card.style.display = 'block';
                gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, clearProps: "all" });
            }
        } else {
            gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => { card.style.display = 'none'; } });
        }
    });
}

// --- OPTIMISATION VIDÉOS (Hover to Play) ---
document.addEventListener('DOMContentLoaded', () => {
    const projectVideos = document.querySelectorAll('.project-card video');
    projectVideos.forEach(video => {
        const card = video.closest('.project-card');
        video.removeAttribute('autoplay');
        video.setAttribute('preload', 'none');
        
        card.addEventListener('mouseenter', () => {
            if (window.videoAutoplayEnabled !== false) {
                video.load();
                video.play().catch(() => {});
            }
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute('src');
            video.load();
        });
    });
});

// --- ANIMATIONS DIVERSES ---
gsap.to(".soft-item", {
    scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none reverse" },
    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out"
});

document.addEventListener('DOMContentLoaded', function() {
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        ScrollTrigger.create({
            trigger: category,
            start: "top 80%",
            onEnter: () => {
                setTimeout(() => {
                    category.classList.add('visible');
                }, 150 * index);
            }
        });
    });
});

gsap.to("#turbulence-noise", { attr: { baseFrequency: "0.001" }, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });

const card = document.getElementById('tilt-card');
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -5;
    const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 5;
    card.style.transform = `perspective(1000px) scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1000px) scale(1.05) rotateX(0) rotateY(0)`; });

const floatingNav = document.getElementById('floating-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.8) {
        floatingNav.classList.add('visible');
    } else {
        floatingNav.classList.remove('visible');
    }
});

// =========================================================
// --- THREE.JS : GALAXY ENGINE ---
// =========================================================

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0005); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
document.getElementById('webgl-container').appendChild(renderer.domElement);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

const GALAXY_ROTATION_SPEED = 0.0002;  
const ROTATION_VARIATION = 0.2;        

const palettes = [
    { base: new THREE.Color(0x0a1a3a), mid: new THREE.Color(0x8a00ff), high: new THREE.Color(0x00d4ff), bg: new THREE.Color(0x050518) },
    { base: new THREE.Color(0x052010), mid: new THREE.Color(0x00ff6a), high: new THREE.Color(0xccff00), bg: new THREE.Color(0x020f05) },
    { base: new THREE.Color(0x200505), mid: new THREE.Color(0xff0033), high: new THREE.Color(0xffaa00), bg: new THREE.Color(0x150202) },
    { base: new THREE.Color(0x200515), mid: new THREE.Color(0xff0080), high: new THREE.Color(0xffd700), bg: new THREE.Color(0x12020f) },
    { base: new THREE.Color(0x001020), mid: new THREE.Color(0x0066ff), high: new THREE.Color(0xffffff), bg: new THREE.Color(0x020510) }
];

let currentPaletteIndex = Math.floor(Math.random() * palettes.length);
let nextPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
let transitionProgress = 0;
const transitionSpeed = 0.00015;

const currentColors = {
    base: palettes[currentPaletteIndex].base.clone(),
    mid: palettes[currentPaletteIndex].mid.clone(),
    high: palettes[currentPaletteIndex].high.clone(),
    bg: palettes[currentPaletteIndex].bg.clone()
};

function createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; 
    canvas.height = 256; 
    const ctx = canvas.getContext('2d');
    
    const grd = ctx.createRadialGradient(256, 128, 0, 256, 128, 220);
    grd.addColorStop(0, 'rgba(255,255,255,0.6)'); 
    grd.addColorStop(0.3, 'rgba(255,255,255,0.3)');
    grd.addColorStop(0.6, 'rgba(255,255,255,0.1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 256);
    
    const imageData = ctx.getImageData(0, 0, 512, 256);
    for(let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 0.15; 
        imageData.data[i + 3] *= (1 - noise);
    }
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
const nebulaTexture = createNebulaTexture();

const starLayers = [];

function createStarLayer(count, size, spread, speedMultiplier) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for(let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        sizes[i] = size * (0.5 + Math.random() * 1.5);
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
        size: size,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8 + Math.random() * 0.2,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(geom, mat);
    galaxyGroup.add(stars);
    
    return { mesh: stars, speedMultiplier: speedMultiplier };
}

const starMultiplier = window.reducedStars ? 0.3 : 1; 

starLayers.push(createStarLayer(Math.floor(18000 * starMultiplier), 0.15, 800, 0.15));  
starLayers.push(createStarLayer(Math.floor(4000 * starMultiplier), 0.35, 500, 0.35));   
starLayers.push(createStarLayer(Math.floor(600 * starMultiplier), 0.6, 300, 0.6));      

function createNebulaCloud(count, scaleX, scaleY, color, opacity, spread) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    
    for(let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * spread;
        const elongation = 2 + Math.random(); 
        
        pos[i * 3] = Math.cos(angle) * radius * elongation;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const mat = new THREE.PointsMaterial({
        size: scaleX,
        color: color,
        map: nebulaTexture,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geom, mat);
    galaxyGroup.add(points);
    return points;
}

const nebulaBase = createNebulaCloud(25, 1200, 600, currentColors.base, 0.25, 250);
const nebulaMid = createNebulaCloud(30, 900, 450, currentColors.mid, 0.18, 220);
const nebulaHigh = createNebulaCloud(20, 700, 350, currentColors.high, 0.22, 180);

nebulaBase.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
nebulaMid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
nebulaHigh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const modelGroup = new THREE.Group();
scene.add(modelGroup); 
modelGroup.position.set(20, 0, 10);

const loader = new THREE.GLTFLoader();

const modelList = [
    { file: 'models/mario64.glb',   scale: .2, yOffset: 4 },
    { file: 'models/nyoibo.glb',   scale: .3, yOffset: 2 },
    { file: 'models/gokukidhead.glb',   scale: .2, yOffset: 7 },
    { file: 'models/star64.glb',   scale: .25, yOffset: 0 },
    { file: 'models/logon64.glb',   scale: .25, yOffset: 0 },
    { file: 'models/triforce.glb',   scale: .25, yOffset: 2 },
    { file: 'models/grandstargalaxy.glb',   scale: .4, yOffset: 2 },
    { file: 'models/stargalaxy.glb',   scale: .4, yOffset: .5 },
    { file: 'models/mastersword.glb',   scale: .4, yOffset: .5 },
    { file: 'models/poltergust.glb',   scale: .18, yOffset: .5 },
    { file: 'models/shine.glb',   scale: .3, yOffset: 0 },
    { file: 'models/coin.glb',   scale: .3, yOffset: 0 },
    { file: 'models/redcoin.glb',   scale: .3, yOffset: 0 },
    { file: 'models/bluecoin.glb',   scale: .3, yOffset: 0 },
];

const randomIndex = Math.floor(Math.random() * modelList.length);
const selectedModel = modelList[randomIndex];

loader.load(selectedModel.file, 
    function (gltf) {
        const model = gltf.scene;
        const s = selectedModel.scale;
        model.scale.set(s, s, s); 

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); 

        const verticalShift = selectedModel.yOffset || 0; 
        model.position.y += verticalShift;

        model.traverse((node) => {
            if (node.isMesh) { node.material.wireframe = true; }
        });

        modelGroup.add(model);
        window.mainMesh = model;
        if (window.loaderModelLoaded) window.loaderModelLoaded();
    },
    undefined,
    function (error) {
        console.error('❌ Erreur modèle :', error);
        if (window.loaderModelLoaded) window.loaderModelLoaded();
    }
);

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0001; 
    
    transitionProgress += transitionSpeed;
    if(transitionProgress >= 1) {
        transitionProgress = 0;
        currentPaletteIndex = nextPaletteIndex;
        nextPaletteIndex = (nextPaletteIndex + 1) % palettes.length;
    }

    const p1 = palettes[currentPaletteIndex];
    const p2 = palettes[nextPaletteIndex];

    currentColors.base.lerpColors(p1.base, p2.base, transitionProgress);
    currentColors.mid.lerpColors(p1.mid, p2.mid, transitionProgress);
    currentColors.high.lerpColors(p1.high, p2.high, transitionProgress);
    currentColors.bg.lerpColors(p1.bg, p2.bg, transitionProgress);

    nebulaBase.material.color.copy(currentColors.base);
    nebulaMid.material.color.copy(currentColors.mid);
    nebulaHigh.material.color.copy(currentColors.high);
    
    scene.fog.color.copy(currentColors.bg);
    document.body.style.backgroundColor = `#${currentColors.bg.getHexString()}`;

    galaxyGroup.rotation.x += GALAXY_ROTATION_SPEED * (1 + Math.sin(time * 0.3) * ROTATION_VARIATION);
    galaxyGroup.rotation.y += GALAXY_ROTATION_SPEED * (1 + Math.cos(time * 0.4) * ROTATION_VARIATION);
    galaxyGroup.rotation.z += GALAXY_ROTATION_SPEED * (1 + Math.sin(time * 0.5) * ROTATION_VARIATION);
    
    nebulaBase.rotation.x += 0.00002; nebulaBase.rotation.y += 0.00005;
    nebulaMid.rotation.x -= 0.00003;  nebulaMid.rotation.y += 0.00007;
    nebulaHigh.rotation.x += 0.00004; nebulaHigh.rotation.y -= 0.00006;

    starLayers.forEach((layer, index) => {
        layer.mesh.rotation.y += 0.00003 * layer.speedMultiplier;
        layer.mesh.rotation.x += 0.00001 * layer.speedMultiplier * Math.sin(time + index);
    });

    if(window.mainMesh) {
        window.mainMesh.rotation.y += 0.001;
        window.mainMesh.rotation.x += 0.002;
        window.mainMesh.rotation.z += 0.003;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
});

// --- MUSIC PLAYER ---
const playlist = [
    { title: "Comet Observatory - Super Mario Galaxy", src: "musics/rosalina_observatory.mp3" },
    { title: "Title Screen - Super Mario Galaxy", src: "musics/smg-titlescreen.mp3" },
    { title: "World 7 - New Super Mario Bros", src: "musics/world7.mp3" },
    { title: "Observation Dome - Super Mario Galaxy", src: "musics/observationdome.mp3" },
    { title: " Space Junk Road - Super Mario Galaxy", src: "musics/spacejunk.mp3" },
    { title: " Dire Dire Docks - Super Mario 64", src: "musics/dirediredock.mp3" },
    { title: " Gallery - Luigi's Mansion", src: "musics/gallery.mp3" },
    { title: " Professor E.Gadd's Lab - Luigi's Mansion", src: "musics/egadds.mp3" },
    { title: " File Select - Luigi's Mansion", src: "musics/luigifile.mp3" },
    { title: " File Select - Super Mario 64", src: "musics/mariofile.mp3" },
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

const playerExpanded = document.getElementById('music-player-expanded');
const btnMinimized = document.getElementById('music-btn-minimized');
const trackName = document.getElementById('track-name');
const playBtn = document.querySelector('.main-play');
const volumeSlider = document.getElementById('volume-slider');

function getRandomTrackIndex(currentIndex) {
    if (playlist.length <= 1) return 0;
    let newIndex;
    do { newIndex = Math.floor(Math.random() * playlist.length); } while (newIndex === currentIndex); 
    return newIndex;
}

function loadTrack(index) {
    audio.src = playlist[index].src;
    trackName.innerText = playlist[index].title;
    if(isPlaying) audio.play();
}

function playRandomTrack() {
    currentTrackIndex = getRandomTrackIndex(currentTrackIndex);
    loadTrack(currentTrackIndex);
    if(isPlaying) audio.play(); 
    resetInactivityTimer();
}

function togglePlay() {
    if (isPlaying) { audio.pause(); playBtn.innerText = "▶"; } else { audio.play(); playBtn.innerText = "⏸"; }
    isPlaying = !isPlaying;
    resetInactivityTimer();
}

function nextTrack() { playRandomTrack(); if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; } }
function prevTrack() { playRandomTrack(); if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; } }
function setVolume(val) { audio.volume = val; resetInactivityTimer(); }

audio.addEventListener('ended', nextTrack);

let inactivityTimer;
const HIDE_DELAY = 4000; 

function showPlayer() { playerExpanded.classList.remove('hidden'); btnMinimized.classList.remove('active'); resetInactivityTimer(); }
function hidePlayer() { playerExpanded.classList.add('hidden'); btnMinimized.classList.add('active'); }
function resetInactivityTimer() { clearTimeout(inactivityTimer); inactivityTimer = setTimeout(hidePlayer, HIDE_DELAY); }
function togglePlayer(forceShow) { if(forceShow) showPlayer(); }

currentTrackIndex = getRandomTrackIndex(-1); 
loadTrack(currentTrackIndex);
audio.volume = volumeSlider.value;
resetInactivityTimer();

playerExpanded.addEventListener('mouseenter', () => clearTimeout(inactivityTimer));
playerExpanded.addEventListener('mouseleave', () => resetInactivityTimer());

// --- SCROLL ANIMATIONS ---
ScrollTrigger.create({
    trigger: "#home", start: "top center", end: "bottom center",
    onEnter: () => { gsap.to(modelGroup.position, { x: 20, y: 0, z: 10, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); },
    onEnterBack: () => { gsap.to(modelGroup.position, { x: 20, y: 0, z: 10, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); }
});

ScrollTrigger.create({
    trigger: "#projects", start: "top center", end: "bottom center",
    onEnter: () => { gsap.to(modelGroup.position, { x: -25, y: 0, z: 5, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); },
    onEnterBack: () => { gsap.to(modelGroup.position, { x: -25, y: 0, z: 5, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); }
});

ScrollTrigger.create({
    trigger: "#about", start: "top center", end: "bottom center",
    onEnter: () => { gsap.to(modelGroup.position, { x: 25, y: -5, z: 5, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); },
    onEnterBack: () => { gsap.to(modelGroup.position, { x: 25, y: -5, z: 5, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 }); }
});

ScrollTrigger.create({
    trigger: "#skills", start: "top center", end: "bottom center",
    onEnter: () => { gsap.to(modelGroup.position, { x: 20, y: 5, z: 8, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1.5 }); },
    onEnterBack: () => { gsap.to(modelGroup.position, { x: 20, y: 5, z: 8, duration: 1.5, ease: "power2.out" }); gsap.to(modelGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1.5 }); }
});

ScrollTrigger.create({
    trigger: "#contact", start: "top center", end: "bottom center",
    onEnter: () => { gsap.to(modelGroup.position, { x: 0, y: 0, z: 15, duration: 1.5, ease: "back.out(1.7)" }); gsap.to(modelGroup.scale, { x: 2, y: 2, z: 2, duration: 1.5 }); },
    onEnterBack: () => { gsap.to(modelGroup.position, { x: 0, y: 0, z: 15, duration: 1.5, ease: "back.out(1.7)" }); gsap.to(modelGroup.scale, { x: 2, y: 2, z: 2, duration: 1.5 }); }
});

var user = "naim.nshou";      
var domain = "gmail.com";  
var mailLink = document.getElementById('email-me');
var fullEmail = user + "@" + domain;
mailLink.href = "mailto:" + fullEmail;
mailLink.innerHTML = fullEmail;

console.log("✅ ScrollTriggers créés avec succès !");

// =========================================================
// --- FIX BUG SCROLL IFRAME (Demo Reel) ---
// =========================================================
const demoOverlay = document.querySelector('.demoreel-overlay');
const demoIframe = document.querySelector('.demoreel-container iframe');
const demoContainer = document.querySelector('.demoreel-container');

if (demoOverlay && demoIframe) {
    // Quand on clique, on casse la vitre et on active la vidéo
    demoOverlay.addEventListener('click', () => {
        demoIframe.style.pointerEvents = 'auto';
        demoOverlay.style.display = 'none';
        
        // Optionnel : Forcer la lecture automatique au 1er clic
        let src = demoIframe.src;
        if (!src.includes('autoplay=1')) {
            demoIframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
        }
    });

    // Dès que la souris sort du cadre, la vitre revient pour protéger le scroll
    demoContainer.addEventListener('mouseleave', () => {
        demoIframe.style.pointerEvents = 'none';
        demoOverlay.style.display = 'block';
    });
}