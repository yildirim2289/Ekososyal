// --- Ortak Değişkenler ---
const USER_STORAGE_KEY = 'currentUserData'; 
const PROFILE_PAGE_URL = 'Profil.html'; 

// --- DOM Elementlerini Seçme ---
const mainOptions = document.getElementById('mainOptions');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const guestBtn = document.getElementById('guestBtn');

const backToMainFromLogin = document.getElementById('backToMainFromLogin');
const backToMainFromRegister = document.getElementById('backToMainFromRegister');

const login = document.getElementById('login');
const register = document.getElementById('register');

// Özel Bildirim Elementlerini Seçme
const ekososyalMessage = document.getElementById('ekososyalMessage');
const notificationText = document.getElementById('notificationText');
const closeNotification = document.getElementById('closeNotification');


// --- Fonksiyonlar: Form Geçişleri ---

const showMainOptions = () => {
    mainOptions.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
};

const showLoginForm = () => {
    mainOptions.classList.add('hidden');
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
};

const showRegisterForm = () => {
    mainOptions.classList.add('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
};

// --- Fonksiyonlar: Özel Mesaj Sistemi ---

const showEkososyalMessage = (message) => {
    notificationText.textContent = message;
    ekososyalMessage.classList.remove('hidden');
    
    setTimeout(() => {
        ekososyalMessage.classList.add('show');
    }, 10); 

    setTimeout(hideEkososyalMessage, 5000);
};

const hideEkososyalMessage = () => {
    ekososyalMessage.classList.remove('show');
    
    setTimeout(() => {
        ekososyalMessage.classList.add('hidden');
    }, 400); 
};

// --- Olay Dinleyicileri (Event Listeners) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Bildirim kapatma butonunu dinleme
    closeNotification.addEventListener('click', hideEkososyalMessage);

    // Form Geçiş Olayları
    showLoginBtn.addEventListener('click', showLoginForm);
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    backToMainFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showMainOptions();
    });
    backToMainFromRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showMainOptions();
    });

    // Misafir Kullanıcı İşlemi
    guestBtn.addEventListener('click', () => {
        showEkososyalMessage('Misafir kullanıcı olarak devam ediliyor. Tam işlevsellik ve doğaya katkı için giriş yapınız!');
        // window.location.href = PROFILE_PAGE_URL; // Misafir olarak devam edilecekse yönlendirme
    });

    // Kayıt Formu Gönderimi
    register.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('username').value,
            role: document.getElementById('role').value
            // Diğer alanlar (email, password vb.) burada yakalanabilir.
        };

        // Yeni kullanıcının başlangıç verilerini oluştur
        const initialProfileData = {
            isLoggedIn: true,
            username: userData.username,
            role: userData.role,
            totalScore: 0, // Yeni kullanıcı başlangıç puanı 0
            completedTasks: [],
        };
        // Veriyi localStorage'a kaydet
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(initialProfileData));


        showEkososyalMessage(`Kayıt başarılı! 🌱 Hoş geldiniz, ${userData.username}. Yönlendiriliyorsunuz...`);
        
        register.reset();
        
        // Profil sayfasına yönlendir
        setTimeout(() => {
            window.location.href = PROFILE_PAGE_URL; 
        }, 1000);
    });

    // Giriş Formu Gönderimi
    login.addEventListener('submit', (e) => {
        e.preventDefault();

        const loginData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };

        // Gerçek uygulamada API'dan gelen kullanıcı verisi buraya yazılır.
        // SIMÜLASYON: Sabit bir giriş profili oluşturuluyor
        const loggedInProfileData = {
            isLoggedIn: true,
            username: "DogaSever_34", 
            role: "Kişisel Hesap", 
            totalScore: 5000, 
            completedTasks: [], // Test için boş bırakıldı
        };

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInProfileData));


        showEkososyalMessage(`Giriş yapılıyor... 💚 Topluluğumuzdaki etkinliğinizi kontrol etmek için yönlendiriliyorsunuz.`);
        
        login.reset();
        
        // Profil sayfasına yönlendir
        setTimeout(() => {
            window.location.href = PROFILE_PAGE_URL; 
        }, 1000);
    });
});