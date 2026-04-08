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

    // Theme toggle mock interaction
    const modeToggle = document.querySelector('.mode');
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            const isLight = document.body.style.backgroundColor === 'white';
            if (isLight) {
                document.body.style.backgroundColor = '';
                document.body.style.color = '';
                modeToggle.querySelector('span').innerText = 'Sáng';
            } else {
                document.body.style.backgroundColor = 'white';
                document.body.style.color = 'black';
                modeToggle.querySelector('span').innerText = 'Tối';
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

    // ===== IndexedDB setup for storing media =====
    const DB_NAME = 'LuyenTuDB';
    const STORE_NAME = 'heroMedia';

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    async function saveMedia(file) {
        try {
            const db = await initDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(file, 'savedMedia');
        } catch (e) {
            console.error('Không thể lưu ảnh/video:', e);
        }
    }

    async function loadMedia() {
        try {
            const db = await initDB();
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).get('savedMedia');
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error('Không thể tải ảnh/video:', e);
            return null;
        }
    }

    // ===== Handle hero media file upload =====
    const heroMediaUpload = document.getElementById('hero-media-upload');
    const heroMediaContainer = document.getElementById('hero-media-container');
    const muteToggleBtn = document.getElementById('mute-toggle-btn');

    function displayMedia(file) {
        const fileURL = URL.createObjectURL(file);
        heroMediaContainer.innerHTML = '';
        
        if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = fileURL;
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
            img.src = fileURL;
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

    if (heroMediaUpload && heroMediaContainer) {
        // Khôi phục hình/video cũ khi mở lại trang
        loadMedia().then(file => {
            if (file) {
                displayMedia(file);
            }
        });

        // Xử lý sự kiện khi có file mới
        heroMediaUpload.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                displayMedia(file);     // Hiển thị ngay
                await saveMedia(file);  // Lưu vào trình duyệt
            }
        });
    }
});
