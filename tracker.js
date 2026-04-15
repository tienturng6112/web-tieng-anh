/**
 * Tracker JS - Quản lý giao diện tiến độ học tập
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Chờ database khởi tạo
    if (!window.AppDatabase) {
        console.error("AppDatabase not found!");
        return;
    }

    const currentPath = window.location.pathname;
    const courseId = currentPath.split('/').pop().replace('.html', '');

    // 2. Lấy toàn bộ tiến độ đã lưu
    const progressList = await AppDatabase.getProgress('subset');
    const masteredIds = new Set(progressList.filter(p => p.mastered).map(p => p.id));

    // 3. Quét tất cả các card bộ từ (subset)
    const subsetCards = document.querySelectorAll('.subset-card');
    
    subsetCards.forEach((card, index) => {
        const subsetName = card.querySelector('h4').textContent.trim();
        const subsetId = `${courseId}_set_${index + 1}`;
        const storageId = `subset_${subsetId}`;

        // Kiểm tra xem đã mastered chưa
        if (masteredIds.has(storageId)) {
            card.classList.add('mastered');
        }

        // 4. Thêm nút tích (Mastery Toggle) vào card
            // Tạm thời ẩn dấu tích chưa dùng đến
            /*
            const toggleBtn = document.createElement('button');
            toggleBtn.className = `mastery-toggle ${masteredIds.has(storageId) ? 'active' : ''}`;
            toggleBtn.innerHTML = '<i data-lucide="check"></i>';
            toggleBtn.title = "Đánh dấu đã thuộc";

            // Click listener
            toggleBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isNowMastered = !toggleBtn.classList.contains('active');
                
                // Lưu vào DB
                await AppDatabase.markAsMastered(subsetId, 'subset', isNowMastered);
                
                // Cập nhật UI
                toggleBtn.classList.toggle('active');
                card.classList.toggle('mastered');
                
                if (window.lucide) window.lucide.createIcons();
            });

            // Chèn vào trước nút Play
            cardRight.insertBefore(toggleBtn, cardRight.firstChild);
            */
    });

    // Khởi tạo lại icons cho các nút mới thêm vào
    if (window.lucide) window.lucide.createIcons();
});
