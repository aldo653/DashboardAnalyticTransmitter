$(document).ready(function () {
    $('#section').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/section/data",
        type: "GET",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'section_no', name: 'section_no' },
            { data: 'section_name', name: 'sction_name' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });
});