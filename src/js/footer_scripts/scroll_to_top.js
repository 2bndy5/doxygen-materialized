//Get the button:
var goToTopButton = document.getElementById("scroll-to-top");

// When the user scrolls down 360px from the top of the document, show the button
function scrollFunction() {
    if (document.body.scrollTop > 360 || document.documentElement.scrollTop > 360) {
        goToTopButton.style.display = "block";
    }
    else {
        goToTopButton.style.display = "none";
    }
}

// add the event function to the `onscroll` listener
window.onscroll = scrollFunction;
