// var MenuItems;

// // function menutoggle() {
// //   menuToggle();
// // }

// document.addEventListener('DOMContentLoaded', function() {
//   // The DOM is now ready

//   MenuItems = document.getElementById('MenuItems');

//   function menuToggle() {
//     if (MenuItems.style.maxHeight == '0px') {
//       MenuItems.style.maxHeight = '200px';
//     } else {
//       MenuItems.style.maxHeight = '0px';
//     }
//   }

//   if (MenuItems != null) {
//     MenuItems.style.maxHeight = '0px';
//     MenuItems.onclick = menuToggle;
//   }
// });

function menutoggle() {
  if (MenuItems.style.maxHeight == '0px') {
    MenuItems.style.maxHeight = '200px';
  } else {
    MenuItems.style.maxHeight = '0px';
  }
}

var MenuItems;

document.addEventListener('DOMContentLoaded', function() {
  // The DOM is now ready

  MenuItems = document.getElementById('MenuItems');

  if (MenuItems != null) {
    MenuItems.style.maxHeight = '0px';
    MenuItems.onclick = menutoggle;
  }
});
