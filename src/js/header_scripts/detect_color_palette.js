/**
 * Detect the user's OS theme preferences and set the toggle button appropriately
 * Additionally set a `data-theme` attribute to "light"/"dark" on the DOM's root node
 * (the <html> tag).
 */
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