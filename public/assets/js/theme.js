$(function () {
  "use strict";

  $(".preloader").fadeOut();

  // =================================
  // Tooltip
  // =================================
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // =================================
  // Popover
  // =================================
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // increment & decrement
  $(".minus,.add").on("click", function () {
    var $qty = $(this).closest("div").find(".qty"),
      currentVal = parseInt($qty.val()),
      isAdd = $(this).hasClass("add");
    !isNaN(currentVal) &&
      $qty.val(
        isAdd ? ++currentVal : currentVal > 0 ? --currentVal : currentVal
      );
  });

   // fixed header
   $(window).scroll(function () {
    if ($(window).scrollTop() >= 60) {
      $(".topbar").addClass("shadow-sm");
    } else {
      $(".topbar").removeClass("shadow-sm");
    }
  });
  
});

function showSuccessMessage(message) {
	Swal.fire({
		icon: 'success',
		title: 'Berhasil',
		text: message,
		timer: 2500,
		showConfirmButton: false
	});
}

function showErrorMessage(message) {
	Swal.fire({
		icon: 'error',
		title: 'Gagal',
		text: message || 'Terjadi kesalahan!',
	});
}

function confirmDelete(url, id) {
  Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'info', 
      cancelButtonColor: 'danger',
      confirmButtonText: 'Ya, hapus!'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: url,
              type: 'DELETE',
              data: {
                  _token: $('meta[name="csrf-token"]').attr('content'),
                  id: id
              },
              success: function(response) {
                  if (response.status === 'success') {
                    showSuccessMessage(response.message);
                     location.reload();
                  } else {
                      Swal.fire(
                          'Gagal!',
                          response.message,
                          'error'
                      );
                  }
              },
              error: function(xhr, status, error) {
                  showErrorMessage(response.message);
                  console.log(xhr.responseText); 
              }
          });
      }
  });
}




