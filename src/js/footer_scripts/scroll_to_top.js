//Get the button:
mybutton = document.getElementById("scroll-to-top");

// add the event funtion to the `onscroll` listener
window.onscroll = scrollFunction;

// When the user scrolls down 360px from the top of the document, show the button
function scrollFunction() {
    if (document.body.scrollTop > 360 || document.documentElement.scrollTop > 360) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// // When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//     if (!content) {
//         document.body.scrollTop = 0; // For Safari
//         document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
//     }
//     else {
//         content.scrollTop = 0;
//     }
// }