$(document).ready(function() {
    $('#permission-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/setting/permission/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'path_name',name: 'path_name' },
            { data: 'category', name: 'category' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    $(document).on('click', '.btn-hapuspermission', function(e) {
        e.preventDefault(); 
        var id = $(this).data('id');
        var url = '/setting/destroy/permission';
        confirmDelete(url, id);
    });

    $(document).ready(function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        $(document).on('click', '#btn-tambahpermission', function (e) {
            e.preventDefault();
            $('#tambahpermission').modal('show'); 
        });
    
        $('#tambahpermissionForm').on('submit', function (e) {
            e.preventDefault();
    
            let formData = {
                path_name: $('#path_name').val(),
                path: $('#path').val(),
                params: $('#params').val(),
                sequence: $('#sequence').val(),
                parent_uuid: $('#parent_uuid').val(),
                level: $('#level').val()
            };
    
            $.ajax({
                url: '/setting/permission/store', 
                method: 'POST',
                data: formData,
                success: function (response) {
                    if (response.status === 'success') {
                        showSuccessMessage(response.message);
                        location.reload();
                        $('#tambahpermission').modal('hide'); 
                    } else {
                        showErrorMessage(response.message);
                    }
                },
                error: function (xhr) {
                    let errorMessage = 'Something went wrong! Please try again.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message; 
                    }
                    showErrorMessage(errorMessage);
                }
            });
        });
    });
});
