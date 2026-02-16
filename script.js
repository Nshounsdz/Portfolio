console.log("✅ Script.js chargé !");

// =========================================================
// --- SYSTÈME DE MODES DE PERFORMANCE ---
// =========================================================

// Récupérer le mode sauvegardé (par défaut: normal)
let performanceMode = localStorage.getItem('performanceMode') || 'normal';
document.body.classList.add(`mode-${performanceMode}`);

// Fonction pour toggle entre les modes
function togglePerformanceMode() {
    if (performanceMode === 'normal') {
        performanceMode = 'light';
    } else {
        performanceMode = 'normal';
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('performanceMode', performanceMode);
    
    // Recharger la page pour appliquer tous les changements (y compris les étoiles)
    location.reload();
}

// Appliquer les optimisations selon le mode
function applyPerformanceMode() {
    if (performanceMode === 'light') {
        // MODE LÉGER : Optimisations
        console.log('⚡ Mode léger activé');
        
        // Désactiver le lazy loading des vidéos
        window.videoAutoplayEnabled = false;
        
        // Réduire les étoiles
        window.reducedStars = true;
        
    } else {
        // MODE NORMAL : Performances complètes
        console.log('🚀 Mode normal activé');
        
        // Réactiver les vidéos
        window.videoAutoplayEnabled = true;
        
        // Étoiles complètes
        window.reducedStars = false;
    }
}

// Appliquer le mode au chargement
applyPerformanceMode();

// =========================================================
// --- LOADER SPATIAL ---
// =========================================================

const loaderContainer = document.getElementById('loader-container');
const loaderBar = document.getElementById('loader-bar');
const loaderPercentage = document.getElementById('loader-percentage');
const loaderMessage = document.getElementById('loader-message');
const loaderStarsCanvas = document.getElementById('loader-stars');
const loaderCtx = loaderStarsCanvas.getContext('2d');

// Configuration du canvas
loaderStarsCanvas.width = window.innerWidth;
loaderStarsCanvas.height = window.innerHeight;

// Création des étoiles pour le loader
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

// Animation des étoiles du loader
function animateLoaderStars() {
    loaderCtx.clearRect(0, 0, loaderStarsCanvas.width, loaderStarsCanvas.height);
    
    loaderStars.forEach(star => {
        loaderCtx.beginPath();
        loaderCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        loaderCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        loaderCtx.fill();
        
        // Faire scintiller
        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        // Déplacer vers le bas
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

// Système de progression du loader
let loadProgress = 0;
let assetsLoaded = {
    scripts: false,
    models: false,
    fonts: false
};

const loadMessages = [
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
        
        // Changer le message selon la progression
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

// Démarrer avec 10% (scripts chargés)
updateLoader(10);

// Simuler le chargement des fonts
document.fonts.ready.then(() => {
    assetsLoaded.fonts = true;
    updateLoader(30);
    checkAllAssetsLoaded();
});

// Les scripts sont chargés
setTimeout(() => {
    assetsLoaded.scripts = true;
    updateLoader(50);
    checkAllAssetsLoaded();
}, 500);

// Le modèle 3D sera marqué comme chargé plus tard dans le code
window.loaderModelLoaded = function() {
    assetsLoaded.models = true;
    updateLoader(90);
    checkAllAssetsLoaded();
};

// Fallback: si rien ne se passe après 8 secondes, on retire le loader
setTimeout(() => {
    if (!loaderContainer.classList.contains('hidden')) {
        console.log("⚠️ Loader timeout - fermeture forcée");
        loaderContainer.classList.add('hidden');
    }
}, 8000);

// --- 1. LENIS (Smooth Scroll) ---
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
}
requestAnimationFrame(raf);

// --- 2. GSAP SCROLL & NAV ---
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 🔥 IMPORTANT : Connecter Lenis à ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

function scrollToSection(id) { gsap.to(window, { duration: 1.5, scrollTo: id, ease: "power3.inOut" }); }

// --- 3. LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(card) {
    const type = card.getAttribute('data-type');
    const src = card.getAttribute('data-src');
    
    // 1. RÉCUPÉRATION DES NOUVELLES INFOS
    const title = card.querySelector('h3').innerText;
    const softs = card.getAttribute('data-softs') || "Logiciel inconnu"; // Valeur par défaut si vide
    const date = card.getAttribute('data-date') || "Date inconnue";

    lightboxContent.innerHTML = '';
    
    // 2. CRÉATION DU CONTENEUR MÉDIA
    // On met le média dans une div pour pouvoir centrer le texte en dessous
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '15px';
    
    if (type === 'video') {
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

    // 3. CRÉATION DU BLOC TEXTE (TITRE + SOFTS + DATE)
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'center';
    infoDiv.style.color = 'white';
    infoDiv.innerHTML = `
        <h2 style="margin: 0; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
        <p style="margin: 5px 0 0; color: #aaa; font-size: 0.9rem; font-style: italic;">${softs}</p>
        <p style="margin: 0; color: #666; font-size: 0.8rem;">${date}</p>
    `;
    
    wrapper.appendChild(infoDiv);
    lightboxContent.appendChild(wrapper);

    // On efface l'ancien caption séparé s'il existe encore dans ton HTML
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

// --- 4. FILTRAGE PROJETS ---
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

// --- LAZY LOADING VIDÉOS (Optimisation performances) ---
// Les vidéos ne se chargent et ne jouent que quand elles sont visibles
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        
        if (entry.isIntersecting) {
            // La vidéo est visible : on la charge
            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
            }
            
            // On la joue SEULEMENT en mode normal
            if (window.videoAutoplayEnabled !== false) {
                video.play().catch(() => {});
            }
        } else {
            // La vidéo n'est plus visible : pause
            video.pause();
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '200px'
});

// Appliquer l'observer à toutes les vidéos des cartes projets
document.addEventListener('DOMContentLoaded', () => {
    const projectVideos = document.querySelectorAll('.project-card video');
    
    projectVideos.forEach(video => {
        const source = video.querySelector('source');
        if (source && source.src) {
            video.dataset.src = source.src;
            source.removeAttribute('src');
        }
        
        video.removeAttribute('autoplay');
        video.setAttribute('preload', 'metadata');
        
        videoObserver.observe(video);
    });
    
    console.log(`✅ Lazy loading activé pour ${projectVideos.length} vidéos`);
});

// --- 5. ANIMATIONS DIVERSES ---
gsap.to(".soft-item", {
    scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none reverse" },
    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out"
});

// Animation des compétences
document.addEventListener('DOMContentLoaded', function() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        ScrollTrigger.create({
            trigger: category,
            start: "top 80%",
            onEnter: () => {
                // Rendre visible avec animation
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

// --- 7. NAVIGATION FLOTTANTE ---
const floatingNav = document.getElementById('floating-nav');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    // Visible partout sauf sur la section Home
    if (scrollY > winH * 0.8) {
        floatingNav.classList.add('visible');
    } else {
        floatingNav.classList.remove('visible');
    }
});

// =========================================================
// --- 8. THREE.JS : GALAXY ENGINE FINAL ---
// =========================================================

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0005); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
scene.add(camera); // IMPORTANT : Ajouter la caméra à la scène

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
document.getElementById('webgl-container').appendChild(renderer.domElement);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

// ===== CONFIGURATION DES VITESSES DE ROTATION =====
// Ajuste ces valeurs pour contrôler la vitesse de rotation de la galaxie
const GALAXY_ROTATION_SPEED = 0.0002;  // Vitesse de base (réduite de 0.0005 à 0.0002)
const ROTATION_VARIATION = 0.2;        // Variation aléatoire (±20%)
// ==================================================

// --- PALETTES DE COULEURS ---
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

// --- TEXTURE NÉBULEUSE (Allongée et organique) ---
function createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Plus grande résolution pour éviter la pixelisation
    canvas.height = 256; 
    const ctx = canvas.getContext('2d');
    
    // Créer un gradient allongé avec bords plus doux
    const grd = ctx.createRadialGradient(256, 128, 0, 256, 128, 220);
    grd.addColorStop(0, 'rgba(255,255,255,0.6)'); 
    grd.addColorStop(0.3, 'rgba(255,255,255,0.3)');
    grd.addColorStop(0.6, 'rgba(255,255,255,0.1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 256);
    
    // Ajouter du bruit subtil pour rendre les bords irréguliers
    const imageData = ctx.getImageData(0, 0, 512, 256);
    for(let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 0.15; // Moins de bruit = bords plus doux
        imageData.data[i + 3] *= (1 - noise);
    }
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
const nebulaTexture = createNebulaTexture();

// --- SYSTÈME D'ÉTOILES MULTI-COUCHES (Profondeur) ---
// INVERSÉ : Plus d'étoiles loin, moins d'étoiles proches
const starLayers = [];

function createStarLayer(count, size, spread, speedMultiplier) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for(let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        
        // Variation de taille pour chaque étoile
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
    
    return {
        mesh: stars,
        speedMultiplier: speedMultiplier
    };
}

// INVERSÉ : Plus d'étoiles lointaines, moins d'étoiles proches
// Ajustement selon le mode performance
const starMultiplier = window.reducedStars ? 0.3 : 1; // 70% moins d'étoiles en mode léger

starLayers.push(createStarLayer(Math.floor(18000 * starMultiplier), 0.15, 800, 0.15));  // Lointaines
starLayers.push(createStarLayer(Math.floor(4000 * starMultiplier), 0.35, 500, 0.35));   // Moyennes
starLayers.push(createStarLayer(Math.floor(600 * starMultiplier), 0.6, 300, 0.6));      // Proches

// --- NÉBULEUSES ALLONGÉES (Style Mario Galaxy) ---
// Plus loin et plus grandes pour être bien visibles
function createNebulaCloud(count, scaleX, scaleY, color, opacity, spread) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    
    for(let i = 0; i < count; i++) {
        // Distribution allongée pour créer des formes de nuages
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * spread;
        const elongation = 2 + Math.random(); // Facteur d'élongation
        
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

// Nébuleuses plus grandes et plus visibles
const nebulaBase = createNebulaCloud(25, 1200, 600, currentColors.base, 0.25, 250);
const nebulaMid = createNebulaCloud(30, 900, 450, currentColors.mid, 0.18, 220);
const nebulaHigh = createNebulaCloud(20, 700, 350, currentColors.high, 0.22, 180);

// Rotation initiale aléatoire pour chaque nébuleuse
nebulaBase.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
nebulaMid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
nebulaHigh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);



// ==========================================
// --- FORME 3D : IMPORT MODÈLE GLB ---
// ==========================================

// 1. LUMIÈRES (OBLIGATOIRES pour voir le modèle)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// 2. GROUPE CONTENEUR (Pour le scroll)
const modelGroup = new THREE.Group();
scene.add(modelGroup); // Remettre dans la scène, pas dans la caméra
modelGroup.position.set(20, 0, 10);

// 3. CHARGEMENT DU MODÈLE (ALÉATOIRE)
const loader = new THREE.GLTFLoader();

// --- A. TA LISTE DE MODÈLES ---
// Ajoute autant de modèles que tu veux ici.
// "file" : le chemin vers ton fichier .glb
// "scale" : la taille idéale (1 = normal, 0.5 = moitié, 2 = double)
const modelList = [
    // scale: Taille | yOffset: Décalage vertical (Haut/Bas)
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

// --- B. TIRAGE AU SORT ---
const randomIndex = Math.floor(Math.random() * modelList.length);
const selectedModel = modelList[randomIndex];

console.log("🎲 Modèle choisi : " + selectedModel.file);

// --- C. CHARGEMENT ---
loader.load(selectedModel.file, 
    function (gltf) {
        const model = gltf.scene;

        // 1. ÉCHELLE
        const s = selectedModel.scale;
        model.scale.set(s, s, s); 

        // 2. RECENTRAGE AUTOMATIQUE (Calcul mathématique)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); 

        // 3. APPLICATION DE TON OFFSET MANUEL (La retouche finale)
        // Si yOffset existe dans la liste, on l'applique, sinon on ajoute 0
        const verticalShift = selectedModel.yOffset || 0; 
        model.position.y += verticalShift;

        // Optionnel : Activer les ombres sur le modèle
        model.traverse((node) => {
            if (node.isMesh) {
                // Si tu veux garder l'aspect "fil de fer" (Wireframe) sur ton modèle, décommente ça :
                node.material.wireframe = true; 
            }
        });

        modelGroup.add(model);
        window.mainMesh = model;
        
        // Notifier le loader que le modèle est chargé
        console.log("✅ Modèle 3D chargé !");
        if (window.loaderModelLoaded) window.loaderModelLoaded();
    },
    undefined,
    function (error) {
        console.error('❌ Erreur sur le modèle ' + selectedModel.file + ' :', error);
        // Même en cas d'erreur, on débloquer le loader
        if (window.loaderModelLoaded) window.loaderModelLoaded();
    }
);


// ==========================================
// --- ANIMATION LOOP (CELLE QUI MANQUAIT) ---
// ==========================================

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0001; // Timer pour les mouvements fluides
    
    // 1. GESTION DES COULEURS (ON GARDE TON SYSTÈME)
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
    
    // Mise à jour du fond
    scene.fog.color.copy(currentColors.bg);
    document.body.style.backgroundColor = `#${currentColors.bg.getHexString()}`;

    // 2. ROTATION DE LA GALAXIE (au lieu de la caméra)
    // Rotations ÉGALES sur les 3 axes pour une vraie dérive spatiale
    // Ajuste GALAXY_ROTATION_SPEED en haut du script pour changer la vitesse
    
    galaxyGroup.rotation.x += GALAXY_ROTATION_SPEED * (1 + Math.sin(time * 0.3) * ROTATION_VARIATION);
    galaxyGroup.rotation.y += GALAXY_ROTATION_SPEED * (1 + Math.cos(time * 0.4) * ROTATION_VARIATION);
    galaxyGroup.rotation.z += GALAXY_ROTATION_SPEED * (1 + Math.sin(time * 0.5) * ROTATION_VARIATION);
    
    // 3. LÉGÈRE ROTATION DES NÉBULEUSES (pour plus de vie)
    nebulaBase.rotation.x += 0.00002;
    nebulaBase.rotation.y += 0.00005;
    nebulaBase.rotation.z += 0.00003;
    
    nebulaMid.rotation.x -= 0.00003;
    nebulaMid.rotation.y += 0.00007;
    nebulaMid.rotation.z -= 0.00002;
    
    nebulaHigh.rotation.x += 0.00004;
    nebulaHigh.rotation.y -= 0.00006;
    nebulaHigh.rotation.z += 0.00002;

    // 4. PARALLAXE SUBTILE DES COUCHES D'ÉTOILES
    starLayers.forEach((layer, index) => {
        layer.mesh.rotation.y += 0.00003 * layer.speedMultiplier;
        layer.mesh.rotation.x += 0.00001 * layer.speedMultiplier * Math.sin(time + index);
    });

    // 5. ANIMATION DU MODÈLE 3D (Si chargé)
    if(window.mainMesh) {
        // Rotation sur les 3 axes
        window.mainMesh.rotation.y += 0.001; // Rotation principale (toupie)
        window.mainMesh.rotation.x += 0.002; // Légère bascule avant/arrière
        window.mainMesh.rotation.z += 0.003; // Léger roulis sur le côté
    }
    
    renderer.render(scene, camera);
}
// Lancement de l'animation
animate();


window.addEventListener('resize', () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
});


// =========================================================
// --- 9. MUSIC PLAYER (SHUFFLE & AUTO-HIDE) ---
// =========================================================

// --- A. CONFIGURATION ---
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

// Éléments DOM
const playerExpanded = document.getElementById('music-player-expanded');
const btnMinimized = document.getElementById('music-btn-minimized');
const trackName = document.getElementById('track-name');
const playBtn = document.querySelector('.main-play');
const volumeSlider = document.getElementById('volume-slider');

// --- B. LOGIQUE ALÉATOIRE INTELLIGENTE ---
function getRandomTrackIndex(currentIndex) {
    if (playlist.length <= 1) return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentIndex); 
    return newIndex;
}

// --- C. LOGIQUE AUDIO ---
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
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = "▶";
    } else {
        audio.play();
        playBtn.innerText = "⏸";
    }
    isPlaying = !isPlaying;
    resetInactivityTimer();
}

function nextTrack() {
    playRandomTrack();
    if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; }
}

function prevTrack() {
    playRandomTrack();
    if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; }
}

function setVolume(val) {
    audio.volume = val;
    resetInactivityTimer();
}

// AUTO-SHUFFLE
audio.addEventListener('ended', nextTrack);


// --- D. SYSTÈME AUTO-HIDE ---
let inactivityTimer;
const HIDE_DELAY = 4000; 

function showPlayer() {
    playerExpanded.classList.remove('hidden');
    btnMinimized.classList.remove('active');
    resetInactivityTimer();
}

function hidePlayer() {
    playerExpanded.classList.add('hidden');
    btnMinimized.classList.add('active');
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(hidePlayer, HIDE_DELAY);
}

function togglePlayer(forceShow) {
    if(forceShow) showPlayer();
}

// --- INITIALISATION ---
currentTrackIndex = getRandomTrackIndex(-1); 
loadTrack(currentTrackIndex);
audio.volume = volumeSlider.value;
resetInactivityTimer();

// --- E. INTERACTION SOURIS ---
playerExpanded.addEventListener('mouseenter', () => clearTimeout(inactivityTimer));
playerExpanded.addEventListener('mouseleave', () => resetInactivityTimer());


// =========================================================
// --- 10. SCROLL ANIMATION avec ScrollTrigger ---
// =========================================================
// On attend que tout soit bien chargé avant de créer les triggers

console.log("🎯 Création des ScrollTriggers...");

// Position HOME (Section #home)
ScrollTrigger.create({
    trigger: "#home",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
        console.log("🏠 Entrée dans HOME");
        gsap.to(modelGroup.position, { x: 20, y: 0, z: 10, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    },
    onEnterBack: () => {
        console.log("🏠 Retour dans HOME");
        gsap.to(modelGroup.position, { x: 20, y: 0, z: 10, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
});

// Position PROJECTS (Section #projects)
ScrollTrigger.create({
    trigger: "#projects",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
        console.log("💼 Entrée dans PROJECTS");
        gsap.to(modelGroup.position, { x: -25, y: 0, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    },
    onEnterBack: () => {
        console.log("💼 Retour dans PROJECTS");
        gsap.to(modelGroup.position, { x: -25, y: 0, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
});

// Position ABOUT (Section #about)
ScrollTrigger.create({
    trigger: "#about",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
        console.log("👤 Entrée dans ABOUT");
        gsap.to(modelGroup.position, { x: 25, y: -5, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    },
    onEnterBack: () => {
        console.log("👤 Retour dans ABOUT");
        gsap.to(modelGroup.position, { x: 25, y: -5, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
});

// Position SKILLS (Section #skills)
ScrollTrigger.create({
    trigger: "#skills",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
        console.log("⚡ Entrée dans SKILLS");
        gsap.to(modelGroup.position, { x: 20, y: 5, z: 8, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1.5 });
    },
    onEnterBack: () => {
        console.log("⚡ Retour dans SKILLS");
        gsap.to(modelGroup.position, { x: 20, y: 5, z: 8, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1.5 });
    }
});

// Position CONTACT (Section #contact)
ScrollTrigger.create({
    trigger: "#contact",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
        console.log("📧 Entrée dans CONTACT");
        gsap.to(modelGroup.position, { x: 0, y: 0, z: 15, duration: 1.5, ease: "back.out(1.7)" });
        gsap.to(modelGroup.scale, { x: 2, y: 2, z: 2, duration: 1.5 });
    },
    onEnterBack: () => {
        console.log("📧 Retour dans CONTACT");
        gsap.to(modelGroup.position, { x: 0, y: 0, z: 15, duration: 1.5, ease: "back.out(1.7)" });
        gsap.to(modelGroup.scale, { x: 2, y: 2, z: 2, duration: 1.5 });
    }
});

console.log("✅ ScrollTriggers créés avec succès !");