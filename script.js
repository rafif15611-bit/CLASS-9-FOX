document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       1. GENERATE GALLERY ITEMS
    ========================= */
    const galleryGrid = document.getElementById("galleryGrid");
    const totalPhotos = 17;

    if (galleryGrid) {
        for (let i = 1; i <= totalPhotos; i++) {
            const indexFormatted = i < 10 ? `0${i}` : `${i}`;
            const button = document.createElement("button");
            
            // Tambahkan class 'photo-wide' khusus untuk foto nomor 17
            if (i === 17) {
                button.className = "photo-item photo-wide";
            } else {
                button.className = "photo-item";
            }

            button.setAttribute("data-index", i - 1);
            button.setAttribute("aria-label", `Lihat Satwa Momen ${i}`);
            
            button.innerHTML = `
                <img src="photo/${i}.jpg" alt="Satwa Momen ${i}" loading="lazy">
                <span class="photo-tag">${indexFormatted} • SAFARI</span>
            `;
            
            galleryGrid.appendChild(button);
        }
    }

    /* =========================
       2. COLLAPSIBLE HEADER EFFECT
    ========================= */
    const header = document.getElementById("header");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* =========================
       3. FITUR MODE HITAM PUTIH (GRAYSCALE)
    ========================= */
    const grayscaleBtn = document.getElementById("grayscaleBtn");
    
    const savedGrayscale = localStorage.getItem("zoo_grayscale_mode");
    if (savedGrayscale === "enabled") {
        document.body.classList.add("grayscale-mode");
    }

    if (grayscaleBtn) {
        grayscaleBtn.addEventListener("click", () => {
            document.body.classList.toggle("grayscale-mode");
            
            if (document.body.classList.contains("grayscale-mode")) {
                localStorage.setItem("zoo_grayscale_mode", "enabled");
            } else {
                localStorage.setItem("zoo_grayscale_mode", "disabled");
            }
        });
    }

    /* =========================
       4. LOGIKA KATA-KATA CUSTOM
    ========================= */
    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.getElementById("quoteAuthor");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const quoteForm = document.getElementById("quoteForm");
    const saveQuoteBtn = document.getElementById("saveQuoteBtn");
    const cancelQuoteBtn = document.getElementById("cancelQuoteBtn");
    const inputAuthor = document.getElementById("inputAuthor");
    const inputText = document.getElementById("inputText");
    const quoteContent = document.getElementById("quoteContent");

    function loadSavedQuote() {
        const savedQuote = JSON.parse(localStorage.getItem("zoo_custom_message"));
        
        if (savedQuote && savedQuote.text) {
            quoteText.textContent = `"${savedQuote.text}"`;
            quoteText.classList.remove("empty-text");
            quoteAuthor.textContent = `— ${savedQuote.author || "Anonim"}`;
        } else {
            quoteText.textContent = 'Belum ada pesan. Klik "Tulis Pesan" untuk menambahkan kata-kata dari kamu atau temanmu!';
            quoteText.classList.add("empty-text");
            quoteAuthor.textContent = "";
        }
    }

    loadSavedQuote();

    if (addQuoteBtn && quoteForm) {
        addQuoteBtn.addEventListener("click", () => {
            quoteForm.classList.toggle("hidden");
        });
    }

    if (cancelQuoteBtn && quoteForm) {
        cancelQuoteBtn.addEventListener("click", () => {
            quoteForm.classList.add("hidden");
        });
    }

    if (saveQuoteBtn) {
        saveQuoteBtn.addEventListener("click", () => {
            const textValue = inputText.value.trim();
            const authorValue = inputAuthor.value.trim() || "Teman Rahasia";

            if (!textValue) {
                alert("Tuliskan pesan atau kata-katanya terlebih dahulu ya!");
                return;
            }

            const newQuote = { text: textValue, author: authorValue };
            localStorage.setItem("zoo_custom_message", JSON.stringify(newQuote));

            if (quoteContent) {
                quoteContent.classList.add("fade-out");
                setTimeout(() => {
                    loadSavedQuote();
                    quoteContent.classList.remove("fade-out");
                }, 300);
            } else {
                loadSavedQuote();
            }

            inputText.value = "";
            inputAuthor.value = "";
            quoteForm.classList.add("hidden");
        });
    }

    /* =========================
       5. LIGHTBOX LOGIC
    ========================= */
    const photos = document.querySelectorAll(".photo-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const counter = document.getElementById("counter");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const closeBtn = document.getElementById("closeBtn");
    
    let currentIndex = 0;

    function updateLightbox() {
        lightboxImg.src = `photo/${currentIndex + 1}.jpg`;
        counter.textContent = `${currentIndex + 1} / ${totalPhotos}`;
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    }

    function nextPhoto() {
        currentIndex = (currentIndex + 1) % totalPhotos;
        updateLightbox();
    }

    function prevPhoto() {
        currentIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
        updateLightbox();
    }

    photos.forEach((photo) => {
        photo.addEventListener("click", () => {
            const index = parseInt(photo.getAttribute("data-index"), 10);
            openLightbox(index);
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", nextPhoto);
    if (prevBtn) prevBtn.addEventListener("click", prevPhoto);

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("show")) return;
        
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
    });

    /* =========================
       6. ACTIVE NAVIGATION ON SCROLL
    ========================= */
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        let currentSection = "home";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("data-target") === currentSection) {
                item.classList.add("active");
            }
        });
    });

    /* =========================================================
       7. ANIMASI 3D BACKGROUND (THREE.JS PARTICLES & SHAPES)
    ========================================================= */
    function init3DBackground() {
        const canvas = document.getElementById('bg3dCanvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.BufferGeometry();
        const particlesCount = 120;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.04,
            color: 0x4ade80,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        const shapeGeo = new THREE.IcosahedronGeometry(1.2, 0);
        const shapeMat = new THREE.MeshBasicMaterial({
            color: 0x4ade80,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const shapeMesh = new THREE.Mesh(shapeGeo, shapeMat);
        shapeMesh.position.set(2, 1, -2);
        scene.add(shapeMesh);

        camera.position.z = 5;

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });

        function animate() {
            requestAnimationFrame(animate);

            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;

            shapeMesh.rotation.x += 0.003;
            shapeMesh.rotation.y += 0.005;

            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /* =========================================================
       8. EFEK 3D TILT CARD
    ========================================================= */
    function init3DTiltCards() {
        const cards = document.querySelectorAll('.oneui-card, .photo-item, .stat-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.style.transition = 'transform 0.15s ease-out';

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            });
        });
    }

    /* =========================================================
       9. FITUR GALLERY UNIVERSE (FOTO BUBAR & MENGORBIT 3D)
    ========================================================= */
    function initUniverseGallery() {
        const galleryHeader = document.querySelector(".section-header");
        if (!galleryHeader) return;

        // 1. Buat Tombol "Mode Universe" di Header Galeri
        const universeBtn = document.createElement("button");
        universeBtn.className = "universe-toggle-btn";
        universeBtn.innerHTML = "🌌 Mode Universe";
        galleryHeader.appendChild(universeBtn);

        // 2. Buat Canvas & Tombol Keluar
        const universeCanvas = document.createElement("canvas");
        universeCanvas.id = "universeCanvas";
        document.body.appendChild(universeCanvas);

        const exitBtn = document.createElement("button");
        exitBtn.className = "exit-universe-btn";
        exitBtn.innerHTML = "❌ Keluar Mode Universe";
        document.body.appendChild(exitBtn);

        // Variabel Three.js
        let scene, camera, renderer, photoMeshes = [];
        let animationFrameId;

        function startUniverse() {
            universeCanvas.classList.add("show");
            exitBtn.classList.add("show");
            document.body.style.overflow = "hidden";

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 12;

            renderer = new THREE.WebGLRenderer({ canvas: universeCanvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const textureLoader = new THREE.TextureLoader();
            photoMeshes = [];

            // Setiap Foto Menjadi Objek 3D Mengorbit
            for (let i = 1; i <= totalPhotos; i++) {
                const texture = textureLoader.load(`photo/${i}.jpg`);
                const geometry = new THREE.PlaneGeometry(1.8, 1.2);
                const material = new THREE.MeshBasicMaterial({ 
                    map: texture, 
                    side: THREE.DoubleSide 
                });
                const mesh = new THREE.Mesh(geometry, material);

                const radius = 4 + Math.random() * 6;
                const angle = (i / totalPhotos) * Math.PI * 2;
                const height = (Math.random() - 0.5) * 6;

                mesh.userData = {
                    radius: radius,
                    angle: angle,
                    speed: 0.005 + Math.random() * 0.008,
                    height: height
                };

                mesh.position.x = Math.cos(angle) * radius;
                mesh.position.z = Math.sin(angle) * radius;
                mesh.position.y = height;

                scene.add(mesh);
                photoMeshes.push(mesh);
            }

            function animateUniverse() {
                animationFrameId = requestAnimationFrame(animateUniverse);

                photoMeshes.forEach(mesh => {
                    mesh.userData.angle += mesh.userData.speed;
                    mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
                    mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
                    mesh.position.y = mesh.userData.height + Math.sin(mesh.userData.angle * 2) * 0.5;
                    mesh.lookAt(camera.position);
                });

                renderer.render(scene, camera);
            }

            animateUniverse();
        }

        function stopUniverse() {
            universeCanvas.classList.remove("show");
            exitBtn.classList.remove("show");
            document.body.style.overflow = "auto";
            
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }

        universeBtn.addEventListener("click", startUniverse);
        exitBtn.addEventListener("click", stopUniverse);

        window.addEventListener("resize", () => {
            if (universeCanvas.classList.contains("show")) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    // Jalankan semua fungsi
    init3DBackground();
    init3DTiltCards();
    initUniverseGallery();
});