// $.ajax({
//     url: `http://localhost:8001`,
//     method: 'GET',
//     success: function (response) {
//         console.log(response);
        
//         // const { name, path } = response; // Pastikan response mengandung 'name' dan 'path'
//         // console.log('Response Name:', name);
//         // console.log('Response Path:', path);

//         // // Panggil fungsi displayImageFromWebDAV
//         // displayImageFrom(name, path);
//     },
//     error: function (xhr, status, error) {
//         // console.error('Error fetching data:', error);
//         // alert('Gagal mengambil data. Silakan coba lagi nanti.');
//     }
// });


function fetchNamePathAndDisplay(uid) {
    console.log(uid);
    
   
    $.ajax({
        url: `/performance/getdata/${uid}`,
        method: 'GET',
        success: function (response) {
            const { name, path } = response; // Pastikan response mengandung 'name' dan 'path'
            console.log('Response Name:', name);
            console.log('Response Path:', path);

            // Panggil fungsi displayImageFromWebDAV
            displayImageFrom(name, path);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
            alert('Gagal mengambil data. Silakan coba lagi nanti.');
        }
    });
}


function displayImageFrom(fileName, filePath) {
    $.ajax({
        url: '/performance/get-file-from-drivex',
        method: 'GET',
        data: { path: filePath },
        xhrFields: {
            responseType: 'blob'  // Terima respons sebagai blob
        },
        success: function (blob) {
            // Cek apakah #imageCard ada
            if ($('#imageCard').length === 0) {
                console.error("Element #imageCard tidak ditemukan.");
                return;
            }

            // Atur isi #imageCard
            $('#imageCard').html(`
                <div class="card">
                    <div class="card-body">
                        <img id="image" alt="${fileName}" class="img-fluid" />
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-secondary" id="backToTable">Back</button>
                    </div>
                </div>
            `).hide().slideDown(500); // Animasi muncul dengan efek slide

            // Buat URL objek dari blob dan atur sebagai sumber gambar
            const imageUrl = URL.createObjectURL(blob);
            $('#image').attr('src', imageUrl);

            // Scroll ke #imageCard setelah animasi selesai
            $('html, body').animate({
                scrollTop: $("#imageCard").offset().top
            }, 500); // Durasi scroll 500ms

            // Handle tombol kembali ke tabel
            $('#backToTable').on('click', function () {
                $('#imageCard').slideUp(500); // Hilangkan imageCard dengan efek slide
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching file:', error);
            alert('Gagal memuat file. Silakan coba lagi nanti.');
        }
    });
}

$(document).ready(function () {
    const dataTable = $('#dcsfile').DataTable({
        paging: true,
        ordering: true,
        info: true,
        searching: true
    });

    let folderHistory = []; // Menyimpan UID folder yang telah dibuka
    loadFolderStructure('#'); // Muat root folder

    function loadFolderStructure(parent_uid = '') {
        $.ajax({
            url: '/performance/dcs-file',
            method: 'GET',
            data: { parent_uid: parent_uid },
            success: function (data) {
                console.log("Data received from server:", data);

                if (!data || !data.dcs || data.dcs.length === 0) {
                    console.error('Data structure is invalid or empty');
                    dataTable.clear().draw();
                    dataTable.row.add(['-', 'No data available', '-', '-']).draw();
                    return;
                }

                // Clear and add new data to DataTable without destroying it
                const folderHtml = renderFolderStructure(data.dcs);
                dataTable.clear().rows.add($(folderHtml)).draw();

                // Update tombol back visibility
                updateBackButtonVisibility();

                // Bind ulang event klik untuk folder dan file
                attachFolderClickEvent();
            },
            error: function (xhr, status, error) {
                console.error('Error loading folder structure:', error);
                alert('Gagal memuat struktur folder. Silakan coba lagi nanti.');
            }
        });
    }

    function attachFolderClickEvent() {
        $('#dcsfile tbody').off('click', '.folder-name').on('click', '.folder-name', function () {
            const folderUid = $(this).closest('tr').data('folder-uid');
            const folderPath = $(this).text().trim(); // Ambil nama folder untuk ditampilkan
    
            if (folderUid) {
                folderHistory.push(folderUid);
                sessionStorage.setItem('folderPath', folderPath); // Simpan path di session storage
    
                // Perbarui nilai elemen #folderpath dengan folderUid yang dipilih
                $('#folderpath').val(folderUid);  // Pastikan elemen ini memiliki nilai UID yang benar
                $('#folderpath').text(folderPath); // Tampilkan nama folder di elemen
    
                loadFolderStructure(folderUid);
            } else {
                console.error("Folder UID is undefined or empty.");
            }
        });

        $('#dcsfile tbody').off('click', '.file-name').on('click', '.file-name', function () {
            const fileName = $(this).text().trim(); // Ambil nama file
            const filePath = $(this).closest('tr').data('file-path'); // Ambil path dari atribut data
            
            // Debugging untuk memastikan nilai filePath benar
            console.log('File clicked:', fileName, filePath);
            displayImageFromWebDAV(fileName, filePath); // Tampilkan gambar
        });

    }    

    // Menampilkan path folder terakhir saat reload halaman
    if (sessionStorage.getItem('folderPath')) {
        $('#folderpath').text(sessionStorage.getItem('folderPath'));
    }

    function renderFolderStructure(data) {
        let html = '';
        let index = 1;

        for (const item of data) {
            if (item.type === 'file') {
                html += `<tr data-file-path="${item.path}"> <!-- Menyimpan path file dalam atribut data -->
                    <td>${index++}</td>
                    <td class="file-name" style="cursor: pointer;">
                        <i class="ti ti-file me-2 text-primary" style="font-size:20px;"></i> ${item.name}
                    </td>
                    <td>${item.real_name}</td>
                    <td class="text-center">
                        <a href="#" class="btn btn-outline-danger btn-deletedcs" data-id="${item.id || ''}">
                            <i class="ti ti-trash"></i>
                        </a>
                        <a href="#" class="btn btn-outline-primary btn-edit" data-id="${item.id || ''}">
                            <i class="ti ti-pencil"></i>
                        </a>
                        <a href="#" class="btn btn-outline-success btn-replace" data-uid="${item.uid || ''}">
                            <i class="ti ti-file-pencil"></i>
                        </a>
                    </td>
                </tr>`;
            } else if (item.type === 'folder') {
                html += `<tr class="folder-row" data-folder-name="${item.name}" data-folder-uid="${item.uid}">
                    <td>${index++}</td>
                    <td class="folder-name" style="cursor: pointer;">
                        <i class="ti ti-folder me-2 text-primary" style="font-size:20px;"></i> ${item.name}
                    </td>
                    <td>${item.real_name}</td>
                    <td class="text-center">
                        <a href="#" class="btn btn-outline-primary btn-edit" data-id="${item.id || ''}">
                            <i class="ti ti-pencil"></i>
                        </a>
                    </td>
                </tr>`;
            }
        }
        return html;
    }

    function displayImageFromWebDAV(fileName, filePath) {
        const path = filePath; // Ambil path dari file
        $.ajax({
            url: '/performance/get-file-from-drivex',
            method: 'GET',
            data: { path: path },
            xhrFields: {
                responseType: 'blob'  // Terima respons sebagai blob
            },
            success: function (blob) {
                // Cek apakah #imageCard ada
                if ($('#imageCard').length === 0) {
                    console.error("Element #imageCard tidak ditemukan.");
                    return;
                }

                // Atur isi #imageCard
                $('#imageCard').html(`
                    <div class="card">
                        <div class="card-body">
                            <img id="image" alt="${fileName}" class="img-fluid" />
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-secondary" id="backToTable">Back</button>
                        </div>
                    </div>
                `).hide().slideDown(500); // Animasi muncul dengan efek slide

                // Buat URL objek dari blob dan atur sebagai sumber gambar
                const imageUrl = URL.createObjectURL(blob);
                $('#image').attr('src', imageUrl);

                // Scroll ke #imageCard setelah animasi selesai
                $('html, body').animate({
                    scrollTop: $("#imageCard").offset().top
                }, 500); // Durasi scroll 500ms

                // Handle tombol kembali ke tabel
                $('#backToTable').on('click', function () {
                    $('#imageCard').slideUp(500); // Hilangkan imageCard dengan efek slide
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching file:', error);
                alert('Gagal memuat file. Silakan coba lagi nanti.');
            }
        });
    }

    function display_dcs(fileName, filePath) {
        const path = filePath;
    
        // Tampilkan SweetAlert sebagai loading
        Swal.fire({
            title: 'Loading...',
            html: '<img src="' + loadingGifUrl + '" alt="Loading..." style="width: 150px;"/>',
            showConfirmButton: false,
            allowOutsideClick: false,
        });
    
        $.ajax({
            url: '/performance/get-file-from-drivex',
            method: 'GET',
            data: { path: path },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (blob) {
                if ($('#dcs_content').length === 0) {
                    console.error("Element #dcs_content tidak ditemukan.");
                    return;
                }
    
                // Buat URL objek dari blob dan atur sebagai sumber gambar
                const imageUrl = URL.createObjectURL(blob);
    
                // Tentukan posisi dan jumlah tombol berdasarkan fileName
                let buttonsHtml = '';
                switch (fileName) {
                    case 'Ammonia_P1B':
                        buttonsHtml = `
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('a269ae75-4969-453a-adfa-b209bd12efb4')" style="top: 13.2%; left: 10.5%; width: 8.8%; height: 7.5%;">AIR COMPR</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('e3cbe5a2-c9fd-48b6-85fd-47c637c1718f')" style="top: 22.6%; left: 10.5%; width: 20.2%; height: 7.5%;">FEED TREATING</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('08e56195-1955-4b23-9adf-54471460c2d2')" style="top: 22.6%; left: 33.7%; width: 9%; height: 7.5%;">PRIMARY REFORMER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('cb5c8d1c-ea37-4be4-bd65-0d17c8d6dce7')" style="top: 22.6%; left: 51%; width: 9%; height: 7.5%;">SECONDARY REFORMER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('cb5c8d1c-ea37-4be4-bd65-0d17c8d6dce7')" style="top: 36.8%; left: 51%; width: 9%; height: 7.5%;">WASTE HEAR BOILER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('5c61a03d-bac2-4869-b345-23d472c89da7')" style="top: 22.6%; left: 70.2%; width: 9%; height: 22%;">SHIFT CONVERTER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('3fa7cde4-0919-4310-98e7-408928535074')" style="top: 22.6%; left: 84.8%; width: 9%; height: 22%;">CO2 REMOVAL</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('36afe285-9eb9-46b6-a857-fd46697be4d4')" style="top: 42.5%; left: 0%; width: 9%; height: 7.5%;">STEAM SYSTEM</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('51744ed7-0c2b-4488-904c-3b7c84f9d490')" style="top: 57.5%; left: 0%; width: 9%; height: 7.5%;">BFW SYSTEM</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('54565484-4145-4dc5-ba8a-7184463c530b')" style="top: 61.8%; left: 63%; width: 9%; height: 7.5%;">PURGE GAS RECOVERY</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('eba359b7-78f8-4f32-b350-9f0b38d569ba')" style="top: 74%; left: 63%; width: 9%; height: 7.5%;">SYNTESIS LOOP</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('ea73cccf-2bc2-49c3-9a59-3d48a90ebb3f')" style="top: 74%; left: 85.8%; width: 9%; height: 7.5%;">AMMONIA CONVERTER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('b0004862-9e83-4172-8862-6cf87baac930')" style="top: 86.2%; left: 63%; width: 9%; height: 7.5%;">REFRIGERANT LOOP</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('ad3d7f9e-e861-4e3a-ba3c-a6e687262f36')" style="top: 74%; left: 51.7%; width: 9%; height: 7.5%;">SYNGAS COMPR</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('68bae352-3e4f-4cd8-9385-ac5f99569124)" style="top: 74%; left: 29.3%; width: 9%; height: 7.5%;">SYNGAS DRYER</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('e6b464c3-e573-46c2-8c34-4d42b6bf2de3')" style="top: 74%; left: 17.8%; width: 9%; height: 7.5%;">METHANATOR</button>
                        `;  
                        break;
                    case 'Urea_P1B':
                        buttonsHtml = `
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('4637c192-204b-4994-b669-e46a75cac5a2')" style="top: 30%; left: 64.3%; width: 9.7%; height: 17%;">PRILLING SECTION</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('80d9d5ab-5370-4488-8913-57f7d3a068ce')" style="top: 30%; left: 50%; width: 9.7%; height: 17%;">CONSENTRATION SECTION</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('384a02b3-f7b7-46ea-8f26-357ddc2acc68')" style="top: 30%; left: 33%; width: 9.7%; height: 17%;">PURIFICATION SECTION</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('daf49f32-0377-4e72-b70c-3da72c93db9e')" style="top: 30%; left: 16.8%; width: 9.7%; height: 17%;">SYNTESIS SECTION</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('77dd754f-456d-4463-ae46-f06a7da5cda7')" style="top: 59.5%; left: 31%; width: 9.7%; height: 17%;">RECOVERY SECTION</button>
                            <button class="btn-dcs" onclick="fetchNamePathAndDisplay('fd9a2b32-2d9a-4c18-b686-6387138518e9')" style="top: 58%; left: 47%; width: 9.7%; height: 17%;">PROCESS COND. TREATMENT SECTION</button>
                        `;
                        break;
                    default:
                        buttonsHtml = ''; // Tidak ada tombol untuk gambar lainnya
                        break;
                }
    
                $('#dcs_content').html(`
                    <div class="image-container">
                        <img id="image_dcs" src="${imageUrl}" alt="${fileName}" class="img-fluid" />
                        <div class="button-overlay">
                            ${buttonsHtml}
                        </div>
                    </div>
                `).hide().slideDown(500);
    
                // Scroll ke #dcs_content setelah animasi selesai
                $('html, body').animate({
                    scrollTop: $("#dcs_content").offset().top
                }, 500);
    
                // Tutup SweetAlert setelah gambar dimuat
                Swal.close();
            },
            error: function (xhr, status, error) {
                console.error('Error fetching file:', error);
                alert('Gagal memuat file. Silakan coba lagi nanti.');
                Swal.close();
            }
        });
    }   
        
    function setActiveButton(buttonId) {
        $('.btn-outline-primary').removeClass('active'); // Hapus kelas aktif dari semua tombol
        $('#' + buttonId).addClass('active'); // Tambahkan kelas aktif ke tombol yang dipilih
        if (buttonId !== 'npk') {
            $('#npkview').hide(); // Sembunyikan kartu NPK jika tombol lain dipilih
        }
    }
    
    // Fungsi untuk menampilkan konten berdasarkan tombol aktif
    function showActiveContent() {
        const activeButton = $('.btn-outline-primary.active'); // Cari tombol yang aktif
        if (activeButton.length > 0) {
            const buttonId = activeButton.attr('id'); // Ambil ID tombol yang aktif
            switch (buttonId) {
                case 'ammonia':
                    display_dcs('Ammonia_P1B', 'dcs/DIAGRAM_PROSES_AMMONIA_P1B.png');
                    break;
                case 'urea':
                    display_dcs('Urea_P1B', 'dcs/DIAGRAM_PROSES_UREA_P1B.png');
                    break;
                case 'npk':
                    $('#dcs_content').hide(); // Kosongkan atau sembunyikan dcs_content
                    break;
            }
        }
    }
    
    // Event listeners for buttons
    $('#ammonia').on('click', function() {
        setActiveButton('ammonia'); // Set tombol Ammonia aktif
        $('#npkview').hide();
        display_dcs('Ammonia_P1B', 'dcs/DIAGRAM_PROSES_AMMONIA_P1B.png');
    });
    
    $('#urea').on('click', function() {
        setActiveButton('urea'); // Set tombol Urea aktif
        $('#npkview').hide();
        display_dcs('Urea_P1B', 'dcs/DIAGRAM_PROSES_UREA_P1B.png');
    });
    
    $('#npk').on('click', function() {
        setActiveButton('npk'); // Set tombol NPK aktif
        $('#npkview').show();
        $('#dcs_content').hide(); // Kosongkan atau sembunyikan dcs_content
    });
    
    // Ketika halaman dimuat, tampilkan konten berdasarkan tombol yang aktif
    $(document).ready(function() {
        showActiveContent(); // Tampilkan konten berdasarkan tombol yang aktif
    });

    // Fungsi untuk update visibility tombol back
    function updateBackButtonVisibility() {
        if (folderHistory.length > 0) {
            $('#backButtonContainer').show();
        } else {
            $('#backButtonContainer').hide();
        }
    }

    // Event handler tombol back
    $('#backButton').on('click', function () {
        folderHistory.pop(); // Keluarkan folder terakhir dari history
        const previousFolderUid = folderHistory.length > 0 ? folderHistory[folderHistory.length - 1] : '#';
        loadFolderStructure(previousFolderUid); // Kembali ke folder sebelumnya
    });

    $(document).on('click', '.btn-edit', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        const name = $(this).data('name');
        $('#id').val(id);
        $('#name').val(name);
        $('#editNameFile').modal('show');
    });

    $('#editNameFile').on('submit', function (e) {
        e.preventDefault();

        const id = $('#id').val();
        const name = $('#name').val();

        // Send data using AJAX
        $.ajax({
            url: '/performance/update-name', // URL endpoint update
            type: 'PUT',
            data: {
                id: id,
                name: name,
                _token: $('meta[name="csrf-token"]').attr('content') // Add CSRF token
            },
            success: function (response) {
                showSuccessMessage(response.message); // Show success alert
                $('#editFile').modal('hide'); // Close modal
                loadFiles(currentFolderUid, deptId); // Refresh data table
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    // Show validation errors
                    const errors = xhr.responseJSON.errors;
                    let errorMessage = '';
                    for (const field in errors) {
                        errorMessage += errors[field][0] + '\n';
                    }
                    showErrorMessage('Error:\n' + errorMessage);
                } else {
                    showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
                }
            }
        });
    });

    $(document).on('click', '#create-folder', function (e) {
        e.preventDefault();
        $('#createFolderdcs').modal('show');
    });

    $('#createFolders').on('submit', function (e) {
        e.preventDefault();

        const name = $('#addname').val();
        const private = $('#private').val();
        const parent_uid = $('#folderpath').val();

        // Check if a file has been selected
        if (!file) {
            showErrorMessage('Please select a file to upload!');
            return;
        }

        // Send data with AJAX
        const formData = new FormData();
        formData.append('name', name);
        formData.append('private', private);
        formData.append('parent_uid', parent_uid);
        formData.append('type', 'folder');
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        // Debugging: Log FormData contents
        for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        $.ajax({
            url: '/performance/create-type/dcs',  // Endpoint for upload
            type: 'POST',
            data: formData,
            contentType: false, // Do not set contentType automatically
            processData: false, // Do not process data automatically
            success: function (response) {
                showSuccessMessage('Folder created successfully!');
                location.reload();
                loadFiles(currentFolderUid, deptId); // Refresh data table
            },
            error: function (xhr) {
                showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
            }
        });
    });

    $(document).on('click', '#upload-file', function (e) {
        e.preventDefault();
        $('#uploaddcsfiles').modal('show');
    });

    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();
    
        const private = $('#private').val();
        const file = $('#file')[0].files[0];
        const parent_uid = $('#folderpath').val();
        const name = $('#uploadname').val();
        
        // Default path jika `parent_uid` kosong
        let path = parent_uid ? '' : 'dcs';
    
        // Debugging: Menampilkan variabel `path` di konsol
        console.log('Path:', path);
    
        if (!file) {
            showErrorMessage('Please select a file to upload!');
            return;
        }
    
        // Membuat objek FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);
        formData.append('private', private);
        formData.append('parent_uid', parent_uid);
        formData.append('path', path); // Kirim `path` ke backend
        formData.append('type', 'file');
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
    
        // Debugging: Log FormData contents
        for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
    
        // Mengirim permintaan AJAX
        $.ajax({
            url: '/performance/create-type/dcs',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                showSuccessMessage('File uploaded successfully!');
                location.reload();
                loadFiles(currentFolderUid, deptId); // Muat ulang data
            },
            error: function (xhr) {
                showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
            }
        });
    });

    $(document).on('click', '.btn-deletedcs', function (e) {
        e.preventDefault(); // Prevent the default anchor click behavior

        const fileId = $(this).data('id');
        const filePath = $(this).data('path'); // Optional, if you need the path
        const fileName = $(this).data('name');

        // Construct the URL for deletion
        const deleteUrl = `/performance/delete/dcsfile/${fileId}`; // Update with your actual route

        // Call the confirmDelete function
        confirmDelete(deleteUrl, fileId);
    });

    $(document).on('click', '.btn-replace', function (e) {
        e.preventDefault();
        const uid = $(this).data('uid');
        $('#uid').val(uid);
        $('#replacemodal').modal('show');
    });
    
    $('#replacemodal').on('submit', function (e) {
        e.preventDefault();
    
        const uid = $('#uid').val();
        const fileInput = $('#replacefile')[0]; // Mengambil input file
    
        if (fileInput.files.length === 0) {
            showErrorMessage('Silakan pilih file untuk diupload.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', fileInput.files[0]); // Menambahkan file ke FormData
        formData.append('uid', uid); // Menambahkan UID ke FormData
    
        // Send data using AJAX
        $.ajax({
            url: `/performance/replace/dcs/${uid}`, // URL endpoint update
            type: 'POST',
            data: formData,
            processData: false, // Prevent jQuery from automatically transforming the data into a query string
            contentType: false, // Set content type to false to let jQuery set it correctly
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // Add CSRF token
            },
            success: function (response) {
                showSuccessMessage(response.message); // Show success alert
                $('#replacemodal').modal('hide'); // Close modal
                loadFiles(currentFolderUid, deptId); // Refresh data table
                location.reload();
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    // Show validation errors
                    const errors = xhr.responseJSON.errors;
                    let errorMessage = '';
                    for (const field in errors) {
                        errorMessage += errors[field][0] + '\n';
                    }
                    showErrorMessage('Error:\n' + errorMessage);
                } else {
                    showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
                }
            }
        });
    });
});