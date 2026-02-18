// --- Ortak Değişkenler ---
const USER_STORAGE_KEY = 'currentUserData'; 
const DYNAMIC_EVENTS_STORAGE_KEY = 'userPostedEvents'; // Kullanıcı duyurularını kalıcı saklama anahtarı
const STATIC_COMMENTS_STORAGE_KEY = 'staticEventsComments'; //Statik etkinliklerin yorumlarını saklama anahtarı 

// KULLANICI DURUMUNU LOCALSTORAGE'DAN ÇEKME 
function getCurrentUserStatus() {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
        const user = JSON.parse(userData);
        const role = user.isLoggedIn ? 1 : 0; 
        const name = user.isLoggedIn ? user.username : "Misafir";
        return { role, name };
    }
    return { role: 0, name: "Misafir" };
}

const { role: current_user_role, name: current_user_name } = getCurrentUserStatus();

// ** 1. SABİT (STATİK) ETKİNLİKLER **
const initialEvents = [
    {
        id: 1,
        title: "TARIMSAL ÜRETİMDE ONARICI DÖNÜŞÜM", 
        description: "Yıkılan Hayatları Yeniden Yeşertiyoruz: Hatay'ın bereketi solmasın diye, tohumdan toprağa umut ekiyor, depremden etkilenen çiftçilerimizle birlikte ayağa kalkıyoruz.", 
        imageUrl: "img/Tarım.png", 
        pageUrl: "https://hatayicinbirlikte.org/", 
        comments: [],
        fullDescription: "  ",
        date: "" 
    },
    {
       id: 2,
        title: "ZEHİRSİZ SOFRALAR", 
        description: "Zehirsiz sofralar için hepimize düşen görevler var. Ben ne yapabilirim ki? sorusunun cevabı Çok şey! Zehirsiz Gıda İçin Haydi Harekete: Pestisitler sadece böcekleri değil, soframızdaki sağlığı da sessizce öldüren kimyasal hayaletlerdir.", 
        imageUrl: "img/Gıda.png", 
        pageUrl: "https://zehirsizsofralar.org/", 
        comments: [], 
        fullDescription: "",
        date: "" 
    },
    {
        id: 3,
        title: "DOĞA ÖNCÜLERİ", 
        description: "Z Kuşağı Doğaya El Koyuyor: Geleceğin Liderleri, Doğa Sorunlarına Teknolojiyi ve Yaratıcılığı Kullanarak Sadece Konuşmuyor, Çözüm Üretiyor! 💡🌍", 
        imageUrl: "img/Öğrenci.png", 
        pageUrl: "https://www.wwf.org.tr/kesfet/gonulluluk_ve_egitim/doga_onculeri/", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 4,
        title: "DÜNYA İÇİN LAZIM", 
        description:"Dijitalin Çöpü, Dünyanın Geleceği: E-Atıkları Dönüştürerek Sadece Doğayı Değil, Çocukların Zihnini de Formatlıyor, Gezegenin Donanımını Kurtarıyoruz!♻️💡", 
        imageUrl: "img/E-atık.png", 
        pageUrl: "https://www.wwf.org.tr/kesfet/gonulluluk_ve_egitim/dunya_icin_lazim/", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 5,
        title: "PLAJINA SAHİP ÇIK", 
        description: "Denizlerin Nefesi Kesilmesin: Plajlarımızı Sadece Kumlardan Değil, Her Saniye Okyanuslara Karışan Plastik Kâbusundan Temizliyor, Mavi Mirasımıza Can Veriyoruz!🏖️🌊", 
        imageUrl: "img/Plaj.png", 
        pageUrl: "https://www.turcev.org.tr/V2/icerikDetay.aspx?icerik_id=160", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 6,
        title: "YEŞİL VATANI ANLAT, ORMANI YAŞAT", 
        description: "Türkiye’nin doğa sevgisini ve çevre bilincini beyaz perdeye taşımayı amaçlayan Yeşil Vatan Kısa Film Yarışması, genç sinemacılara kapılarını açıyor.", 
        imageUrl: "img/Ağaç.png", 
        pageUrl: "https://www.gelecegenefes.gov.tr/haberler/yesil-vatan-kisa-film-yarismasi-basvurulari-basladi-3", 
        comments: [],
        fullDescription:"",
        date: "" 
    },
    {
        id: 7,
        title: "ÇOCUKLARLA İKLİM DEĞİŞİKLİĞİNİN ETKİLERİNİ AZALTMA", 
        description: "Yetişkinlerin Yok Ettiği Geleceği Çocuklar Kurtaracak! Çocuklarla İklim Değişikliğinin Etkilerini Azaltma (ÇİDEA) projesiyle, felaketlerin gölgesindeki dünyamızı Eko-Okuryazarlık ile yeniden inşa ediyor, minik ellere büyük umutlar ekiyoruz! 👧🌱", 
        imageUrl: "img/İklim.png", 
        pageUrl: "https://suyader.org.tr/portfolio/cidea-cocuklarla-iklim-degisikliginin-etkilerini-azaltma-ve-kusaklararasi-aktarim/", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 8,
        title: "GELECEĞE NEFES OL", 
        description:"Nefes Almak İçin Bağışla: Tek bir fidanla yanan ormanların yarasını sarıyoruz.", 
        imageUrl: "img/Fidanbağış.png", 
        pageUrl: "https://www.gelecegenefes.gov.tr/", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 9,
        title: "TÜRKİYE'NİN CANI YANMASIN DESTEK PROGRAMI", 
        description: "Orman yangınları kaderimiz olmasın!", 
        imageUrl: "img/Yangın.png", 
        pageUrl: "https://www.wwf.org.tr/kesfet/ormanlar/turkiyenin_cani/", 
        comments: [],
        fullDescription: "",
        date: "" 
    },
    {
        id: 10,
        title: "FİDAN BAĞIŞI KAMPANYASI", 
        description: "Bir Fidan, Bin Nefes: Gelecek Nesiller İçin Sadece Bir Ağaç Değil, Yanan Ormanların Yarasını Saran, Soluduğumuz Havanın Sigortasını Ekiyoruz!🌲", 
        imageUrl: "img/fidan.png", 
        pageUrl: "https://suyader.org.tr/agac-bagis-kampanyasi/", 
        comments: [],
        fullDescription: "",
        date: "" 
    }
];

// ** 2. DİNAMİK ETKİNLİK YÖNETİMİ FONKSİYONLARI **

// ** Statik yorumları yükleyen yardımcı fonksiyon **
function loadStaticComments() {
    const saved = localStorage.getItem(STATIC_COMMENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Sayfa açıldığında statik diziyi hafızadaki yorumlarla eşleştirme 
const savedStaticComments = loadStaticComments();
initialEvents.forEach(ev => {
    if (savedStaticComments[ev.id]) {
        ev.comments = savedStaticComments[ev.id];
    }
});

function loadDynamicEvents() {
    const savedEvents = localStorage.getItem(DYNAMIC_EVENTS_STORAGE_KEY);
    try {
        return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (e) {
        console.error("Kalıcı etkinlik verileri yüklenirken hata oluştu:", e);
        return [];
    }
}

function saveDynamicEvents(dynamicEventsArray) {
    localStorage.setItem(DYNAMIC_EVENTS_STORAGE_KEY, JSON.stringify(dynamicEventsArray));
}

let dynamicEvents = loadDynamicEvents();
let events = [...dynamicEvents, ...initialEvents]; 

document.addEventListener('DOMContentLoaded', () => {
    const eventListContainer = document.getElementById('event-list');
    const addEventBtn = document.getElementById('add-event-btn');
    const authLink = document.getElementById('auth-link'); 
    
    // Duyuru Modal Elementleri
    const modal = document.getElementById("event-modal");
    const closeBtn = document.querySelector(".close-btn");
    const newEventForm = document.getElementById('new-event-form');

    // ** ÖZEL BİLDİRİM FONKSİYONU **
    function showCustomNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        if (isError) notification.classList.add('error');
        
        notification.innerHTML = `
            <div class="notification-header">🌱 EKOSOSYAL BİLDİRİMİ</div>
            <div class="notification-body">${message}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10); 
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000);
    }
    
    // ** 1. KULLANICI YETKİLERİNE GÖRE GÖRÜNÜM AYARI **
    function checkUserRole() {
        if (current_user_role === 1) {
            authLink.textContent = `Hoş Geldiniz, ${current_user_name}!`;
            authLink.href = "Profil.html"; 
            addEventBtn.style.display = 'inline-block';
        } else {
             authLink.textContent = 'Giriş/Kayıt';
             authLink.href = 'Giriş-Kayıt.html';
             addEventBtn.style.display = 'inline-block'; 
             addEventBtn.addEventListener('click', handleGuestAction);
        }
    }
    
    function handleGuestAction(e) {
        e.preventDefault();
        showCustomNotification("Bu özellik için giriş yapmanız gerekmektedir.", true);
    }

    // ** 2. ETKİNLİK LİSTESİNİ OLUŞTURMA **
    function renderEventList() {
        events = [...dynamicEvents, ...initialEvents]; 
        eventListContainer.innerHTML = ''; 

        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'list-item';
            
            const finalImageUrl = event.imageUrl && event.imageUrl.trim() !== '' 
                                  ? event.imageUrl 
                                  : 'https://via.placeholder.com/80x80?text=Resim+Yok';

            // Yorumları Listeleme (Her etkinliğin altına)
            let commentsHtml = '';
            if (event.comments && event.comments.length > 0) {
                commentsHtml = `<div class="event-comments-list" id="comments-for-${event.id}">
                                    <strong>Yorumlar:</strong>
                                    <ul>${event.comments.map(c => `<li>${c}</li>`).join('')}</ul>
                                </div>`;
            } else {
                commentsHtml = `<div class="event-comments-list" id="comments-for-${event.id}"><p style="font-size:0.85em; color:#888;">Henüz yorum yapılmamış.</p></div>`;
            }

            item.innerHTML = `
                <img src="${finalImageUrl}" alt="${event.title}" class="list-item-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80?text=Hata';">
                <div class="list-item-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="list-item-actions">
                        <button class="action-btn view-btn-new" data-url="${event.pageUrl}">Etkinliği Gör</button>
                    </div>
                    
                    <div class="comments-container">
                        ${commentsHtml}
                        <div class="list-item-comment-area">
                            ${current_user_role === 1 ? `
                                <textarea data-id="${event.id}" placeholder="Fikrinizi paylaşın..."></textarea>
                                <button class="action-btn comment-btn-inline" data-id="${event.id}">Yorum Yap</button>
                            ` : `
                                <button class="action-btn guest-comment-btn" data-id="${event.id}">Yorum Yapmak İçin Giriş Yapın</button>
                            `}
                        </div>
                    </div>
                </div>
            `;            
            eventListContainer.appendChild(item);
        });
        
        attachEventListeners();
    }

    function attachEventListeners() {
        // Yeni sayfada açma butonu
        document.querySelectorAll('.view-btn-new').forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                window.open(url, '_blank'); 
            });
        });

        // Yorum Yap butonu (Giriş Yapmış)
        document.querySelectorAll('.comment-btn-inline').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const textarea = document.querySelector(`textarea[data-id="${id}"]`);
                const commentText = textarea.value.trim();
                
                if (commentText) {
                    const event = events.find(ev => ev.id === id);
                    event.comments.push(`${current_user_name}: ${commentText}`); 

                    // Dinamik ise kaydet
                    const dIdx = dynamicEvents.findIndex(de => de.id === id);
                    if (dIdx !== -1) {
                        dynamicEvents[dIdx] = event;
                        saveDynamicEvents(dynamicEvents);
                    } 
                    // ** Eğer statik bir etkinlikse, statik yorum listesini güncelle ve kaydet **
                    else {
                        const allStaticComments = loadStaticComments();
                        allStaticComments[id] = event.comments;
                        localStorage.setItem(STATIC_COMMENTS_STORAGE_KEY, JSON.stringify(allStaticComments));
                    }
                    
                    showCustomNotification(`Yorumunuz eklendi.`);
                    renderEventList(); // Listeyi yenileyerek yorumu göster
                } else {
                    showCustomNotification('Boş yorum gönderilemez.', true);
                }
            });
        });

        // Misafir Yorum Butonu
        document.querySelectorAll('.guest-comment-btn').forEach(btn => {
            btn.addEventListener('click', () => showCustomNotification('Yorum yapmak için giriş yapmalısınız.', true));
        });
    }

    // ** 6. DUYURU YAPMA (MODAL) **
    addEventBtn.addEventListener('click', () => {
        if (current_user_role === 1) modal.style.display = "block";
    });

    closeBtn.addEventListener('click', () => modal.style.display = "none");
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = "none"; });

    newEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const description = document.getElementById('event-description').value;
        const date = document.getElementById('event-date').value;
        const imageUrl = document.getElementById('event-image-url').value;
        const pageUrl = document.getElementById('event-page-url').value;
        
        const maxId = events.length > 0 ? Math.max(...events.map(ev => ev.id)) : 0;
        
        const newEvent = {
            id: maxId + 1,
            title: title,
            description: description.substring(0, 100) + '...',
            imageUrl: imageUrl,
            pageUrl: pageUrl,
            comments: [`Sistem: ${current_user_name} tarafından paylaşıldı.`], 
            fullDescription: description,
            date: date
        };
        
        dynamicEvents.unshift(newEvent); 
        saveDynamicEvents(dynamicEvents); 
        
        showCustomNotification(`"${title}" paylaşıldı!`);
        modal.style.display = "none";
        newEventForm.reset();
        renderEventList();
    });

    checkUserRole();
    renderEventList();
});