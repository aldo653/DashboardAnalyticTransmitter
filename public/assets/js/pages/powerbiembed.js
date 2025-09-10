// Fungsi untuk menangani perubahan layout perangkat dan embed laporan Power BI
function handleLayoutChange() {
    var isMobile = isMobileDevice(); // Deteksi perangkat mobile atau desktop

    // Lakukan permintaan AJAX untuk mendapatkan embed data
    fetch('/api/get-embed-data') // Ganti dengan route yang sesuai
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
            var reportId = data.reportId; // Dapatkan report ID dari response
            var embedUrl = data.embedUrl; // Dapatkan embed URL dari response
            var embedToken = data.embedToken; // Dapatkan token dari response

            // Panggil fungsi untuk embed report setelah layout diubah
            embedReport(reportId, embedUrl, embedToken);
        })
        .catch(error => {
            console.error('Error fetching embed data:', error);
        });
}

// Fungsi untuk mendeteksi apakah perangkat mobile atau desktop
function isMobileDevice() {
    var userAgent = navigator.userAgent.toLowerCase();
    return /mobile|android|iphone|ipad/.test(userAgent); // Cek apakah perangkat mobile
}

// Fungsi untuk embed Power BI report
function embedReport(reportId, embedUrl, embedToken) {
    var reportContainer = document.getElementById('reportContainer');
    var loadingIndicator = document.getElementById('loading'); // Ambil elemen loading

    // Tampilkan loading GIF dan sembunyikan kontainer laporan
    loadingIndicator.style.display = 'block'; // Tampilkan loading GIF
    reportContainer.style.display = 'none'; // Sembunyikan kontainer laporan

    if (window.powerbi) {
        var models = window['powerbi-client'].models;
        var embedConfig = {
            type: 'report',
            id: reportId,
            embedUrl: embedUrl,
            accessToken: embedToken,
            tokenType: models.TokenType.Embed,
            settings: {
                filterPaneEnabled: false,
                navContentPaneEnabled: true
            }
        };

        // Hapus instance report yang sudah ada sebelumnya untuk menghindari duplikasi
        powerbi.reset(reportContainer);

        // Embed laporan
        powerbi.embed(reportContainer, embedConfig);

        // Tunggu selama 5 detik sebelum menampilkan kontainer laporan
        setTimeout(function() {
            loadingIndicator.style.display = 'none'; // Sembunyikan loading GIF
            reportContainer.style.display = 'block'; // Tampilkan kontainer laporan
        }, 5000); // Tunggu selama 5000 ms (5 detik)
    } else {
        console.error("Power BI client library not loaded. Please ensure it is included correctly.");
    }
}

// Panggil handleLayoutChange saat halaman pertama kali dimuat
handleLayoutChange();

// Gunakan event listener resize untuk mendeteksi perubahan ukuran layar
window.addEventListener('resize', handleLayoutChange);
