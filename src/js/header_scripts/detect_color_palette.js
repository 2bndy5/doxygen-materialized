// toggle to switch classes between .light and .dark
// if no class is present (initial state), then assume current state based on system color scheme
//determines if the user has a set theme
function detectColorScheme() {
    var theme = "light"; //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    }
    else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    }
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
    }

    if (theme == "dark") {
        // dark theme preferred, set document with a `data-theme` attribute
        document.documentElement.setAttribute("data-theme", "dark");
    }
}
detectColorScheme();