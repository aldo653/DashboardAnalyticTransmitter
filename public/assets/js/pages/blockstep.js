$(document).ready(function () {
    $('#blockstep').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/master/blockstep/data",
        columns: [
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
            { data: 'block_name', name: 'block_name' },
            { data: 'steps', name: 'steps' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // $('#viewStepstable').DataTable({
    //     processing: true,
    //     serverSide: true,
    //     ajax: "/master/getviewstep/data",
    //     columns: [
    //         { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
    //         { data: 'step_name', name: 'step_name' },
    //         { data: 'action', name: 'action', orderable: false, searchable: false }
    //     ]
    // });

    $('#viewsteps').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var blockId = button.data('id'); // Extract the data-id attribute
    
        // Destroy any existing DataTable instance
        if ($.fn.DataTable.isDataTable('#viewStepstable')) {
            $('#viewStepstable').DataTable().destroy();
        }
    
        // Reinitialize DataTable with updated AJAX URL
        $('#viewStepstable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/master/getviewstep/data",
                type: "GET",
                data: { id_block: blockId } // Pass blockId as a parameter
            },
            columns: [
                { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false },
                { data: 'step_name', name: 'step_name' },
                { data: 'action', name: 'action', orderable: false, searchable: false }
            ]
        });
    });
    

});