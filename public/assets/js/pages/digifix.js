$(document).ready(function () {
    const filesTable = $('#filesTable').DataTable({
        paging: true,
        ordering: true,
        info: true,
        searching: true,
        columns: [
            { title: "No" },
            { title: "Name" },
            { title: "Size" },
            { title: "Is Private" },
            { title: "Action" }
        ]
    });

    let folderStack = [];
    const plantRoots = {
        '50095126': 'root1',
        'F002': 'root2',
        '50095128': 'root3',
        '50095129': 'root4',
        '50095127': 'root5',
        '50095130': 'root6',
        '50095131': 'root7'
    };

    let currentPlantCode = ''; // Default plant code
    let currentFolderUid = plantRoots[currentPlantCode]; // Set root UID based on plant code
    let deptId = '';
    let currentPath = '';

    // Load initial files
    loadFiles(currentFolderUid, deptId);

    // Load files function
    function loadFiles(parent_uid = '', dept_id = '') {
        $.ajax({
            url: '/digihand/getFiles',
            method: 'GET',
            data: { parent_uid, dept_id },
            success: function (data) {
                console.log(data); // Debugging response from the server

                // Clear the table first
                filesTable.clear();

                if (!data || !data.files || data.files.length === 0) {
                    filesTable.row.add(['-', 'No files available', '-', '-', '-']).draw();
                    return;
                }

                const filesHtml = renderFiles(data.files);
                filesTable.rows.add($(filesHtml)).draw();

                // Manage folder navigation
                if (parent_uid !== currentFolderUid) {
                    folderStack.push({ uid: currentFolderUid, path: currentPath });
                    currentFolderUid = parent_uid;
                    $('#backButton, #create-folder, #upload-file, #logs').show();
                } else {
                    currentFolderUid = plantRoots[currentPlantCode];
                    currentPath = '';
                    $('#backButton, #create-folder, #logs, #upload-file').show();
                }

                // Attach event handlers for folder and file clicks
                attachFileAndFolderClickHandlers();
            },
            error: function (xhr) {
                console.error('Error loading files:', xhr);
                alert('Failed to load files. Please try again later.');
            }
        });
    }

    function attachFileAndFolderClickHandlers() {
        $('.folder-name').off('click').on('click', function () {
            const folderUid = $(this).closest('tr').data('folder-uid');
            loadFiles(folderUid, deptId);
        });

        $(document).on('click', '.file-name', function () {
            const fileRow = $(this).closest('tr');
            const filePath = fileRow.data('file-path');
            const fileUid = fileRow.data('file-uid');
            const fileName = $(this).text().trim();
            const fileType = fileName.split('.').pop().toLowerCase(); // Mendapatkan ekstensi file
            const fileAlias = fileRow.data('file-alias');

            // downloadFile(filePath, fileAlias);

            if (fileType === 'pdf') {
                // Jika file adalah PDF, panggil fungsi untuk mendapatkan ringkasan dari API AI
                getPdfSummary(filePath, fileUid, fileName, fileAlias);
            } else {
                // Untuk file lain, langsung download
                downloadFile(filePath, fileAlias);
            }
        });
    }

    // Download file function
    function downloadFile(path, alias) {
        if (!path || !alias) {
            console.error('Invalid path or alias:', path, alias);
            showErrorMessage('Invalid path or alias. Please try again.');
            return;
        }

        // Menggabungkan path dan alias
        const fullpath = `${path}/${alias}`; // Menggunakan template literal

        console.log("Full Path:", fullpath);

        // Menggunakan fullpath dalam URL
        window.location.href = `/download?path=${encodeURIComponent(fullpath)}`;
    }

    // Back button handler
    $('#backButton').on('click', function () {
        if (folderStack.length > 0) {
            const previousFolder = folderStack.pop();
            loadFiles(previousFolder.uid, deptId);
            currentFolderUid = previousFolder.uid;
            currentPath = previousFolder.path;
        }

        if (folderStack.length === 0) {
            $('#backButton').hide();
        }
    });

    function renderFiles(data) {
        let html = '';
        let index = 1;

        for (const item of data) {
            if (item.type === 'folder') {
                currentPath = `${item.pathxx}`.
                    currentPath = `${item.pathxx}`.replace('//', '/');

                html += `<tr data-folder-uid="${item.uid}" data-parent-uid="${item.parent_uid}" data-plant-code="${item.plant_code}" data-path="${data.path}">
                    <td>${index++}</td>
                    <td class="folder-name" style="cursor: pointer;">
                        <i class="ti ti-folder me-2 text-primary" style="font-size:20px;"></i> ${item.name}
                    </td>
                    <td>-</td>
                    <td>${item.is_private ? 'Yes' : 'No'}</td>
                    <td>
                        <a href="#" class="btn btn-outline-danger btn-hapus-file" data-id="${item.id}" data-path="${item.path}">
                            <i class="ti ti-trash"></i>
                        </a>
                        <button class="btn btn-outline-primary btn-edit-folder" data-id="${item.id}" data-name="${item.name}" data-path="${item.path}">
                            <i class="ti ti-pencil"></i>
                        </button>
                    </td>
                </tr>`;
            } else if (item.type === 'file') {
                const fullFilePath = `${item.full_path}`;
                const fileSizeMB = item.size ? (item.size / 1048576).toFixed(2) + ' MB' : '-'; // Konversi dari byte ke MB
                html += `<tr data-file-uid="${item.uid}" data-file-path="${fullFilePath}" data-file-alias="${item.alias_name}">
                    <td>${index++}</td>
                    <td class="file-name" style="cursor: pointer;">
                        <i class="ti ti-file me-2 text-primary" style="font-size:20px;"></i> ${item.name}
                    </td>
                    <td>${fileSizeMB}</td> <!-- Menampilkan ukuran dalam MB -->
                    <td>${item.is_private ? 'Yes' : 'No'}</td>
                    <td>
                        <a href="#" class="btn btn-outline-danger btn-hapus-file" data-id="${item.id}" data-path="${item.path}" data-name="${item.name}">
                            <i class="ti ti-trash"></i>
                        </a>
                        <a href="#" class="btn btn-outline-primary btn-share" data-id="${item.uid}" data-path="${item.path}">
                            <i class="ti ti-link"></i>
                        </a>
                    </td>
                </tr>`;
            }
        }
        $('#current-path').text(currentPath);
        $('#uploadPath').text(currentPath);

        return html;
    }

    $(document).on('click', '#create-folder', function (e) {
        e.preventDefault();
        $('#createFolder').modal('show');
    });

    $(document).on('click', '#logs', function (e) {
        e.preventDefault();
        const plant_code = $('#plantcode').val(); // Mengambil ID plant_code
        $('#logsAct').modal('show');

        // Panggil fungsi untuk memuat log dengan AJAX
        loadLogs(plant_code, 1); // Muat halaman 1 saat modal ditampilkan
    });

    function loadLogs(plant_code, page) {
        $.ajax({
            url: '/log-activity',
            type: 'GET',
            data: {
                plant_code: plant_code,
                page: page
            },
            success: function (response) {
                // Render data log ke dalam timeline
                let timeline = $('.main-timeline-5'); timeline.empty(); // Kosongkan timeline sebelum diisi ulang

                response.data.forEach(function (log) {
                    timeline.append(`
                        <div class="timeline-5 right-5">
                            <div class="card">
                                <div class="card-body p-4">
                                    <h5>${log.message}</h5>
                                    <span class="small text-muted"><i class="fas fa-clock me-1"></i>${new Date(log.created_at).toLocaleString()}</span>
                                    <p class="mt-2 mb-0">${log.path}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });

                // Render pagination
                renderPagination(response);
            },
            error: function () {
                alert('Gagal memuat data log.');
            }
        });
    }

    function renderPagination(response) {
        let paginationContainer = $('#paginationContainer');
        paginationContainer.empty(); // Kosongkan pagination sebelum diisi ulang

        if (response.last_page > 1) {
            // Membuat elemen nav dan ul untuk pagination
            let paginationHtml = `
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <a class="page-link" href="#" data-page="${response.current_page - 1}" ${response.current_page === 1 ? 'disabled' : ''}>Previous</a>
                        </li>
            `;

            // Membuat tombol untuk setiap halaman
            for (let i = 1; i <= response.last_page; i++) {
                paginationHtml += `
                    <li class="page-item ${response.current_page === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            }

            // Menambahkan tombol Next
            paginationHtml += `
                        <li class="page-item">
                            <a class="page-link" href="#" data-page="${response.current_page + 1}" ${response.current_page === response.last_page ? 'disabled' : ''}>Next</a>
                        </li>
                    </ul>
                </nav>
            `;

            // Menambahkan HTML pagination ke container
            paginationContainer.append(paginationHtml);

            // Event handler untuk pagination button
            $('.page-link').on('click', function (event) {
                event.preventDefault(); // Mencegah aksi default dari anchor
                const page = $(this).data('page');
                const plant_code = $('#plantcode').val(); // Ambil plant_code lagi
                if (page > 0 && page <= response.last_page) {
                    loadLogs(plant_code, page);
                }
            });
        }
    }

    $('#createFolder').on('submit', function (e) {
        e.preventDefault();

        const name = $('#addname').val();
        const private = $('#private').val(); // Ensure there's an element with ID 'private'
        const path = $('#uploadPath').val(); // Selected path
        const parent_uid = $('#uploadFolderUid').val();
        const plant_code = $('#plantcode').val();

        // Check if a file has been selected
        if (!file) {
            showErrorMessage('Please select a file to upload!');
            return;
        }

        // Send data with AJAX
        const formData = new FormData();
        formData.append('name', name);
        formData.append('path', path);
        formData.append('private', private);
        formData.append('parent_uid', parent_uid);
        formData.append('plantcode', plant_code);
        formData.append('type', 'folder');
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        // Debugging: Log FormData contents
        for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        $.ajax({
            url: '/digihand/upload-file',  // Endpoint for upload
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

    // Event listener for edit button
    $(document).on('click', '.btn-edit-folder', function (e) {
        e.preventDefault();

        const id = $(this).data('id');
        const name = $(this).data('name');
        const path = $(this).data('path');

        $('#id').val(id);
        $('#name').val(name);
        $('#path').val(path);

        $('#editFile').modal('show');
    });

    $(document).on('click', '.btn-share', function (e) {
        e.preventDefault();
        let uid = $(this).data('id'); // Ambil UID dari tombol
        let baseUrl = window.location.origin; // Ambil URL dasar

        // Set URL ke input di modal
        $('#name').val(`${baseUrl}/show/files/${uid}`);
        $('#id').val(uid); // Jika ingin menyimpan ID untuk keperluan lain

        $('#shareFiles').modal('show');
    });

    // Event handler untuk tombol "Salin Link"
    $(document).on('click', '.btn-salin-link', function () {
        let urlToCopy = $('#name').val(); // Ambil URL dari input
        navigator.clipboard.writeText(urlToCopy).then(() => {
            // Tampilkan SweetAlert setelah berhasil menyalin
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Link telah disalin ke clipboard.',
                confirmButtonText: 'OK'
            });
        }).catch(err => {
            console.error('Gagal menyalin: ', err);
        });
    });

    // Event submit for edit folder form
    $('#editfolderForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#id').val();
        const name = $('#name').val();

        // Send data using AJAX
        $.ajax({
            url: '/digihand/update-folder', // URL endpoint update
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

    $(document).on('click', '#upload-file', function (e) {
        e.preventDefault();
        $('#uploadFiles').modal('show');
    });

    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();

        const name = $('#private').val(); // Ensure there's an element with ID 'private'
        // const path = $('#uploadPath').val(); // Selected path
        const file = $('#file')[0].files[0]; // Selected file
        const parent_uid = $('#uploadFolderUid').val();
        const plant_code = $('#plantcode').val();

        // Check if a file has been selected
        if (!file) {
            showErrorMessage('Please select a file to upload!');
            return;
        }

        // Send data with AJAX
        const formData = new FormData();
        formData.append('file', file); // Field name must be 'file'
        formData.append('path', path);
        formData.append('private', name);
        formData.append('parent_uid', parent_uid);
        formData.append('plantcode', plant_code);
        formData.append('type', 'file');
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        // Debugging: Log FormData contents
        for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        $.ajax({
            url: '/digihand/upload-file',  // Endpoint for upload
            type: 'POST',
            data: formData,
            contentType: false, // Do not set contentType automatically
            processData: false, // Do not process data automatically
            success: function (response) {
                showSuccessMessage('File uploaded successfully!');
                loadFiles(currentFolderUid, deptId); // Refresh data table
                location.reload();
            },
            error: function (xhr) {
                showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
            }
        });
    });

    $(document).on('click', '.btn-hapus-file', function (e) {
        e.preventDefault(); // Prevent the default anchor click behavior

        const fileId = $(this).data('id');
        const filePath = $(this).data('path'); // Optional, if you need the path
        const fileName = $(this).data('name');

        // Construct the URL for deletion
        const deleteUrl = `/destroy/file/${fileId}`; // Update with your actual route

        // Call the confirmDelete function
        confirmDelete(deleteUrl, fileId);
    });

    // Fetch tree data
    fetch('/api/tree-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(defaultData => {
            $("#treeview1").treeview({
                selectedBackColor: "#03a9f3",
                onhoverColor: "rgba(0, 0, 0, 0.05)",
                expandIcon: "ti ti-plus",
                collapseIcon: "ti ti-minus",
                nodeIcon: "ti ti-folder",
                data: defaultData,
                onNodeSelected: function (event, node) {
                    deptId = node.id; // Save dept_id
                    loadFiles(deptId, deptId); // Update table with deptId

                    // Log the selected node ID to the console
                    console.log('Selected Node ID:', node.id);

                    // Store the selected node ID in session storage
                    sessionStorage.setItem('selectedDeptId', node.id);

                    // Set #plantcode with the selected node's id
                    $('#plantcode').val(node.id); // Set plant code from the selected node

                    // Update the URL with the selected node ID
                    const newUrl = `/digihand?selectedNode=${node.id}`;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                }
            }).treeview("collapseAll", { silent: true });

            // Initialize second treeview
            $("#treeview2").treeview({
                levels: 1,
                selectedBackColor: "#03a9f3",
                onhoverColor: "rgba(0, 0, 0, 0.05)",
                expandIcon: "ti ti-plus",
                collapseIcon: "ti ti-minus",
                nodeIcon: "fa fa-folder",
                data: defaultData,
            }).treeview("collapseAll", { silent: true });
        })
        .catch(error => console.error('Error fetching tree data:', error));

    // Restore selected node from URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const selectedNodeId = urlParams.get('selectedNode');
    if (selectedNodeId) {
        const node = $("#treeview1").treeview('getNode', selectedNodeId);
        if (node) {
            $("#treeview1").treeview('selectNode', node.nodeId);
            loadFiles(node.nodeId, deptId); // Load files for the selected node
        }
    }

    // Update the URL when a node is selected
    // Assuming you have a variable to hold the currently selected node ID
    let currentNodeId = null;

    // Update the URL when a node is selected in the tree view
    $('#treeview1').on('nodeSelected', function (event, node) {
        if (node) {
            currentNodeId = node.id; // Store the current node ID
            const url = `?selectedNode=${currentNodeId}`;
            window.history.pushState(null, '', url);

            // Set plant code from the selected node
            $('#plantcode').val(currentNodeId); // Set plant code to the node id
        }
    });

    // Handle folder clicks (no need to set plantcode here anymore)
    $(document).on('click', '.folder-name', function () {
        const folderUid = $(this).closest('tr').data('folder-uid');
        const parentUid = $(this).closest('tr').data('parent-uid');
        const selectedFolderPath = $(this).closest('tr').find('.folder-name').data('path');

        $('#uploadPath').val(selectedFolderPath);
        $('#current-path').text(selectedFolderPath);
        $('#uploadFolderUid').val(folderUid);
        $('#uploadParentUid').val(parentUid);

        const newUrl = `?selectedNode=${currentNodeId}&folderUid=${folderUid}`;
        window.history.pushState(null, '', newUrl);

        // Optionally, load the contents of the selected folder
        loadFolderContents(folderUid);
    });

    // Function to load folder contents based on UID
    function loadFolderContents(folderUid) {
        // Logic to load and display folder contents
        console.log('Loading contents for folder UID:', folderUid);
        // You can add your AJAX call or any other logic here to load the folder contents
    }

    let isRequestInProgress = false; // Flag untuk melacak status permintaan

    function getPdfSummary(filePath, fileUid, fileName, fileAlias) {
        const fullpath = `${filePath}/${fileAlias}`;
    
        if (isRequestInProgress) {
            console.log('Request is already in progress. Please wait.');
            return;
        }
    
        isRequestInProgress = true;
    
        // Tampilkan modal dan loading
        $('#loading').show(); // Tampilkan loading
        $('#aiSummary').hide(); // Sembunyikan ringkasan
        $('#pdfSummaryModal').modal('show'); // Tampilkan modal
    
        $.ajax({
            url: '/digihand/get-pdf-summary',
            method: 'POST',
            data: {
                path: fullpath,
                uid: fileUid,
                alias: fileAlias,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.summary) {
                    const formattedSummary = formatSummary(response.summary);
                    $('#aiSummary').html(formattedSummary);
                    $('#downloadButton').data('file-path', filePath);
                    $('#downloadButton').data('file-name', fileAlias);
    
                    // Sembunyikan loading dan tampilkan ringkasan
                    $('#loading').hide();
                    $('#aiSummary').show();
    
                    // Mengatur event listener untuk tombol download
                    $('#downloadButton').off('click').on('click', function () {
                        downloadFile(filePath, fileAlias);
                    });
                } else {
                    alert('No summary available for this PDF.');
                    $('#loading').hide(); // Sembunyikan loading jika tidak ada ringkasan
                }
            },
            error: function (xhr) {
                console.error('Error fetching PDF summary:', xhr);
                alert('Failed to fetch PDF summary. Please try again later.');
                $('#loading').hide(); // Sembunyikan loading jika terjadi error
            },
            complete: function () {
                isRequestInProgress = false; // Reset flag permintaan
            }
        });
    }

    function formatSummary(summary) {
        // Pertama, ganti `\n` dengan <br> untuk baris baru
        let formatted = summary.replace(/\n/g, '<br>');

        // Ganti teks yang dibungkus dengan ** menjadi <strong> untuk bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Ganti dua kali <br> dengan <br><br> untuk pemisahan bagian
        formatted = formatted.replace(/(<br>){2,}/g, '<br><br>');

        return formatted;
    }

});