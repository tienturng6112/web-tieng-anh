/**
 * Progress & Vocabulary Database Manager
 * Kết hợp IndexedDB (local) và Firebase (cloud)
 */

const AppDatabase = {
    // Tên database local
    DB_NAME: 'MaDaoTongSuDB',
    DB_VERSION: 1,

    // Khởi tạo IndexedDB để dùng offline và hiệu năng cao
    async initLocalDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Store cho từ vựng
                if (!db.objectStoreNames.contains('vocabulary')) {
                    db.createObjectStore('vocabulary', { keyPath: 'id' });
                }
                // Store cho tiến độ học tập (checkpoint)
                if (!db.objectStoreNames.contains('progress')) {
                    db.createObjectStore('progress', { keyPath: 'id' });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Đánh dấu từ vựng/bộ từ đã thuộc
     * @param {string} itemId - ID của từ hoặc bộ từ
     * @param {string} type - 'word' hoặc 'subset'
     * @param {boolean} isMastered - Trạng thái đã thuộc hay chưa
     */
    async markAsMastered(itemId, type, isMastered) {
        const data = {
            id: `${type}_${itemId}`,
            type,
            mastered: isMastered,
            updatedAt: Date.now()
        };

        // 1. Lưu local (IndexedDB)
        const dbLocal = await this.initLocalDB();
        const tx = dbLocal.transaction('progress', 'readwrite');
        tx.objectStore('progress').put(data);

        // 2. Lưu Cloud (Firebase) - Nếu đã đăng nhập/có db
        if (window.db) {
            try {
                await window.db.collection("user_progress").doc(data.id).set(data);
            } catch (e) {
                console.warn("Firestore sync failed, will retry later", e);
            }
        }

        // Dispatch sự kiện để UI cập nhật
        window.dispatchEvent(new CustomEvent('progress-updated', { detail: data }));
        return data;
    },

    /**
     * Lấy danh sách từ đã thuộc
     */
    async getProgress(type) {
        const dbLocal = await this.initLocalDB();
        return new Promise((resolve) => {
            const tx = dbLocal.transaction('progress', 'readonly');
            const store = tx.objectStore('progress');
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result;
                resolve(type ? results.filter(r => r.type === type) : results);
            };
        });
    },

    /**
     * Lưu thông tin từ vựng kèm âm thanh
     */
    async saveWord(wordData) {
        // wordData: { id, word, meaning, audioUrl, status }
        const dbLocal = await this.initLocalDB();
        const tx = dbLocal.transaction('vocabulary', 'readwrite');
        tx.objectStore('vocabulary').put(wordData);

        if (window.db) {
            await window.db.collection("my_vocabulary").doc(wordData.id).set(wordData);
        }
    }
};

// Xuất ra global để các file khác dùng được
window.AppDatabase = AppDatabase;
