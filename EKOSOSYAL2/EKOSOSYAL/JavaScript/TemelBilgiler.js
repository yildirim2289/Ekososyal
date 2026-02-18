document.addEventListener('DOMContentLoaded', () => {
    // Tüm açma/kapama butonlarını seç
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const INITIAL_HEIGHT = 150; // CSS'teki başlangıç max-height değeri (piksel)
    const TRANSITION_DURATION = 500; // CSS'teki geçiş süresi (ms)

    // Sayfa yüklendiğinde tüm içeriklerin başlangıç durumunu ayarla (CSS'teki 150px'i teyit eder)
    document.querySelectorAll('.topic-content').forEach(content => {
        // Tüm içeriklerin başlangıçta 'kapalı' durumda olduğunu belirt
        content.setAttribute('aria-expanded', 'false'); 
        content.style.maxHeight = `${INITIAL_HEIGHT}px`;
    });


    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.getAttribute('aria-controls');
            const content = document.getElementById(contentId);

            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                // 🔴 KAPATMA (Daha Az Oku) İŞLEMİ -> 150px'e geri dön

                // 1. Önce, geçişin sorunsuz olması için mevcut yüksekliğe (gerçek scrollHeight) ayarla.
                content.style.maxHeight = content.scrollHeight + 'px'; 

                // 2. Bir sonraki tarayıcı çizim döngüsünde başlangıç yüksekliğine (150px) geçişi başlat.
                requestAnimationFrame(() => {
                    content.style.maxHeight = `${INITIAL_HEIGHT}px`;
                });
                
                // 3. Buton ve ARIA durumunu güncelle.
                button.setAttribute('aria-expanded', 'false');
                button.textContent = 'Daha Fazla Oku';

            } else {
                // 🟢 AÇMA (Daha Fazla Oku) İŞLEMİ -> Tamamen aç

                // 1. Yüksekliği hesaplamak için geçici olarak max-height:none yapıp scrollHeight'ı al.
                content.style.maxHeight = 'none'; 
                const scrollHeight = content.scrollHeight; 
                
                // 2. Ardından tekrar başlangıç yüksekliğine getirip animasyonu başlat.
                content.style.maxHeight = `${INITIAL_HEIGHT}px`; 
                
                // 3. Bir sonraki karede tam yüksekliğe geçişi başlat.
                requestAnimationFrame(() => {
                    content.style.maxHeight = `${scrollHeight}px`;
                });
                
                // 4. Geçiş bittikten sonra (opsiyonel) max-height'ı 'none' yap ki içerik değişirse sorun olmasın.
                setTimeout(() => {
                    if (button.getAttribute('aria-expanded') === 'true') {
                         content.style.maxHeight = 'none'; 
                    }
                }, TRANSITION_DURATION + 50); 
                
                // 5. Buton ve ARIA durumunu güncelle.
                button.setAttribute('aria-expanded', 'true');
                button.textContent = 'Daha Az Oku';
            }
        });
    });

    // Tarayıcı boyutlandırıldığında açık içeriğin max-height değerini yeniden hesapla
    window.addEventListener('resize', () => {
        document.querySelectorAll('.topic-content[aria-expanded="true"]').forEach(openContent => {
            
            // Geçiş animasyonunu geçici olarak devre dışı bırak
            openContent.style.transition = 'none'; 
            
            // Yeni yüksekliği hesapla ve uygula
            const newHeight = openContent.scrollHeight;
            openContent.style.maxHeight = newHeight + 'px';

            // Kısa bir gecikmeden sonra geçiş animasyonunu geri ekle
            setTimeout(() => {
                openContent.style.transition = ''; 
            }, 10);
        });
        
        // Kapalı içeriklerin yüksekliğini de koru
        document.querySelectorAll('.topic-content[aria-expanded="false"]').forEach(closedContent => {
             closedContent.style.maxHeight = `${INITIAL_HEIGHT}px`;
        });
    });
});