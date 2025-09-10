$(document).ready(function () {
    let table = $('#report-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/ppic/report/data", 
            data: function (d) {
                d.date = $('#datepicker-autoclose').val(); 
            }
        },
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'date_reported', name: 'date_reported' },
            { data: 'description', name: 'description' },
            { data: 'reported_by_name', name: 'reported_by_name' },
            { data: 'reported_to_name', name: 'reported_to_name' }
        ]
    });

    $('#datepicker-autoclose').on('change', function () {
        table.ajax.reload(); 
    });
});
