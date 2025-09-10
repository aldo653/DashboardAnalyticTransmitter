$(document).ready(function () {
    $('#blockdata').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/block/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'block_name', name: 'block_name' },
            { data: 'block_description', name: 'block_description' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });
});