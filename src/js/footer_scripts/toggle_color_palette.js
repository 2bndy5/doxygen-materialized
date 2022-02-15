/**A variable used identify the toggle switch element */
var toggleSwitch = document.querySelector('#dark-theme-toggle');

/**
 * A callback function that changes the theme. This also employs a localStorage variable to
 * track the theme preference between page loads.
 */
function switchTheme(e) {
    if (e.target.checked) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
    }
    else {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        toggleSwitch.checked = false;
    }
}

/** add a listener for changing theme preference to that uses our callback function */
toggleSwitch.addEventListener('change', switchTheme, false);

/** pre-check the dark-theme checkbox if dark-theme is set */
if (document.documentElement.getAttribute("data-theme") == "dark") {
    toggleSwitch.checked = true;
}