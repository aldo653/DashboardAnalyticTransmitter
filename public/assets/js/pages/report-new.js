$(document).ready(function () {
    // $.ajax({
    //     url: '/get/reported-by',
    //     type: 'GET',
    //     success: function (data) {
    //         $('#user-dropdown').empty();
    //         $('#user-dropdown').append('<option value="">Pilih User</option>');
    //         $.each(data, function (index, user) {
    //             $('#user-dropdown').append(
    //                 `<option value="${user.username}">Bapak ${user.name}</option>`
    //             );
    //         });
    //     },
    //     error: function (xhr, status, error) {
    //         console.error('Gagal mengambil data:', error);
    //     }
    // });

    $(document).ready(function () {
        $('#user-dropdown').on('input', function () {
            var searchTerm = $(this).val();

            if (searchTerm.length >= 2) {
                $.ajax({
                    url: '/get/reported-by',
                    type: 'GET',
                    data: { search: searchTerm },
                    dataType: 'json',
                    success: function (data) {
                        $('#data-list-user').empty();
                        if (data.length > 0) {
                            $.each(data, function (index, item) {
                                $('#data-list-user').append(
                                    '<option value="' + item.name + '" data-value="' + item.username + '">'
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

        $('#user-dropdown').on('change', function () {
            var selectedValue = $(this).val();
            var selectedOption = $('#data-list-user option[value="' + selectedValue + '"]');

            if (selectedOption.length) {
                $('#user_badge').val(selectedOption.data('value'));
            } else {
                $('#user_badge').val('');
            }
        });
    });
});
