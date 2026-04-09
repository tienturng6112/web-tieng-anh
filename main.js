document.addEventListener('DOMContentLoaded', () => {
    // Nav menu items active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Category pills active state
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Toggle Vocab Management Page
    const btnAddWord = document.getElementById('btn-add-word');
    const navVocab = document.getElementById('nav-vocab');
    const navHome = document.getElementById('nav-home');
    const vocabPage = document.getElementById('vocab-page');
    const btnCloseVocab = document.getElementById('btn-close-vocab');

    const openVocabPage = (e) => {
        if (e) e.preventDefault();
        vocabPage.classList.remove('hidden');

        // Update sidebar active state
        if (navVocab) {
            navItems.forEach(i => i.classList.remove('active'));
            navVocab.classList.add('active');
        }
    };

    const closeVocabPage = (e) => {
        if (e) e.preventDefault();
        vocabPage.classList.add('hidden');

        // Update sidebar active state back to home
        if (navHome) {
            navItems.forEach(i => i.classList.remove('active'));
            navHome.classList.add('active');
        }
    };

    if (btnAddWord && vocabPage && btnCloseVocab) {
        btnAddWord.addEventListener('click', openVocabPage);
        if (navVocab) navVocab.addEventListener('click', openVocabPage);
        if (navHome) navHome.addEventListener('click', closeVocabPage);

        btnCloseVocab.addEventListener('click', closeVocabPage);
    }

    // Toggle AI Modal
    const btnOpenAI = document.getElementById('btn-open-ai');
    const aiModal = document.getElementById('ai-modal');
    const btnCloseAI = document.getElementById('btn-close-ai');
    const btnCancelAI = document.getElementById('btn-cancel-ai');

    if (btnOpenAI && aiModal) {
        btnOpenAI.addEventListener('click', () => aiModal.classList.remove('hidden'));

        const closeAIModal = () => aiModal.classList.add('hidden');
        if (btnCloseAI) btnCloseAI.addEventListener('click', closeAIModal);
        if (btnCancelAI) btnCancelAI.addEventListener('click', closeAIModal);

        // Close on overlay click
        aiModal.addEventListener('click', (e) => {
            if (e.target === aiModal) closeAIModal();
        });
    }

    // Toggle Multi Modal
    const btnOpenMulti = document.getElementById('btn-open-multi');
    const multiModal = document.getElementById('multi-modal');
    const btnCloseMulti = document.getElementById('btn-close-multi');
    const btnCancelMulti = document.getElementById('btn-cancel-multi');

    if (btnOpenMulti && multiModal) {
        btnOpenMulti.addEventListener('click', () => multiModal.classList.remove('hidden'));

        const closeMultiModal = () => multiModal.classList.add('hidden');
        if (btnCloseMulti) btnCloseMulti.addEventListener('click', closeMultiModal);
        if (btnCancelMulti) btnCancelMulti.addEventListener('click', closeMultiModal);

        // Close on overlay click
        multiModal.addEventListener('click', (e) => {
            if (e.target === multiModal) closeMultiModal();
        });
    }

    // Simple scroll animation for course cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.course-card, .quick-card').forEach(card => {
        observer.observe(card);
    });

    // ===== THEME TOGGLE (Dark / Light) =====
    const modeToggle = document.querySelector('.mode');
    const modeLabel = modeToggle ? modeToggle.querySelector('span') : null;

    // Ham thay doi icon: xoa svg/i hien tai, tao <i> moi roi goi lucide.createIcons()
    function setModeIcon(iconName) {
        if (!modeToggle) return;
        // Lucide doi <i> thanh <svg>, nen can tim ca 2
        const existingIcon = modeToggle.querySelector('svg, i[data-lucide]');
        const newI = document.createElement('i');
        newI.setAttribute('data-lucide', iconName);
        if (existingIcon) {
            existingIcon.replaceWith(newI);
        } else {
            modeToggle.insertBefore(newI, modeLabel);
        }
        if (window.lucide) window.lucide.createIcons();
    }

    // Ap dung theme khi tai trang tu localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        setModeIcon('moon');
        if (modeLabel) modeLabel.innerText = 'Toi';
        if (modeToggle) modeToggle.classList.add('is-light');
    }
    // Dam bao dark mode dung icon sun
    else {
        setModeIcon('sun');
        if (modeLabel) modeLabel.innerText = 'Sang';
    }

    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            const isCurrentlyLight = document.body.classList.contains('light-mode');
            if (isCurrentlyLight) {
                // Chuyen sang DARK
                document.body.classList.remove('light-mode');
                setModeIcon('sun');
                if (modeLabel) modeLabel.innerText = 'Sang';
                modeToggle.classList.remove('is-light');
                localStorage.setItem('theme', 'dark');
            } else {
                // Chuyen sang LIGHT
                document.body.classList.add('light-mode');
                setModeIcon('moon');
                if (modeLabel) modeLabel.innerText = 'Toi';
                modeToggle.classList.add('is-light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Collapse sidebar interaction (Mock)
    const collapseBtn = document.querySelector('.collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                sidebar.style.width = '80px';
                mainContent.style.marginLeft = '80px';
                document.querySelectorAll('.nav-item span, .logo-text, .user-info, .theme-toggle span').forEach(el => el.style.display = 'none');
            } else {
                sidebar.style.width = '240px';
                mainContent.style.marginLeft = '240px';
                document.querySelectorAll('.nav-item span, .logo-text, .user-info, .theme-toggle span').forEach(el => el.style.display = 'block');
            }
        });
    }

    // ===== Firebase setup cho Video/HÃ¬nh áº£nh Upload =====
    // BÆ¯á»šC QUAN TRá»ŒNG: ÄÃ£ thÃªm Firebase Config thÃ nh cÃ´ng!
    const firebaseConfig = {
        apiKey: "AIzaSyDnjTJDsdMODW7CDFs7ZxkcCOHY4FyrpHc",
        authDomain: "web-tieng-anh-d0e2d.firebaseapp.com",
        projectId: "web-tieng-anh-d0e2d",
        storageBucket: "web-tieng-anh-d0e2d.firebasestorage.app",
        messagingSenderId: "238664095418",
        appId: "1:238664095418:web:3eb36b21f6dfc49f801483",
        measurementId: "G-CN8C97CGJD"
    };

    let storage = null;
    let db = null;

    // Khá»Ÿi táº¡o Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }

    // ===== Cáº¥u hÃ¬nh Cloudinary (Äá»ƒ upload file miá»…n phÃ­) =====
    const CLOUDINARY_CLOUD_NAME = "dzutobhcm";
    const CLOUDINARY_UPLOAD_PRESET = "web tiáº¿ng anh";

    const heroMediaUpload = document.getElementById('hero-media-upload');
    const heroMediaContainer = document.getElementById('hero-media-container');
    const muteToggleBtn = document.getElementById('mute-toggle-btn');
    const heroOverlay = document.querySelector('.hero-overlay');
    
    // HÃ m hiá»ƒn thá»‹ hÃ¬nh áº£nh / video
    function displayMedia(source, isFile = false) {
        let srcURL = isFile ? URL.createObjectURL(source) : source;
        heroMediaContainer.innerHTML = '';
        
        // Kiá»ƒm tra loáº¡i video: náº¿u lÃ  file thÃ¬ check type, náº¿u lÃ  link Cloudinary thÃ¬ check Ä‘uÃ´i file
        const isVideo = isFile ? source.type.startsWith('video/') : (srcURL.match(/\.(mp4|webm|mov|ogg|m4v)/i) || srcURL.includes('/video/upload/'));

        if (isVideo) {
            const video = document.createElement('video');
            video.src = srcURL;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.id = 'hero-video-element';
            heroMediaContainer.appendChild(video);

            if (muteToggleBtn) {
                muteToggleBtn.classList.remove('hidden');
                muteToggleBtn.innerHTML = '<i data-lucide="volume-x"></i>';
                if (window.lucide) window.lucide.createIcons();
            }
        } else {
            const img = document.createElement('img');
            img.src = srcURL;
            heroMediaContainer.appendChild(img);
            if (muteToggleBtn) muteToggleBtn.classList.add('hidden');
        }
    }

    if (muteToggleBtn) {
        muteToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const videoEl = document.getElementById('hero-video-element');
            if (videoEl) {
                videoEl.muted = !videoEl.muted;
                muteToggleBtn.innerHTML = videoEl.muted 
                    ? '<i data-lucide="volume-x"></i>' 
                    : '<i data-lucide="volume-2"></i>';
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // Táº£i media Ä‘Ã£ lÆ°u tá»« Firebase Firestore khi vá»«a vÃ o web
    async function loadSavedMedia() {
        if (!db) return;
        try {
            const docRef = db.collection("settings").doc("heroSection");
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                if (data.mediaUrl) {
                    displayMedia(data.mediaUrl, false);
                }
            }
        } catch (error) {
            console.error("Lá»—i khi táº£i dá»¯ liá»‡u tá»« Firebase:", error);
        }
    }

    if (heroMediaUpload && heroMediaContainer) {
        // Gá»i hÃ m táº£i dá»¯ liá»‡u khi trang vá»«a má»Ÿ
        if (db) loadSavedMedia();

        heroMediaUpload.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // 1. Hiá»ƒn thá»‹ táº¡m ngay láº­p tá»©c
            displayMedia(file, true);

            try {
                // Äá»•i hiá»ƒn thá»‹ overlay thÃ nh Äang táº£i lÃªn...
                const oldOverlayHTML = heroOverlay.innerHTML;
                heroOverlay.innerHTML = '<i data-lucide="loader-2"></i><span>Äang táº£i lÃªn Cloud...</span>';
                if (window.lucide) window.lucide.createIcons();

                // 2. Upload file lÃªn Cloudinary thÃ´ng qua API (KhÃ´ng cáº§n thÆ° viá»‡n cáº§u ká»³)
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                
                if (data.secure_url) {
                    const downloadURL = data.secure_url;
                    
                    // 3. LÆ°u link URL vÃ o Firebase Firestore (Database)
                    if (db) {
                        await db.collection("settings").doc("heroSection").set({
                            mediaUrl: downloadURL,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }

                    console.log("Upload thÃ nh cÃ´ng vÄ©nh viá»…n:", downloadURL);
                } else {
                    throw new Error(data.error ? data.error.message : "Upload tháº¥t báº¡i");
                }

                // KhÃ´i phá»¥c láº¡i giao diá»‡n nÃºt
                heroOverlay.innerHTML = oldOverlayHTML;
                if (window.lucide) window.lucide.createIcons();
                
            } catch (error) {
                console.error("Lá»—i upload:", error);
                alert("Lá»—i khi táº£i file: " + error.message);
                heroOverlay.innerHTML = '<i data-lucide="camera"></i><span>Thay Ä‘á»•i áº¢nh / Video</span>';
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }
});



