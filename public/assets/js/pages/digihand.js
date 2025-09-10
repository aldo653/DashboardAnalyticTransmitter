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

    let currentPlantCode = ''; 
    let currentFolderUid = plantRoots[currentPlantCode]; // Set root UID based on plant code
    let deptId = '';
    let currentPath = '';

    loadFiles(currentFolderUid, deptId);

    function loadFiles(parent_uid = '', dept_id = '') {
        $.ajax({
            url: '/digihand/getFiles',
            method: 'GET',
            data: { parent_uid, dept_id },
            success: function (data) {
                console.log(data); 

                // Clear the table first
                filesTable.clear();

                if (!data || !data.files || data.files.length === 0) {
                    filesTable.row.add(['-', 'No files available', '-', '-', '-']).draw();
                    return;
                }

                const filesHtml = renderFiles(data.files);
                filesTable.rows.add($(filesHtml)).draw();

                if (parent_uid !== currentFolderUid) {
                    folderStack.push({ uid: currentFolderUid, path: currentPath });
                    currentFolderUid = parent_uid;
                    $('#backButton, #create-folder, #upload-file, #logs').show();
                } else {
                    currentFolderUid = plantRoots[currentPlantCode];
                    currentPath = '';
                    $('#backButton, #create-folder, #logs').hide();
                }

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

        $('.file-name').off('click').on('click', function () {
            const fileRow = $(this).closest('tr');
            const filePath = fileRow.data('file-path');
            const fileUid = fileRow.data('file-uid');
            const fileName = $(this).text().trim();

            if (filePath && fileUid && fileName) {
                downloadFile(filePath, fileUid, fileName);
            } else {
                console.error("File information is incomplete. Cannot download file.");
            }
        });
    }

    // Download file function
    function downloadFile(path) {
        if (!path) {
            console.error('Invalid path:', path);
            showErrorMessage('Invalid path. Please try again.');
            return;
        }
        console.log("Path:", path);
        window.location.href = `/download?path=${encodeURIComponent(path)}`;
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
                        <a href="#" class="btn btn-outline-danger" data-id="${item.id}" data-path="${item.path}">
                            <i class="ti ti-trash"></i>
                        </a>
                        <button class="btn btn-outline-primary btn-edit-folder" data-id="${item.id}" data-name="${item.name}" data-path="${item.path}">
                            <i class="ti ti-pencil"></i>
                        </button>
                    </td>
                </tr>`;
            } else if (item.type === 'file') {
                const fullFilePath = `${item.full_path}`;
                html += `<tr data-file-uid="${item.uid}" data-file-path="${fullFilePath}">
                    <td>${index++}</td>
                    <td class="file-name" style="cursor: pointer;">
                        <i class="ti ti-file me-2 text-primary" style="font-size:20px;"></i> ${item.name}
                    </td>
                    <td>${item.size || '-'}</td>
                    <td>${item.is_private ? 'Yes' : 'No'}</td>
                    <td>
                        <a href="#" class="btn btn-outline-danger btn-hapus-file" data-id="${item.id}" data-path="${item.path}" data-name="${item.name}">
                            <i class="ti ti-trash"></i>
                        </a>
                        <a href="#" class="btn btn-outline-primary" data-id="${item.id}" data-path="${item.path}">
                            <i class="ti ti-link"></i>
                        </a>
                    </td>
                </tr>`;
            }
        }
        $('#current-path').text(currentPath);
        $('#uploadPath').val(currentPath);
    
        return html;
    }

    $(document).on('click', '#create-folder', function (e) {
        e.preventDefault();
        $('#createFolder').modal('show');
    });

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
        formData.append('path', path + '/' + name.replace(/ /g, '-'));
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
        const path = $('#uploadPath').val(); // Selected path
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
            },
            error: function (xhr) {
                showErrorMessage('An error occurred: ' + xhr.responseJSON.message);
            }
        });
    });

    $(document).on('click', '.btn-hapus-file', function (e) {
        e.preventDefault();

        const fileId = $(this).data('id');
        const filePath = $(this).data('path'); 
        const fileName = $(this).data('name');
        const deleteUrl = `/destroy/file/${fileId}`; 
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
                    deptId = node.id; 
                    loadFiles(deptId, deptId); 
                    console.log('Selected Node ID:', node.id);

                    sessionStorage.setItem('selectedDeptId', node.id);

                    const newUrl = `/digihand?selectedNode=${node.id}`;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                }
            }).treeview("collapseAll", { silent: true });

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

    const urlParams = new URLSearchParams(window.location.search);
    const selectedNodeId = urlParams.get('selectedNode');
    if (selectedNodeId) {
        const node = $("#treeview1").treeview('getNode', selectedNodeId);
        if (node) {
            $("#treeview1").treeview('selectNode', node.nodeId);
            loadFiles(node.nodeId, deptId); 
        }
    }
    let currentNodeId = null;

    $('#treeview1').on('nodeSelected', function (event, node) {
        if (node) {
            currentNodeId = node.id;
            const url = `?selectedNode=${currentNodeId}`;
            window.history.pushState(null, '', url);
        }
    });

    $(document).on('click', '.folder-name', function () {
        const folderUid = $(this).closest('tr').data('folder-uid');
        const parentUid = $(this).closest('tr').data('parent-uid');
        const plant_code = $(this).closest('tr').data('plant-code');
        const selectedFolderPath = $(this).closest('tr').find('.folder-name').data('path');

        $('#uploadPath').val(selectedFolderPath);
        $('#current-path').text(selectedFolderPath);
        $('#uploadFolderUid').val(folderUid);
        $('#uploadParentUid').val(parentUid);
        $('#plantcode').val(plant_code);

        const newUrl = `?selectedNode=${plant_code}&folderUid=${folderUid}`;
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
});