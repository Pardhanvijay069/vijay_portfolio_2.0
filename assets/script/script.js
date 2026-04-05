document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = document.querySelectorAll(".nav-links a");
    const header = document.getElementById("header");

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle("is-open");
        menuToggle.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", toggleMenu);

        navAnchors.forEach((anchor) => {
            anchor.addEventListener("click", () => {
                if (navLinks.classList.contains("is-open")) {
                    toggleMenu();
                }
            });
        });
    }

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 24);
    });

    // Three.js particle field for the hero section.
    const initHeroParticles = () => {
        const canvas = document.getElementById("hero-canvas");
        if (!canvas || typeof THREE === "undefined") {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const particleCount = 1800;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i += 1) {
            const index = i * 3;
            positions[index] = (Math.random() - 0.5) * 12;
            positions[index + 1] = (Math.random() - 0.5) * 8;
            positions[index + 2] = (Math.random() - 0.5) * 8;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x6cb6ff,
            size: 0.03,
            transparent: true,
            opacity: 0.82,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        camera.position.z = 5;

        const pointer = { x: 0, y: 0 };

        window.addEventListener("pointermove", (event) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        const render = () => {
            const elapsed = clock.getElapsedTime();

            particles.rotation.y = elapsed * 0.04 + pointer.x * 0.16;
            particles.rotation.x = elapsed * 0.02 + pointer.y * 0.12;
            particles.position.y = Math.sin(elapsed * 0.8) * 0.12;

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };

        render();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    };

    initHeroParticles();

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".hero-reveal", {
            y: 34,
            opacity: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.15
        });

        gsap.utils.toArray(".section-heading").forEach((heading) => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray(".reveal-text").forEach((element) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 78%"
                },
                y: 36,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        gsap.utils.toArray(".info-card, .skill-group, .achievement-item, .project-card, .contact-layout").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 86%"
                },
                y: 42,
                opacity: 0,
                duration: 0.85,
                delay: Math.min(index * 0.04, 0.18),
                ease: "power3.out"
            });
        });
    }

    // Anime.js drives the skill-bar progress reveal when the section enters view.
    if (typeof anime !== "undefined" && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
            trigger: "#skills",
            start: "top 65%",
            once: true,
            onEnter: () => {
                anime({
                    targets: ".skill-fill",
                    width: (element) => `${element.dataset.level}%`,
                    duration: 1400,
                    delay: anime.stagger(70),
                    easing: "easeOutExpo"
                });

                anime({
                    targets: ".skill-group",
                    translateY: [18, 0],
                    opacity: [0.7, 1],
                    duration: 900,
                    delay: anime.stagger(90),
                    easing: "easeOutQuad"
                });
            }
        });
    }

    // Micro-interactions for project cards.
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            if (typeof anime === "undefined") {
                return;
            }

            anime.remove(card);
            anime({
                targets: card,
                scale: 1.01,
                duration: 260,
                easing: "easeOutQuad"
            });
        });

        card.addEventListener("mouseleave", () => {
            if (typeof anime === "undefined") {
                return;
            }

            anime.remove(card);
            anime({
                targets: card,
                scale: 1,
                duration: 260,
                easing: "easeOutQuad"
            });
        });
    });
});
