// --- SAHTE VERİLER (Yedek) ---
const FALLBACK_USER_DATA = {
    isLoggedIn: false, // Varsayılan olarak çıkış yapmış kabul edilir.
    username: 'Misafir Kullanıcı',
    role: 'Misafir',
    totalScore: 0,
    completedTasks: [],
};

const USER_STORAGE_KEY = 'currentUserData';
const LOGIN_PAGE_URL = 'Giriş-Kayıt.html'; 

const MONTHLY_TASKS_DATA = [
    // 1. Ay Görevleri (monthGroup: 1)
    { id: 'task-1', monthGroup: 1, week: 1, emoji: '🗑️', title: 'Hafta 1: Sıfır Atık Günü', points: 100, desc: 'Tüm atıklarınızı bir gün boyunca ayrı kaplarda toplayın ve kanıtlayın.' },
    { id: 'task-2', monthGroup: 1, week: 2, emoji: '🫙', title: 'Hafta 2: Plastik Yerine Cam Tercihi', points: 100, desc: 'Tek kullanımlık plastik şişe veya kaplar yerine, yeniden kullanılabilir cam/metal ürünler kullandığınızı kanıtlayın.' },
    { id: 'task-3', monthGroup: 1, week: 3, emoji: '🍃', title: 'Hafta 3: Kamuya Açık Bir Alanda Çevre Temizliği', points: 50, desc: 'Öncesi–sonrası fotoğrafı yükleyerek bir alanı temizlediğinizi kanıtlayın.' },
    { id: 'task-4', monthGroup: 1, week: 4, emoji: '🌳', title: 'Hafta 4: Fidan / Bitki Ekimi', points: 50, desc: 'Ektiğiniz fidan veya saksı bitkisinin fotoğrafını yükleyiniz. ' },

    // 2. Ay Görevleri (monthGroup: 2)
    { id: 'task-5', monthGroup: 2, week: 1, emoji: '💡', title: 'Hafta 1: Enerji Tasarrufu Saati', points: 75, desc: 'Gereksiz yanan tüm elektrikli cihazları bir saat boyunca kapatın ve kanıtlayın.' },
    { id: 'task-6', monthGroup: 2, week: 2, emoji: '🚲', title: 'Hafta 2: Taşıt Kullanmama Günü', points: 75, desc: 'Bir gün boyunca araba/motorlu taşıt yerine yürüyün, bisiklet kullanın veya toplu taşımayı tercih edin.' },
    { id: 'task-7', monthGroup: 2, week: 3, emoji: '💧', title: 'Hafta 3: Su Tasarrufu Hareketi', points: 100, desc: 'Diş fırçalarken veya bulaşık yıkarken suyu kapatarak tasarruf ettiğinizi gösterin.' },
    { id: 'task-8', monthGroup: 2, week: 4, emoji: '🍎', title: 'Hafta 4: Yerel ve Mevsimlik Ürün Tüketimi', points: 50, desc: 'Marketten veya pazardan yerel/mevsimlik ürün aldığınızın fotoğrafını yükleyin.' },
];

const BADGES_DATA = [
    { id: 'b-starter', name: 'Başlangıç Fidanı', requiredScore: 200, iconClass: 'bronze fas fa-seedling' },
    { id: 'b-bronze', name: 'Bronz Yaprak', requiredScore: 400, iconClass: 'bronze fas fa-leaf' },
    { id: 'b-silver', name: 'Gümüş Göl', requiredScore: 650, iconClass: 'silver fas fa-water' },
    { id: 'b-gold', name: 'Altın Güneş', requiredScore: 900, iconClass: 'gold fas fa-sun' },
    { id: 'b-platinum', name: 'Platin Orman', requiredScore: 1300, iconClass: 'silver fas fa-tree' },
    { id: 'b-diamond', name: 'Elmas Gezegen', requiredScore: 1800, iconClass: 'diamond fas fa-globe-americas' },
    { id: 'b-champion', name: 'Çevre Şampiyonu', requiredScore: 2500, iconClass: 'gold fas fa-crown' },
    { id: 'b-legend', name: 'Yeşil Efsane', requiredScore: 3500, iconClass: 'diamond fas fa-star' },
];
// --------------------------------------------------

/**
 * Kullanıcı verilerini localStorage'dan çeker. Yoksa veya geçersizse yedek veriyi kullanır.
 */
function loadCurrentUser() {
    const savedData = localStorage.getItem(USER_STORAGE_KEY);
    
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            if (userData && userData.isLoggedIn) {
                 return userData;
            }
        } catch (e) {
            console.error("Kayıtlı kullanıcı verisi okunamadı:", e);
        }
    }
    return FALLBACK_USER_DATA;
}

/**
 * Mevcut tarihi baz alarak ayın hangi haftasında olduğumuzu hesaplar (1-4 arası).
 */
function getCurrentWeek() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    let week = Math.ceil(dayOfMonth / 7);
    if (week > 4) {
        week = 4;
    }
    return week;
}

/**
 * Mevcut aya göre hangi görev setinin (monthGroup 1 veya 2) listeleneceğini belirler.
 */
function getCurrentTaskGroup() {
    const today = new Date();
    const month = today.getMonth();
    const monthGroup = ((month + 1) % 2 !== 0) ? 1 : 2;
    return monthGroup;
}


// --- GENEL DEĞİŞKENLER ---
let currentUser = loadCurrentUser();
// Eğer kullanıcı misafir ise, profil arayüzünü gizlemeliyiz.
currentUser.isLoggedIn = currentUser.isLoggedIn && currentUser.username !== FALLBACK_USER_DATA.username;


currentUser.currentWeek = getCurrentWeek(); 
currentUser.currentMonthGroup = getCurrentTaskGroup();

let completedTasksForCurrentCycle = currentUser.completedTasks || []; 

let currentTaskToComplete = null;

const modal = document.getElementById('upload-modal');
const closeButton = document.querySelector('.close-button');
const submitButton = document.getElementById('submit-task-photo');
const submissionMessage = document.getElementById('submission-message');
const submissionForm = document.getElementById('submission-form-content');
const gainedPointsDisplay = document.getElementById('gained-points-display');


document.addEventListener('DOMContentLoaded', () => {
    if (currentUser.isLoggedIn) {
        document.getElementById('login-required').classList.add('hidden');
        document.getElementById('profile-container').classList.remove('hidden');
        renderProfile();
    } else {
        document.getElementById('login-required').classList.remove('hidden');
        document.getElementById('profile-container').classList.add('hidden');
    }

    const imageUploadInput = document.getElementById('task-image-upload');
    const fileNameDisplay = document.getElementById('selected-file-name');

    imageUploadInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = event.target.files[0].name;
            fileNameDisplay.style.color = 'var(--primary-color)';
        } else {
            fileNameDisplay.textContent = 'Henüz dosya seçilmedi.';
            fileNameDisplay.style.color = '#777';
        }
    });
});

function renderProfile() {
    document.getElementById('username-display').textContent = currentUser.username;
    document.getElementById('role-display').textContent = currentUser.role;
    document.getElementById('total-score-display').textContent = currentUser.totalScore;

    renderTasks();
    renderBadges();
}

/**
 * Kullanıcının oturumunu kapatır ve şık bir bildirim gösterir.
 */
function handleLogout() {
    // localStorage'daki veriyi temizle
    localStorage.removeItem(USER_STORAGE_KEY);
    
    // Bildirim göster (Yeni fonksiyon)
    showToast("👋 Başarıyla çıkış yaptınız.", "success");
    
    // Arayüzü güncelle (Gerekli değil, çünkü yönlendirme yapılacak ama yine de temizlik iyidir)
    document.getElementById('profile-container').classList.add('hidden');
    document.getElementById('login-required').classList.remove('hidden');

    // Giriş sayfasına geri yönlendir
    setTimeout(() => {
        window.location.href = LOGIN_PAGE_URL;
    }, 2500); // Bildirimin görünmesi için bekleme süresi artırıldı.
}

/**
 * Toast Bildirimi (Popup) gösterir.
 */
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;

    // Toast'u ekle
    toastContainer.appendChild(toast);

    // Bir süre sonra otomatik kaybol
    setTimeout(() => {
        toast.classList.add('hide'); // CSS animasyonu başlatmak için
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 1200); // 1.2 saniye sonra kaybolmaya başla
}


/**
 * Mevcut aya ait görev kartlarını oluşturur ve Çıkış Yap butonunu ekler.
 */
function renderTasks() {
    const taskGrid = document.getElementById('weekly-tasks');
    taskGrid.innerHTML = '';

    const currentWeekNumber = currentUser.currentWeek;
    const currentGroup = currentUser.currentMonthGroup;

    // Sadece mevcut aya ait görevleri filtrele (monthGroup'a göre)
    const currentMonthTasks = MONTHLY_TASKS_DATA.filter(task => task.monthGroup === currentGroup);

    currentMonthTasks.forEach(task => {
        const card = document.createElement('div');
        card.setAttribute('data-task-id', task.id);

        const isCompleted = completedTasksForCurrentCycle.includes(task.id);
        const isCurrentWeekTask = task.week === currentWeekNumber;
        const isButtonActive = isCurrentWeekTask && !isCompleted;
        const isPastTask = task.week < currentWeekNumber;
        const isFutureTask = task.week > currentWeekNumber;

        let cardClass = 'task-card';
        if (isCompleted) cardClass += ' completed';
        if (!isCurrentWeekTask) cardClass += ' unavailable-task';

        card.className = cardClass;

        let buttonText = 'Görevi Yap';
        if (isCompleted) {
            buttonText = 'Tamamlandı';
        } else if (isPastTask) {
            buttonText = 'Geçmiş Görev';
        } else if (isFutureTask) {
            buttonText = `Haftayı Bekle (${task.week}. Hafta)`;
        }

        if (isCurrentWeekTask && !isCompleted) {
             buttonText = 'Görevi Yap';
        }

        card.innerHTML = `
            <div class="task-info">
                <h4>${task.emoji} ${task.title}</h4>
                <p>${task.desc}</p>
            </div>
            <div class="task-actions">
                <div class="points">${task.points} Puan</div>
                <button
                    id="btn-${task.id}"
                    data-task-id="${task.id}"
                    class="${isButtonActive ? 'active-task task-btn-action' : ''}"
                    ${!isButtonActive ? 'disabled' : ''}
                >
                    ${buttonText}
                </button>
            </div>
        `;

        taskGrid.appendChild(card);
    });

    // --- ÇIKIŞ YAP BUTONU EKLEME ---
    let logoutContainer = document.getElementById('logout-container');
    if (!logoutContainer) {
        logoutContainer = document.createElement('div');
        logoutContainer.id = 'logout-container';
        logoutContainer.className = 'logout-container';
        logoutContainer.innerHTML = `
            <button id="logout-button">
                <i class="fas fa-sign-out-alt"></i> Çıkış Yap
            </button>
        `;
        document.querySelector('.left-section').appendChild(logoutContainer);
        document.getElementById('logout-button').addEventListener('click', handleLogout);
    }

    document.querySelectorAll('.task-btn-action.active-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.target.getAttribute('data-task-id');
            openUploadModal(taskId);
        });
    });
}

/**
 * Rozet listesini oluşturur. 
 */
function renderBadges() {
    const badgesList = document.getElementById('badges-list');
    const earnedBadgesDisplay = document.getElementById('earned-badges-display');

    badgesList.innerHTML = '';
    earnedBadgesDisplay.innerHTML = '';

    BADGES_DATA.forEach(badge => {
        const isUnlocked = currentUser.totalScore >= badge.requiredScore;

        const visualClass = badge.iconClass.split(' ')[0];
        const icon = badge.iconClass.split(' ').slice(1).join(' ');

        // Ana Rozet Listesi
        const badgeItem = document.createElement('div');
        badgeItem.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
        badgeItem.innerHTML = `
            <div class="badge-visual ${visualClass}"><i class="${icon}"></i></div>
            <div class="badge-info"><strong>${badge.name} ${isUnlocked ? '(Kazanıldı)' : ''}</strong><span>${badge.requiredScore} Puan</span></div>
        `;
        badgesList.appendChild(badgeItem);

        // Kazanılan Rozetler Bölümü
        if (isUnlocked) {
            const earnedIcon = document.createElement('div');
            earnedIcon.className = 'earned-badge-icon';
            earnedIcon.title = badge.name;
            earnedIcon.innerHTML = `<div class="badge-visual ${visualClass}"><i class="${icon}"></i></div>`;
            earnedBadgesDisplay.appendChild(earnedIcon);
        }
    });
}


function openUploadModal(taskId) {
    const task = MONTHLY_TASKS_DATA.find(t => t.id === taskId);
    if (!task) return;

    currentTaskToComplete = task;
    document.getElementById('modal-task-title').textContent = task.title;

    submissionMessage.classList.add('hidden');
    submissionForm.classList.remove('hidden');

    document.getElementById('selected-file-name').textContent = 'Henüz dosya seçilmedi.';
    document.getElementById('selected-file-name').style.color = '#777';
    document.getElementById('task-image-upload').value = '';

    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    submissionMessage.classList.add('hidden');
    submissionForm.classList.remove('hidden');

    document.getElementById('task-image-upload').value = '';
    currentTaskToComplete = null;
}

closeButton.onclick = closeModal;
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

submitButton.onclick = () => {
    const imageInput = document.getElementById('task-image-upload');

    if (!imageInput.files.length) {
        alert('Lütfen görevi tamamladığınızı gösteren bir resim yükleyin.');
        return;
    }

    if (currentTaskToComplete) {
        if (completedTasksForCurrentCycle.includes(currentTaskToComplete.id)) {
            alert('Bu görevi bu ay/döngü içinde zaten tamamladınız.');
            closeModal();
            return;
        }

        const gainedPoints = currentTaskToComplete.points;

        // Kullanıcı verilerini güncelle
        currentUser.totalScore += gainedPoints;
        completedTasksForCurrentCycle.push(currentTaskToComplete.id);
        currentUser.completedTasks = completedTasksForCurrentCycle; // Güncellenmiş listeyi currentUser'a ata

        // localStorage'ı güncelle
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));

        gainedPointsDisplay.textContent = gainedPoints;

        submissionForm.classList.add('hidden');
        submissionMessage.classList.remove('hidden');

        renderProfile();

        setTimeout(() => {
            closeModal();
        }, 2000);
    }
};