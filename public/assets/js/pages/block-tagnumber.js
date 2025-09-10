$(document).ready(function() {
    $('#block_tagnumber').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/block-tagnumber/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'tag_number',name: 'tag_number' },
            { data: 'block_name', name: 'block_name' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    $('#tambahuserForm').on('submit', function (e) {
        e.preventDefault();

        let formData = {
            username: $('#username').val(),
            name: $('#name').val(),
            password: $('#password').val(),
            id_role: $('#id_role').val(),
            departemen: $('#adddepartemen').val(),
            departemen_id: $('#departemen_id').val()
        };

        $.ajax({
            url: '/setting/user/store',
            method: 'POST',
            data: formData,
            success: function (response) {
                if (response.status === 'success') {
                    showSuccessMessage(response.message);
                    location.reload();
                    $('#tambahuser').modal('hide');
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