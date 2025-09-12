document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Three.js Hero Animation ---
    const initHeroAnimation = () => {
        const container = document.getElementById('hero-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        const mouse = new THREE.Vector2();
        
        // --- NIGHT SCENE ---
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const targetPositions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);

        const logoGeometry = new THREE.TorusKnotGeometry(8, 1.5, 100, 16);
        const logoVertices = logoGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 60;
            
            originalPositions[i3] = positions[i3];
            originalPositions[i3 + 1] = positions[i3 + 1];
            originalPositions[i3 + 2] = positions[i3 + 2];

            const vertexIndex = (i % (logoVertices.length / 3)) * 3;
            targetPositions[i3] = logoVertices[vertexIndex];
            targetPositions[i3 + 1] = logoVertices[vertexIndex + 1];
            targetPositions[i3 + 2] = logoVertices[vertexIndex + 2];
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({ color: '#00A3FF', size: 0.15, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });
        const transition = { value: 0 };
        tl.to(transition, { value: 1, duration: 1 });
        tl.to("#hero-content", { opacity: 0, scale: 0.8 }, "<");

        function updateParticles() {
            const currentPositions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                currentPositions[i3] = originalPositions[i3] + (targetPositions[i3] - originalPositions[i3]) * transition.value;
                currentPositions[i3 + 1] = originalPositions[i3+1] + (targetPositions[i3+1] - originalPositions[i3+1]) * transition.value;
                currentPositions[i3 + 2] = originalPositions[i3+2] + (targetPositions[i3+2] - originalPositions[i3+2]) * transition.value;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0005 + (transition.value * 0.001);
        }
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            
            updateParticles();

            camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
            camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        animate();
    };
    initHeroAnimation();

    // --- Modal Logic ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
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


    // --- Other Scripts ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-scrolled', window.scrollY > 50);
    });
    
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('-translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    });
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');
        });
    });

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

    const sections = document.querySelectorAll('.section-fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));

    // --- Form Submission Logic ---
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        const json = JSON.stringify(object);
        
        result.innerHTML = "Submitting...";
        result.className = "mt-4 text-sm text-gray-400";

        fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    result.innerHTML = jsonResponse.message || "Form submitted successfully!";
                    result.className = "mt-4 text-sm text-green-500";
                } else {
                    console.log(response);
                    result.innerHTML = jsonResponse.message || "Something went wrong!";
                    result.className = "mt-4 text-sm text-red-500";
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
                result.className = "mt-4 text-sm text-red-500";
            })
            .then(function() {
                form.reset();
                setTimeout(() => {
                    result.innerHTML = "";
                }, 5000);
            });
    });
});
