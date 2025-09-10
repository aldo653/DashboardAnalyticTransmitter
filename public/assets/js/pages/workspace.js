$(document).ready(function () {
    $('#workspace').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/workspace/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'workspace_name', name: 'workspace_name' },
            { data: 'workspace_description', name: 'workspace_description' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });
});