// =========================================================
// SYSTÈME DE TRADUCTION FR/EN
// =========================================================

const translations = {
    fr: {
        // Navigation
        nav: {
            home: "Accueil",
            work: "Travaux",
            about: "À propos",
            skills: "Compétences",
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            greeting: "Salut, je suis",
            title: "Animateur 3D",
            subtitle: "Passionné par l'animation 3D et les jeux vidéo, je crée des personnages qui prennent vie à travers le mouvement et l'émotion.",
            cta: "Voir mes travaux",
            downloadCV: "Télécharger CV"
        },
        
        // Filtres projets
        filters: {
            all: "Tout",
            anim: "Animations",
            model: "Modélisation",
            render: "Rendus"
        },
        
        // Section À propos
        about: {
            title: "À propos",
            subtitle: "Qui je suis",
            description: "Salut, moi c'est Naïm. Passionné par la 3D et le rendu temps réel. J'aime créer des univers immersifs et raconter des histoires à travers la lumière et le mouvement.",
            location: "Lille, France",
            availability: "Disponible pour alternance",
            email: "Email",
            skillsBtn: "Mes compétences"
        },
        
        // Section Compétences
        skills: {
            title: "Compétences",
            subtitle: "Ce que je maîtrise",
            animation: {
                title: "Animation 3D",
                items: [
                    "Character Animation & Rigging",
                    "HDRI Lighting",
                    "Keyframe Animation",
                    "Walk Cycles & Facial Animation"
                ]
            },
            modeling: {
                title: "Modélisation 3D",
                items: [
                    "Hard Surface Modeling",
                    "Character Modeling",
                    "UV Mapping & Texturing",
                    "Topology Optimization"
                ]
            },
            software: {
                title: "Logiciels",
                items: [
                    "Blender (Avancé)",
                    "Maya (Intermédiaire)",
                    "Unity (Avancé)",
                    "Unreal Engine (Notions)",
                    "Premiere Pro (Avancé)",
                    "After Effects (Intermédiaire)"
                ]
            }
        },
        
        // Section Contact
        contact: {
            title: "Let's a Go !",
            subtitle: "Travaillons ensemble",
            description: "Je suis actuellement à la recherche d'une alternance pour septembre 2025. N'hésitez pas à me contacter !",
            linkedinBtn: "LinkedIn",
            emailBtn: "Contactez-moi"
        },
        
        // Footer
        footer: {
            rights: "Tous droits réservés",
            madeWith: "Fait avec",
            and: "et"
        },
        
        // Lightbox
        lightbox: {
            software: "Logiciel",
            date: "Date",
            close: "Fermer"
        },
        
        // Mode Performance
        performance: {
            label: "Performance",
            switchTo: "Passer en mode"
        },
        
        // Catégories de projets
        projectTypes: {
            animation: "Animation",
            render: "Render",
            modeling: "Modélisation",
            schoolProject: "Projet Scolaire",
            personal: "Projet Personnel"
        }
    },
    
    en: {
        // Navigation
        nav: {
            home: "Home",
            work: "Work",
            about: "About",
            skills: "Skills",
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            greeting: "Hi, I'm",
            title: "3D Animator",
            subtitle: "Passionate about 3D animation and video games, I create characters that come to life through movement and emotion.",
            cta: "View my work",
            downloadCV: "Download CV"
        },
        
        // Filtres projets
        filters: {
            all: "All",
            anim: "Animations",
            model: "Modeling",
            render: "Renders"
        },
        
        // Section À propos
        about: {
            title: "About",
            subtitle: "Who I am",
            description: "Hi, I'm Naïm. Passionate about 3D and real-time rendering. I love creating immersive worlds and telling stories through light and movement.",
            location: "Lille, France",
            availability: "Available for work-study",
            email: "Email",
            skillsBtn: "My skills"
        },
        
        // Section Compétences
        skills: {
            title: "Skills",
            subtitle: "What I master",
            animation: {
                title: "3D Animation",
                items: [
                    "Character Animation & Rigging",
                    "HDRI Lighting",
                    "Keyframe Animation",
                    "Walk Cycles & Facial Animation"
                ]
            },
            modeling: {
                title: "3D Modeling",
                items: [
                    "Hard Surface Modeling",
                    "Character Modeling",
                    "UV Mapping & Texturing",
                    "Topology Optimization"
                ]
            },
            software: {
                title: "Software",
                items: [
                    "Blender (Advanced)",
                    "Maya (Intermediate)",
                    "Unity (Advanced)",
                    "Unreal Engine (Basics)",
                    "Premiere Pro (Advanced)",
                    "After Effects (Intermediate)"
                ]
            }
        },
        
        // Section Contact
        contact: {
            title: "Let's a Go !",
            subtitle: "Let's work together",
            description: "I'm currently looking for a work-study opportunity for September 2025. Feel free to reach out!",
            linkedinBtn: "LinkedIn",
            emailBtn: "Contact me"
        },
        
        // Footer
        footer: {
            rights: "All rights reserved",
            madeWith: "Made with",
            and: "and"
        },
        
        // Lightbox
        lightbox: {
            software: "Software",
            date: "Date",
            close: "Close"
        },
        
        // Mode Performance
        performance: {
            label: "Performance",
            switchTo: "Switch to"
        },
        
        // Catégories de projets
        projectTypes: {
            animation: "Animation",
            render: "Render",
            modeling: "Modeling",
            schoolProject: "School Project",
            personal: "Personal Project"
        }
    }
};

// =========================================================
// FONCTION DE TRADUCTION
// =========================================================

let currentLang = localStorage.getItem('language') || 'fr';

// Rendre accessible globalement pour onclick
window.currentLang = currentLang;

// Vérifier si l'URL contient ?lang=en ou ?lang=fr
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('lang')) {
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'fr') {
        currentLang = urlLang;
        window.currentLang = urlLang;
        localStorage.setItem('language', currentLang);
    }
}

function t(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        value = value[k];
        if (value === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }
    
    return value;
}

function translatePage() {
    // Traduire tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Traduire les tooltips
    document.querySelectorAll('[data-i18n-tooltip]').forEach(element => {
        const key = element.getAttribute('data-i18n-tooltip');
        element.setAttribute('data-tooltip', t(key));
    });
    
    // Traduire les placeholders spécifiques
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Traduire les attributs alt des images
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        element.alt = t(key);
    });
    
    console.log(`🌍 Page traduite en ${currentLang === 'fr' ? 'Français' : 'English'}`);
}

function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    currentLang = lang;
    window.currentLang = lang; // Mettre à jour la variable globale
    localStorage.setItem('language', lang);
    
    // Mettre à jour le body class
    document.body.classList.remove('lang-fr', 'lang-en');
    document.body.classList.add(`lang-${lang}`);
    
    // Traduire la page
    translatePage();
    
    console.log(`🔄 Langue changée : ${lang}`);
}

// Rendre accessible globalement
window.switchLanguage = switchLanguage;

// Initialiser la langue au chargement
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add(`lang-${currentLang}`);
    translatePage();
});