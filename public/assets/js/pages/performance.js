// document.addEventListener('DOMContentLoaded', function () {
//     // Event listener for the dropdown change
//     document.getElementById('dropdownMenu').addEventListener('change', function () {
//         var dcsElement = document.getElementById('dcsmanagement');
//         var listhecatalyst = document.getElementById('listhecatalyst');
//         var pointingElement = document.getElementById('pointing');

//         // Toggle visibility for DCS Management section when "DCS Management" is selected
//         if (this.value === 'dcs') {
//             dcsElement.style.visibility = 'visible';
//             listhecatalyst.style.visibility = 'hidden'; // Hide the list when DCS is selected
//             pointingElement.style.visibility = 'hidden'; // Hide Pointing section when DCS is selected
//         } else {
//             dcsElement.style.visibility = 'hidden';
//         }

//         // if (this.value === 'pointing') {
//         //     dcsElement.style.visibility = 'hidden';
//         //     listhecatalyst.style.visibility = 'hidden'; // Hide the list when DCS is selected
//         //     pointingElement.style.visibility = 'visible'; // Hide Pointing section when DCS is selected
//         // } else {
//         //     pointingElement.style.visibility = 'hidden';
//         // }

//         // Toggle visibility for List HE/Catalyst Pointing when "HE/Catalyst Pointing" is selected
//         if (this.options[this.selectedIndex].text === 'HE/Catalyst Pointing') {
//             listhecatalyst.style.visibility = 'visible';
//             pointingElement.style.visibility = 'hidden'; // Show Pointing when HE/Catalyst Pointing is selected
//         } else {
//             listhecatalyst.style.visibility = 'hidden';
//             pointingElement.style.visibility = 'hidden'; // Hide Pointing when other options are selected
//         }

//         // // Show Pointing section when "Pointing" is selected
//         // if (this.options[this.selectedIndex].text === 'Pointing') {
//         //     pointingElement.style.visibility = 'visible';
//         //     listhecatalyst.style.visibility = 'hidden'; // Hide List Catalyst/HE when Pointing is selected
//         // } else {
//         //     pointingElement.style.visibility = 'hidden';
//         // }
        
//     });

//     // Set initial state for both sections on page load
//     var dropdownMenu = document.getElementById('dropdownMenu');
//     var listhecatalyst = document.getElementById('listhecatalyst');
//     var dcsElement = document.getElementById('dcsmanagement');
//     var pointingElement = document.getElementById('pointing');

//     // Initial visibility state based on selected dropdown option
//     if (dropdownMenu.options[dropdownMenu.selectedIndex].text === 'HE/Catalyst Pointing') {
//         listhecatalyst.style.visibility = 'visible';
//         pointingElement.style.visibility = 'hidden'; // Show Pointing initially if HE/Catalyst Pointing is selected
//     } else if (dropdownMenu.options[dropdownMenu.selectedIndex].text === 'Pointing') {
//         pointingElement.style.visibility = 'visible'; // Show Pointing when "Pointing" is selected
//     } else {
//         listhecatalyst.style.visibility = 'hidden';
//         pointingElement.style.visibility = 'hidden'; // Hide both by default if no selection is made
//     }

//     if (dropdownMenu.value === 'dcs') {
//         dcsElement.style.visibility = 'visible';
//         listhecatalyst.style.visibility = 'hidden'; // Hide List when DCS is selected
//         pointingElement.style.visibility = 'hidden'; // Hide Pointing when DCS is selected
//     } else {
//         dcsElement.style.visibility = 'hidden';
//     }

//     document.querySelectorAll('.sidebar-item-x').forEach(item => {
//         item.addEventListener('click', function () {
//             const path = this.getAttribute('data-path');
//             console.log("Path: ", path);  // Cek apakah path diambil dengan benar
//             if (path) {
//                 fetchImageFromDrivex(path);
//             } else {
//                 console.log("No path found!");
//             }
//         });
//     });      

//     // Function to fetch image from Drivex
//     function fetchImageFromDrivex(path) {
//         fetch(`/performance/getimg-from-drivex?path=${encodeURIComponent(path)}`, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//             },
//         })
//             .then(response => {
//                 if (response.ok) {
//                     return response.blob();
//                 } else {
//                     throw new Error('Image not found');
//                 }
//             })
//             .then(blob => {
//                 const url = URL.createObjectURL(blob);
//                 const imageCard = document.getElementById('imgroot');
//                 imageCard.innerHTML = `<img src="${url}" alt="Diagram" style="max-width:100%; height:auto;" />`;
//                 imageCard.style.display = 'block';
//             })
//             .catch(error => {
//                 console.error(error);
//                 alert('Image not found');
//             });
//     }
// });

document.getElementById('dropdownMenu').addEventListener('change', function() {
    var dcsContent = document.getElementById('dcs_content');
    var dcsManagement = document.getElementById('dcsmanagement');
    
    // Hide both elements initially
    dcsContent.style.display = 'none';
    dcsManagement.style.display = 'none';
    
    // Show the correct element based on the selected dropdown value
    switch(this.value) {
        case 'dcs_content':
            dcsContent.style.display = 'block'; // Menampilkan #dcs_content
            break;
        case 'he_pointing':
            dcsContent.style.display = 'block'; // Menampilkan #dcs_content
            break;
        case 'dcs':
            dcsManagement.style.display = 'block'; // Menampilkan #dcsmanagement
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    var dcsContent = document.getElementById('dcs_content');
    var dcsManagement = document.getElementById('dcsmanagement');
    
    // Set the initial state when the page loads
    if (dropdownMenu.value === 'dcs_content' || dropdownMenu.value === 'he_pointing') {
        dcsContent.style.display = 'block';
    } else if (dropdownMenu.value === 'dcs') {
        dcsManagement.style.display = 'block';
    }
});




