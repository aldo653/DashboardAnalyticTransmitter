$(document).ready(function () {
    $('#plant').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/plant/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'plant_code', name: 'plant_code' },
            { data: 'plant_name', name: 'plant_name' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });
});