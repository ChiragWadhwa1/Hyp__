// Init Lucide
if(typeof lucide !== 'undefined') lucide.createIcons();

// Utilities
window.triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([15, 30, 15]);
    }
};

window.triggerNavHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(15);
    }
};

// Observers
window.fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            window.fadeInObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

// View Management
window.showWorkView = () => {
    document.getElementById('scroll-container').classList.add('hidden');
    document.getElementById('scroll-container').classList.remove('block');
    document.getElementById('shorts-view').classList.add('hidden');
    document.getElementById('shorts-view').classList.remove('block');

    document.getElementById('work-view').classList.remove('hidden');
    document.getElementById('work-view').classList.add('block');

    window.scrollTo(0, 0);
    document.querySelectorAll('#work-view .section-fade-in').forEach(section => {
        section.classList.remove('visible');
        window.fadeInObserver.observe(section);
    });
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
};

window.showShortsView = () => {
    document.getElementById('scroll-container').classList.add('hidden');
    document.getElementById('scroll-container').classList.remove('block');
    document.getElementById('work-view').classList.add('hidden');
    document.getElementById('work-view').classList.remove('block');

    document.getElementById('shorts-view').classList.remove('hidden');
    document.getElementById('shorts-view').classList.add('block');

    window.scrollTo(0, 0);
    document.querySelectorAll('#shorts-view .section-fade-in').forEach(section => {
        section.classList.remove('visible');
        window.fadeInObserver.observe(section);
    });
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
};

window.showHomeView = () => {
    document.getElementById('work-view').classList.add('hidden');
    document.getElementById('work-view').classList.remove('block');
    document.getElementById('shorts-view').classList.add('hidden');
    document.getElementById('shorts-view').classList.remove('block');

    document.getElementById('scroll-container').classList.remove('hidden');
    document.getElementById('scroll-container').classList.add('block');

    window.scrollTo(0, 0);
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
};

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Setup Mobile Nav
    const navLinks = document.querySelectorAll('#mobile-bottom-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.triggerNavHaptic();
            const targetId = link.getAttribute('href');
            gsap.to(window, {
                duration: 0.25,
                scrollTo: { y: targetId, offsetY: 0 },
                ease: "power2.out"
            });
        });
    });

    // Mobile Nav highlighting
    const sections = ['#scroll-container', '#problem', '#solution', '#services', '#testimonials', '#roi-engine', '#contact'];
    window.addEventListener('scroll', () => {
        if (window.innerWidth >= 768) return;
        let current = '#scroll-container';
        sections.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                if (el.getBoundingClientRect().top <= window.innerHeight / 2.5) {
                    current = selector;
                }
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) current = '#contact';

        navLinks.forEach(link => {
            const targetHref = link.getAttribute('href');
            const icon = link.querySelector('i');
            let isMatch = false;
            if(targetHref === '#scroll-container' && current === '#scroll-container') isMatch = true;
            if(targetHref === '#solution' && (current === '#problem' || current === '#solution')) isMatch = true;
            if(targetHref === '#services' && current === '#services') isMatch = true;
            if(targetHref === '#testimonials' && (current === '#testimonials' || current === '#roi-engine')) isMatch = true;
            if(targetHref === '#contact' && current === '#contact') isMatch = true;

            if (isMatch) {
                link.classList.remove('text-neutral-400', 'opacity-70');
                link.classList.add('text-cyan-400', 'scale-110');
                if(icon) {
                    icon.classList.remove('ph-light');
                    icon.classList.add('ph-fill', 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]');
                }
            } else {
                link.classList.remove('text-cyan-400', 'scale-110');
                link.classList.add('text-neutral-400', 'opacity-70');
                if(icon) {
                    icon.classList.remove('ph-fill', 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]');
                    icon.classList.add('ph-light');
                }
            }
        });
    });

    // 3D Globes Setup
    const initGlobe = (canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const radius = 11;
        const material = new THREE.LineBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.12
        });

        const lonCount = 16;
        for (let i = 0; i < lonCount; i++) {
            const theta = (i / lonCount) * Math.PI;
            const points = [];
            for (let j = 0; j <= 64; j++) {
                const phi = (j / 64) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    radius * Math.cos(theta) * Math.sin(phi),
                    radius * Math.cos(phi),
                    radius * Math.sin(theta) * Math.sin(phi)
                ));
            }
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            globeGroup.add(new THREE.Line(geom, material));
        }

        const latCount = 6;
        for (let i = 1; i < latCount; i++) {
            const phi = (i / latCount) * Math.PI;
            const points = [];
            const r = radius * Math.sin(phi);
            const y = radius * Math.cos(phi);
            for (let j = 0; j <= 64; j++) {
                const theta = (j / 64) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    r * Math.cos(theta),
                    y,
                    r * Math.sin(theta)
                ));
            }
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            globeGroup.add(new THREE.Line(geom, material));
        }

        const updateGlobe = () => {
            if (window.innerWidth < 768) {
                camera.position.z = 22;
                globeGroup.position.y = -3;
            } else {
                camera.position.z = 18;
                globeGroup.position.y = 0;
            }
        };
        updateGlobe();

        const animate = () => {
            requestAnimationFrame(animate);
            globeGroup.rotation.y += 0.002;
            globeGroup.rotation.x += 0.001;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateGlobe();
        });
    };

    // Initialize both globes
    initGlobe('hero-globe-canvas');
    initGlobe('shorts-globe-canvas');

    // Date setup
    const year = new Date().getFullYear();
    if(document.getElementById('year')) document.getElementById('year').textContent = year;
    if(document.getElementById('year-work')) document.getElementById('year-work').textContent = year;
    if(document.getElementById('year-shorts')) document.getElementById('year-shorts').textContent = year;

    // Modals Logic
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if(modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloses = document.querySelectorAll('.modal-close');

    const closeModal = (modal) => {
         modal.classList.remove('active');
         document.body.style.overflow = '';
    };

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal(closeBtn.closest('.modal-overlay'));
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Header Scrolling
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(header) {
            header.classList.toggle('header-scrolled', window.scrollY > 50);
        }
    });

    // Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('-translate-x-full');
            document.body.classList.toggle('overflow-hidden');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Magnetic Buttons
    document.querySelectorAll('.magnetic-button').forEach(button => {
        button.addEventListener('mousemove', e => {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;
            const x = (offsetX / clientWidth - 0.5) * 40;
            const y = (offsetY / clientHeight - 0.5) * 40;
            gsap.to(button, { x: x, y: y, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });

    document.querySelectorAll('.section-fade-in').forEach(section => {
        window.fadeInObserver.observe(section);
    });

    // Forms Logic
    const setupForm = (formId, resultId, isShorts = false) => {
        const form = document.getElementById(formId);
        if(!form) return;

        const result = document.getElementById(resultId);

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            triggerHaptic();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending... <i class="ph-bold ph-circle-notch animate-spin text-xl"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);

            if (isShorts) {
                // Web3Forms Multipart for Shorts
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(async (response) => {
                    if (response.status == 200) {
                        form.classList.add('hidden');
                        result.classList.remove('hidden');
                    } else {
                        // Replaced alert() with DOM manipulation
                        const errMsg = document.createElement('div');
                        errMsg.className = "mt-4 text-sm font-medium text-red-400 bg-red-900/20 p-2 rounded";
                        errMsg.innerText = "Something went wrong! Please try again.";
                        form.appendChild(errMsg);
                        setTimeout(() => errMsg.remove(), 4000);
                    }
                })
                .catch(error => {
                    const errMsg = document.createElement('div');
                    errMsg.className = "mt-4 text-sm font-medium text-red-400 bg-red-900/20 p-2 rounded";
                    errMsg.innerText = "Something went wrong! Please check your connection.";
                    form.appendChild(errMsg);
                    setTimeout(() => errMsg.remove(), 4000);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                    form.reset();
                });
            } else {
                // JSON submission for main form
                const object = {};
                formData.forEach((value, key) => { object[key] = value; });
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: json
                    })
                    .then(async (response) => {
                        let jsonResponse = await response.json();
                        if (response.status == 200) {
                            result.innerHTML = jsonResponse.message || "Form submitted successfully! We'll be in touch.";
                            result.className = "mt-4 text-sm font-medium text-cyan-400";
                        } else {
                            result.innerHTML = jsonResponse.message || "Something went wrong!";
                            result.className = "mt-4 text-sm font-medium text-red-400";
                        }
                    })
                    .catch(error => {
                        result.innerHTML = "Something went wrong! Please try again later.";
                        result.className = "mt-4 text-sm font-medium text-red-400";
                    })
                    .finally(() => {
                        submitBtn.innerHTML = originalBtnHtml;
                        submitBtn.disabled = false;
                        form.reset();
                        setTimeout(() => { result.innerHTML = ""; }, 5000);
                    });
            }
        });
    };

    setupForm('contact-form', 'form-result', false);
    setupForm('shorts-contact-form', 'shorts-success-message', true);

    // Video Player Logic
    const isMobile = window.innerWidth < 768;
    const videoContainers = document.querySelectorAll('.video-container');

    if (isMobile) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                const overlay = entry.target.querySelector('.play-overlay');
                if (entry.isIntersecting && video) {
                    video.play().catch(e => console.log("Autoplay blocked:", e));
                    if(overlay) overlay.style.opacity = '0';
                } else if (video) {
                    video.pause();
                    if(overlay) overlay.style.opacity = '1';
                }
            });
        }, observerOptions);
        videoContainers.forEach(container => videoObserver.observe(container));
    }

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const overlay = container.querySelector('.play-overlay');
        if(!video) return;

        container.addEventListener('click', () => {
            triggerHaptic();
            if (video.paused) {
                document.querySelectorAll('.video-container video').forEach(v => {
                    if(v !== video && v) {
                        v.pause();
                        const otherOverlay = v.closest('.video-container').querySelector('.play-overlay');
                        if(otherOverlay) otherOverlay.style.opacity = '1';
                    }
                });
                video.play();
                if(overlay) overlay.style.opacity = '0';
            } else {
                video.pause();
                if(overlay) overlay.style.opacity = '1';
            }
        });
    });
});
