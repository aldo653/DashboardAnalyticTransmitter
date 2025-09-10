$(document).ready(function() {
    $('#role-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/setting/role/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'role',name: 'role' },
            { data: 'path_names', name: 'path_names' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    $(document).on('click', '.btn-editrole', function (e) {
        e.preventDefault();
    
        var roleId = $(this).data('id');   
        var roleName = $(this).data('role'); 
    
        $('#role_id').val(roleId);
        $('#role_name').val(roleName);
    
        $('.permissions-checkbox').prop('checked', false);
    
        $.ajax({
            url: '/role-permissions/' + roleId,
            method: 'GET',
            success: function (response) {
                response.forEach(function (menuId) {
                    $('#permission' + menuId).prop('checked', true);
                });
            },
            error: function () {
                alert('Gagal memuat permissions!');
            }
        });
        $('#editrole').modal('show');
    });

    $('#editRoleForm').on('submit', function (e) {
        e.preventDefault();
        
        var formData = $(this).serialize();  
        
        $.ajax({
            url: '/update-role-permissions',
            method: 'POST',
            data: formData,
            success: function (response) {
                if (response.status === 'success') {
                    showSuccessMessage(response.message);
                    $('#editrole').modal('hide'); 
                    location.reload();
                }
            },
            error: function () {
                showErrorMessage(response.message);
            }
        });
    }); 
});

$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(document).on('click', '.btn-tambahrole', function (e) {
        e.preventDefault();
        $('#role_name').val(''); 
        $('.permissions-checkbox').prop('checked', false); 
        $('#tambahrole').modal('show');
    });

    $('#tambahRoleForm').on('submit', function (e) {
        e.preventDefault();

        var roleName = $('#role_name').val(); 
        var selectedPermissions = [];
        
        // Ambil hanya checkbox yang dicentang
        $('.permissions-checkbox:checked').each(function () {
            selectedPermissions.push($(this).val());
        });

        var formData = {
            role_name: roleName,
            permissions: selectedPermissions
        };

        $.ajax({
            url: '/setting/role/store',
            method: 'POST',
            data: formData,
            success: function (response) {
                if (response.status === 'success') {
                    showSuccessMessage(response.message); 
                    $('#tambahrole').modal('hide'); 
                    location.reload();
                } else {
                    showErrorMessage(response.message); 
                }
            },
            error: function (xhr) {
                var errorMessage = xhr.responseJSON.message || 'Terjadi kesalahan, silakan coba lagi.';
                showErrorMessage(errorMessage);
            }
        });
    });
});
