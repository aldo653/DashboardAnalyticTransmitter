$(document).ready(function () {
    $('#users-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/setting/user/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'name', name: 'name' },
            { data: 'username', name: 'username' },
            { data: 'role', name: 'role' },
            { data: 'departemen', name: 'departemen' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    $(document).on('click', '.btn-edituser', function (e) {
        e.preventDefault();

        var id = $(this).data('id');
        var name = $(this).data('name');
        var username = $(this).data('username');
        var departemen = $(this).data('departemen');
        var idrole = $(this).data('idrole');

        $('#role').val(idrole);
        $('#viewname').val(name);
        $('#viewusername').val(username);
        $('#departemen').val(departemen);
        $('#id').val(id);
        $('#edituser').modal('show');
    });

    $(document).on('submit', '#editUserForm', function (e) {
        e.preventDefault();

        var id = $('#id').val();
        var id_role = $('#role').val();
        $.ajax({
            url: '/setting/user/update', 
            type: 'PUT',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content'), 
                id: id,
                id_role: id_role
            },
            success: function (response) {
                showSuccessMessage(response.message);
                $('#edituser').modal('hide');
                location.reload();
            },
            error: function (xhr) {
                var errorMessage = xhr.responseJSON?.message || 'Terjadi kesalahan. Silakan coba lagi.';
                showErrorMessage(errorMessage);
            }
        });
    });


    $(document).on('click', '.btn-hapususer', function (e) {
        e.preventDefault();

        var id = $(this).data('id');
        var url = '/setting/destroy/user';
        confirmDelete(url, id);
    });

    $(document).ready(function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $(document).on('click', '#btn-tambahuser', function (e) {
            e.preventDefault();
            $('#tambahuser').modal('show');
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

    $(document).ready(function () {
        $('#adddepartemen').on('input', function () {
            var searchTerm = $(this).val();

            if (searchTerm.length >= 2) {
                $.ajax({
                    url: '/api/dept',
                    type: 'GET',
                    data: { search: searchTerm },
                    dataType: 'json',
                    success: function (data) {
                        $('#departemen-list').empty();
                        if (data.length > 0) {
                            $.each(data, function (index, item) {
                                $('#departemen-list').append(
                                    '<option value="' + item.text + '" data-value="' + item.dept_id + '">'
                                );
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error fetching department data:', error);
                    }
                });
            }
        });

        $('#adddepartemen').on('change', function () {
            var selectedValue = $(this).val();
            var selectedOption = $('#departemen-list option[value="' + selectedValue + '"]');

            if (selectedOption.length) {
                $('#departemen_id').val(selectedOption.data('value'));
            } else {
                $('#departemen_id').val('');
            }
        });
    });
});

