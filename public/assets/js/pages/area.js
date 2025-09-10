$(document).ready(function () {
    $('#areadata').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/master/area/data",
            error: function(xhr, error, thrown) {
                console.error("Error fetching data:", error);
                console.error("Details:", thrown);
                console.error("Response:", xhr.responseText);
            }
        },
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'area_name_ftp', name: 'area_name_ftp' },
            { data: 'section_no', name: 'section_no' },
            { data: 'section_name', name: 'section_name' },
            { data: 'bad_level', name: 'bad_level' },
            { data: 'considerable_level', name: 'considerable_level' },
            { data: 'plant_name', name: 'plant_name' },
        ]
    });    
});