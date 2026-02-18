document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // === SABİTLER ve OTURUM YÖNETİMİ YARDIMCI FONKSİYONLARI ===
    // ------------------------------------------------------------------
    const SESSION_KEY = 'currentUserData';
    const REPORTS_STORAGE_KEY = 'ekososyalReports';

    // VERSİYON KONTROLÜ İÇİN YENİ SABİTLER 
    const REPORTS_VERSION_KEY = 'ekososyalReportsVersion';
    const CURRENT_REPORTS_VERSION = 4; 
    // ------------------------------------------------------------------

    // Yeni Bildirim DOM Elementleri
    const customNotification = document.getElementById('custom-notification');
    const notificationText = document.getElementById('notification-text');
    const closeNotificationBtn = document.getElementById('close-notification');
    let notificationTimeout;

    // --- Fonksiyon: Özel Bildirim Gösterme (alert yerine) ---
    function showCustomNotification(message, duration = 4000) {
        if (!customNotification || !notificationText) return;
        if (notificationTimeout) clearTimeout(notificationTimeout);

        customNotification.classList.remove('hidden', 'warning', 'show');
        notificationText.innerHTML = message;

        setTimeout(() => {
            customNotification.classList.add('show');
        }, 10);

        notificationTimeout = setTimeout(hideCustomNotification, duration);
    }

    // --- Fonksiyon: Özel Bildirim Gizleme ---
    function hideCustomNotification() {
        if (!customNotification) return;
        customNotification.classList.remove('show');

        setTimeout(() => {
            customNotification.classList.add('hidden');
        }, 400);
    }

    // Bildirim kapatma butonunu dinleme
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', hideCustomNotification);
    }

    // --- Fonksiyon: Oturum Yükleme ---
    function getCurrentUser() {
        const storedUser = localStorage.getItem(SESSION_KEY);
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                console.error('Kullanıcı oturumu bilgisi bozuk:', e);
                localStorage.removeItem(SESSION_KEY);
                return null;
            }
        }
        return null;
    }

    // --- Fonksiyon: Raporları Depodan Yükle (Versiyon Kontrollü) ---
    function loadReportsFromStorage() {
        const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        const storedVersion = parseInt(localStorage.getItem(REPORTS_VERSION_KEY));

        if (storedVersion !== CURRENT_REPORTS_VERSION || !storedReports) {
            console.log('Rapor versiyonu eşleşmiyor veya veri yok. Yeni demo verileri kullanılacak.');
            localStorage.removeItem(REPORTS_STORAGE_KEY);
            localStorage.removeItem(REPORTS_VERSION_KEY);
            return [];
        }

        try {
            return JSON.parse(storedReports);
        } catch (e) {
            console.error('Rapor verisi yüklenirken hata oluştu:', e);
            localStorage.removeItem(REPORTS_STORAGE_KEY);
            localStorage.removeItem(REPORTS_VERSION_KEY);
            return [];
        }
    }

    // --- Fonksiyon: Raporları Depoya Kaydet (Versiyonu da Kaydet) ---
    function saveReportsToStorage() {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
        localStorage.setItem(REPORTS_VERSION_KEY, CURRENT_REPORTS_VERSION);
    }

    // --- Yardımcı Fonksiyon: Tarih Metnini Zaman Damgasına Çevirme ---
    function parseDateToTimestamp(dateString) {
        const monthMap = {
            'Ocak': 'Jan', 'Şubat': 'Feb', 'Mart': 'Mar', 'Nisan': 'Apr', 'Mayıs': 'May', 'Haziran': 'Jun',
            'Temmuz': 'Jul', 'Ağustos': 'Aug', 'Eylül': 'Sep', 'Ekim': 'Oct', 'Kasım': 'Nov', 'Aralık': 'Dec'
        };
        const parts = dateString.split(' ');
        if (parts.length === 3) {
            const day = parts[0];
            const monthTR = parts[1];
            const year = parts[2];
            const monthEN = monthMap[monthTR] || monthTR;
            const date = new Date(`${year}-${monthEN}-${day}`);
            
            if (!isNaN(date)) return date.getTime();
        }
        
        return Date.now();
    }

    // ------------------------------------------------------------------
    // === BAŞLANGIÇ VERİSİ YÜKLEME  ===
    // ------------------------------------------------------------------
    let currentUser = getCurrentUser(); // Oturumu Kontrol Et

    // Demo verilerini oluştur (Yeni, DÜZELTİLMİŞ RESİM YOLLARI)
    const initialDemoReports = [
        {
            id: 10,
            title: 'Çocuk Parkındaki Kırık Camlar',
            description: "Mahallemizdeki çocuk oyun parkının kaydırağının yanında çok sayıda kırık şişe camı var, acil müdahale gerekiyor.",
            photoUrl: 'gorseller/cam.png', // 🖼️ Düzeltildi: gorseller/cam.png
            user: 'Ayşe Kaya',
            date: '17 Kasım 2025',
            likes: 25,
            isLiked: false,
            comments: [],
            timestamp: parseDateToTimestamp('17 Kasım 2025')
        },
        {
            id: 1,
            title: 'Kaldırıma Bırakılan İnşaat Molozları',
            description: 'Ana caddenin köşesinde, yayaların geçişini engelleyen büyük bir moloz yığını duruyor. Toz yapıyor ve görüntü kirliliği oluşturuyor.',
            photoUrl:'gorseller/cadde.png', // 🖼️ Düzeltildi: gorseller/cadde.png
            user: 'Ahmet Yılmaz',
            date: '15 Kasım 2025',
            likes: 12,
            comments: [{ user: 'Mehmet Demir', text: 'Bu bölge için bir temizlik etkinliği planlıyoruz!' }],
            isLiked: false,
            timestamp: parseDateToTimestamp('15 Kasım 2025')
        },
        {
            id: 2,
            title: 'Sokak Lambasından Akan Kimyasal Atık',
            description: 'Bir süredir sokağımızdaki direğin dibinden garip kokulu, yeşilimsi bir sıvı akıyor. Toprağa karışıyor ve çevreye kötü bir koku yayılıyor.',
            photoUrl: 'gorseller/sokak_lambasi.png', // 🖼️ Düzeltildi: gorseller/sokak_lambasi.png
            user: 'Zeynep Öztürk',
            date: '14 Kasım 2025',
            likes: 5,
            isLiked: false,
            comments: [],
            timestamp: parseDateToTimestamp('14 Kasım 2025')
        },
        {
            id: 3,
            title: 'Evcil Hayvan Dışkıları Temizlenmiyor',
            description: 'Belediye binaları çevresindeki yeşil alanda yoğun miktarda kedi/köpek dışkısı var. Hijyen sorunu yaratıyor.',
            photoUrl: 'gorseller/kopek.png', // 🖼️ Düzeltildi: gorseller/kopek.png
            user: 'Emre Can',
            date: '12 Kasım 2025',
            likes: 20,
            isLiked: false,
            comments: [],
            timestamp: parseDateToTimestamp('12 Kasım 2025')
        },
        {
            id: 4,
            title: 'Aşırı Gürültülü Egzozlu Motosiklet',
            description: 'Akşam 10\'dan sonra mahallede rahatsız edici derecede gürültü yapan modifiyeli bir motor dolaşıyor.',
            photoUrl: 'gorseller/motor.png', // 🖼️ Düzeltildi: gorseller/motor.png
            user: 'Merve Çelik',
            date: '10 Kasım 2025',
            likes: 8,
            isLiked: false,
            comments: [],
            timestamp: parseDateToTimestamp('10 Kasım 2025')
        }
    ];

    let reports = loadReportsFromStorage();
    if (reports.length === 0) {
        reports = initialDemoReports;
        saveReportsToStorage();
    }

    // ------------------------------------------------------------------
    // === DOM ELEMENTLERİ ===
    // ------------------------------------------------------------------
    const reportForm = document.getElementById('report-form');
    const reportsContainer = document.getElementById('reports-container');
    const noReportsMessage = document.querySelector('.no-reports-message');
    const mainContent = document.getElementById('app-main');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Header ve Modal Kontrolleri
    const viewHomeBtn = document.getElementById('view-home-btn');
    const reportModal = document.getElementById('report-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const createReportToggle = document.querySelector('.create-report-toggle');
    const feedMainTitle = document.querySelector('.feed-main-title');

    // Daha Fazla Göster Butonu için Container
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';
    loadMoreContainer.style.textAlign = 'center';
    loadMoreContainer.style.marginTop = '20px';

    // Form Elementleri
    const reportTitleInput = document.getElementById('report-title');
    const reportDescriptionInput = document.getElementById('report-description');
    const reportPhotoInput = document.getElementById('report-photo');

    // Sayfalama ve Durum Değişkenleri
    const REPORTS_PER_PAGE = 4;
    let currentReportIndex = 0;

    // ------------------------------------------------------------------
    // === GÖRÜNÜM GEÇİŞİ VE YÜKLEME MANTIKLARI ===
    // ------------------------------------------------------------------
    function setViewMode() {
        if (mainContent) mainContent.style.opacity = 0;
        if (loadingOverlay) loadingOverlay.classList.add('active');

        loadMoreContainer.innerHTML = '';
        currentReportIndex = 0;
        currentUser = getCurrentUser();

        let sortedReports = [...reports];
        // Tüm raporları en yeniden en eskiye doğru sırala (timestamp'e göre)
        sortedReports.sort((a, b) => b.timestamp - a.timestamp);

        if (viewHomeBtn) viewHomeBtn.classList.add('active');
        if (feedMainTitle) feedMainTitle.textContent = 'Güncel Bildiriler';

        // İlk sayfa yükleniyor
        const reportsToShow = sortedReports.slice(0, REPORTS_PER_PAGE);
        loadReports(reportsToShow, false);

        currentReportIndex = REPORTS_PER_PAGE;
        if (currentReportIndex < sortedReports.length) createLoadMoreButton(sortedReports);

        // Oturum durumuna göre arayüzü güncelle
        updateUIForAuthStatus();

        if (loadingOverlay) loadingOverlay.classList.remove('active');
        if (mainContent) mainContent.style.opacity = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Oturum durumuna göre arayüzdeki etkileşimli öğeleri günceller.
     */
    function updateUIForAuthStatus() {
        const isLoggedIn = !!currentUser && currentUser.isLoggedIn;

        // Yeni Bildirim Butonu
        if (createReportToggle) {
            createReportToggle.style.display = 'block';
            createReportToggle.title = isLoggedIn ? 'Yeni sorun bildirimi oluştur' : 'Bildirim yayınlamak için lütfen giriş yapın.';
        }

        // Tüm rapor kartlarını kontrol et
        document.querySelectorAll('.report-card-item').forEach(card => {
            const commentInput = card.querySelector('.comment-form input');
            const commentSubmitBtn = card.querySelector('.comment-form button');

            if (commentInput) {
                // Giriş yapılmadıysa: Yorum alanlarını pasif tut
                commentInput.disabled = !isLoggedIn;
                commentSubmitBtn.disabled = !isLoggedIn;
                commentInput.placeholder = isLoggedIn ? 'Yorumunuzu yazın...' : 'Yorum yapmak için giriş yapmalısınız.';
            }
        });
    }

    /**
     * Rapor kartlarını DOM'a yükler.
     */
    function loadReports(data, append) {
        if (!reportsContainer) return;

        if (!append) reportsContainer.innerHTML = '';

        if (data.length === 0 && !append) {
            const existingNoReportMsg = reportsContainer.querySelector('.no-reports-message');
            if (!existingNoReportMsg && noReportsMessage) {
                reportsContainer.appendChild(noReportsMessage.cloneNode(true));
            }
        } else {
            const existingNoReportMsg = reportsContainer.querySelector('.no-reports-message');
            if (existingNoReportMsg) reportsContainer.removeChild(existingNoReportMsg);

            data.forEach(report => {
                const reportCard = createReportCard(report);
                reportsContainer.appendChild(reportCard);
            });
            addEventListeners();
        }

        if (reportsContainer.parentElement && !reportsContainer.parentElement.contains(loadMoreContainer)) {
            reportsContainer.parentElement.appendChild(loadMoreContainer);
        }
    }

    /**
     * "Daha Fazla Göster" butonunu oluşturur.
     */
    function createLoadMoreButton(allReports) {
        loadMoreContainer.innerHTML = '';

        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'neumo-btn primary';
        loadMoreBtn.textContent = 'Daha Fazla Sorun Göster';

        loadMoreBtn.onclick = () => {
            const nextReports = allReports.slice(currentReportIndex, currentReportIndex + REPORTS_PER_PAGE);
            loadReports(nextReports, true);

            currentReportIndex += REPORTS_PER_PAGE;

            if (currentReportIndex >= allReports.length) {
                loadMoreContainer.innerHTML = '<p style="color: var(--text-medium);">Tüm raporlar yüklendi.</p>';
            }
            addEventListeners();
        };

        loadMoreContainer.appendChild(loadMoreBtn);
    }

    // ------------------------------------------------------------------
    // === KART OLUŞTURMA FONKSİYONU ===
    // ------------------------------------------------------------------
    function createReportCard(report) {
        const reportCard = document.createElement('div');
        reportCard.classList.add('report-card-item', 'neumo-card');
        reportCard.dataset.id = report.id;

        const commentsHtml = report.comments.map(comment =>
            `<li><strong>${comment.user}:</strong> ${comment.text}</li>`
        ).join('');

        const photoSrc = report.photoUrl;
        
        // Düzeltilmiş yedek resim yolu
        const fallbackImageUrl = 'gorseller/placeholder.png'; 

        reportCard.innerHTML = `
            <div class="report-header">
                <div class="user-avatar">${report.user.charAt(0)}</div>
                <div class="user-info">
                    <strong>${report.user}</strong>
                    <span>${report.date}</span>
                </div>
            </div>
            <div class="report-media">
                <img src="${photoSrc}" alt="${report.title} fotoğrafı" onerror="this.onerror=null;this.src='${fallbackImageUrl}'">
            </div>
            <div class="report-content">
                <h3>${report.title}</h3>
                <p>${report.description}</p>
            </div>
            <div class="report-footer">
                <div class="action-buttons-group">
                    <button class="action-button like-btn ${report.isLiked ? 'liked' : ''}" data-id="${report.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-button comment-toggle-btn">
                        <i class="fas fa-comment-dots"></i>
                    </button>
                </div>
                <div class="report-status">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${report.likes}</span> Beğeni
                </div>
            </div>
            <div class="comments-section" style="display:none; padding: 15px 20px;">
                <h4>Yorumlar:</h4>
                <ul class="comments-list">${commentsHtml}</ul>
                <form class="comment-form">
                    <input type="text" placeholder="Yorumunuzu yazın..." class="neumo-input" required>
                    <button type="submit" class="neumo-btn primary" style="border-radius:6px; padding: 8px 15px;">Gönder</button>
                </form>
            </div>
        `;
        return reportCard;
    }

    // ------------------------------------------------------------------
    // === MODAL MANTIKLARI ===
    // ------------------------------------------------------------------
    if (createReportToggle && reportModal) {
        createReportToggle.addEventListener('click', () => {
            if (!currentUser || !currentUser.isLoggedIn) {
                showCustomNotification('⚠️ Bildiri yayınlamak için **lütfen giriş yapın.**');
                return;
            }
            reportModal.style.display = 'flex';
        });
    }

    if (modalCloseBtn && reportModal) {
        modalCloseBtn.addEventListener('click', () => {
            reportModal.style.display = 'none';
        });

        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) reportModal.style.display = 'none';
        });
    }

    // ------------------------------------------------------------------
    // === OLAY DİNLEYİCİLERİ ===
    // ------------------------------------------------------------------
    function addEventListeners() {
        // Beğeni Butonu Dinleyicisi
        document.querySelectorAll('.like-btn').forEach(button => {
            if (!button.dataset.listenerAdded) {
                button.dataset.listenerAdded = 'true';
                button.onclick = (e) => {
                    if (!currentUser || !currentUser.isLoggedIn) {
                        showCustomNotification('❤️ Beğeni bırakmak için **giriş yapmanız gerekmektedir.**');
                        return;
                    }

                    const id = parseInt(e.currentTarget.dataset.id);
                    const report = reports.find(r => r.id === id);
                    if (!report) return;

                    if (report.isLiked) {
                        report.likes--;
                        report.isLiked = false;
                        e.currentTarget.classList.remove('liked');
                    } else {
                        report.likes++;
                        report.isLiked = true;
                        e.currentTarget.classList.add('liked');
                    }
                    e.currentTarget.closest('.report-footer').querySelector('.like-count').textContent = report.likes;
                    saveReportsToStorage();
                };
            }
        });

        // Yorum Açma/Kapama Dinleyicisi
        document.querySelectorAll('.comment-toggle-btn').forEach(button => {
            if (!button.dataset.listenerAdded) {
                button.dataset.listenerAdded = 'true';
                button.onclick = (e) => {
                    const commentsSection = e.currentTarget.closest('.report-card-item').querySelector('.comments-section');
                    if (commentsSection) {
                        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
                    }
                };
            }
        });

        // Yorum Gönderme Dinleyicisi
        document.querySelectorAll('.comment-form').forEach(form => {
            if (!form.dataset.listenerAdded) {
                form.dataset.listenerAdded = 'true';
                form.onsubmit = (e) => {
                    e.preventDefault();

                    if (!currentUser || !currentUser.isLoggedIn) {
                        showCustomNotification('💬 Yorum yapmak için **lütfen giriş yapın.**');
                        return;
                    }

                    const input = form.querySelector('input[type="text"]');
                    const commentText = input.value.trim();

                    if (commentText) {
                        const reportCard = form.closest('.report-card-item');
                        const id = parseInt(reportCard.dataset.id);
                        const report = reports.find(r => r.id === id);

                        const user = currentUser.username || currentUser.role || 'Kayıtlı Kullanıcı';

                        if (report) {
                            report.comments.push({ user: user, text: commentText });

                            const commentsList = reportCard.querySelector('.comments-list');
                            if (commentsList) {
                                const newComment = document.createElement('li');
                                newComment.innerHTML = `<strong>${user}:</strong> ${commentText}`;
                                commentsList.appendChild(newComment);

                                input.value = '';
                                commentsList.scrollTop = commentsList.scrollHeight;
                                saveReportsToStorage();
                            }
                        }
                    }
                };
            }
        });
    }

    // ------------------------------------------------------------------
    // === FORMU GÖNDERME İŞLEVİ ===
    // ------------------------------------------------------------------
    if (reportForm && reportModal) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!currentUser || !currentUser.isLoggedIn) {
                showCustomNotification('⚠️ Yeni bildiri yayınlamak için **lütfen giriş yapın.**');
                return;
            }

            const title = reportTitleInput.value;
            const description = reportDescriptionInput.value;
            const photoFile = reportPhotoInput.files[0];

            if (title && description && photoFile) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const base64Url = e.target.result;
                    const currentTime = Date.now();
                    const reporterName = currentUser.username || currentUser.role || 'Kayıtlı Kullanıcı';

                    const newReport = {
                        id: currentTime,
                        title: title,
                        description: description,
                        photoUrl: base64Url, // Yeni yüklenen resim Base64 olarak kaydedilir
                        user: reporterName,
                        date: new Date().toLocaleDateString('tr-TR'),
                        likes: 0,
                        isLiked: false,
                        comments: [],
                        timestamp: currentTime
                    };

                    reports.push(newReport);
                    saveReportsToStorage();

                    reportForm.reset();
                    reportModal.style.display = 'none';
                    setViewMode();

                    showCustomNotification('🎉 Yeni sorun bildirimi başarıyla oluşturuldu!', 3000);
                };

                reader.onerror = function() {
                    showCustomNotification('Dosya okuma hatası oluştu.');
                };

                reader.readAsDataURL(photoFile);
            } else {
                showCustomNotification('Lütfen tüm alanları doldurun ve bir fotoğraf yükleyin.', 5000);
            }
        });
    }

    // ------------------------------------------------------------------
    // === İLK ÇALIŞTIRMA ===
    // ------------------------------------------------------------------
    if (viewHomeBtn) {
        viewHomeBtn.addEventListener('click', () => {
            setViewMode();
        });
    }

    setViewMode();
});