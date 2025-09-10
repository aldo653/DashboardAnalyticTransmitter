$(document).ready(function () {
    $('#equipment').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/master/equipment/data",
            error: function(xhr, error, thrown) {
                console.error("Error fetching data:", error);
                console.error("Details:", thrown);
                console.error("Response:", xhr.responseText);
            }
        },
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'tag_number', name: 'tag_number' },
            { data: 'is_critical', name: 'is_critical' },
            { data: 'description', name: 'description' },
            { data: 'main_equipment_no', name: 'main_equipment_no' },
            { data: 'area_name_ftp', name: 'area_name_ftp' },
            { data: 'plant_name', name: 'plant_name' },
            { data: 'section_name', name: 'section_name' },
            { data: 'tag_area', name: 'tag_area' },
        ]
    });    
});