$(document).ready(function () {
    $('#step').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/step/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'step_name', name: 'step_name' },
            { data: 'step_description', name: 'step_description' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });
});