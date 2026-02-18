


document.addEventListener('DOMContentLoaded', function() {
    // Menü butonunu ve menü linklerinin kapsayıcısını seç
    const menuToggle = document.querySelector('.menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');

    // Mobil menü butonuna tıklama olay dinleyicisi ekle
    menuToggle.addEventListener('click', function() {
        // 'active' sınıfını toggle et (varsa kaldır, yoksa ekle)
        // CSS'teki 'desktop-nav.active' kuralı bu sınıfı kullanarak menüyü gösterir.
        desktopNav.classList.toggle('active');
        
        // Butonun ikonunu değiştir (açık/kapalı durumunu görselleştirmek için)
        const icon = menuToggle.querySelector('i');
        if (desktopNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times'); // Kapatma (X) ikonu
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars'); // Menü ikonu
        }
    });

    // Sayfalar arası geçiş yaptığında menü mobil cihazlarda açık kalmasın diye (isteğe bağlı)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (desktopNav.classList.contains('active') && window.innerWidth <= 900) {
                 desktopNav.classList.remove('active');
                 const icon = menuToggle.querySelector('i');
                 icon.classList.remove('fa-times');
                 icon.classList.add('fa-bars');
            }
        });
    });

    // Opsiyonel: Aktif Sayfayı Vurgulama
    // Mevcut sayfanın menüdeki linkini otomatik olarak vurgular.
    const path = window.location.pathname.split('/').pop();
    if (path) {
        const currentLink = document.querySelector(`.nav-links a[href="${path}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
});