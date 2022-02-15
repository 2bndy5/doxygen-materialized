/**
 * materialize-css framework overrides the <ul> tags' markers due to their frequent use in modern design.
 * Revert the <ul> elements within the documentation's text using the `browser-default` css class.
 * @param {string} className The parent css class for which to find and revert `<ul>` markers.
 */
function revertUL(className) {
    var textBlocks = document.getElementsByClassName(className);
    for (var i = 0; i < textBlocks.length; i++) {
        var unorderedLists = textBlocks[i].getElementsByTagName("ul");
        for (var j = 0; j < unorderedLists.length; j++) {
            if (!unorderedLists[j].classList.contains("browser-default")) {
                unorderedLists[j].classList.add("browser-default");
            }
        }
    }
}
revertUL("textblock");
revertUL("memdoc");

/** global variables to use for changing the description shown in the navbar */
var docTitle = document.querySelector(".headertitle .title");
var projectName = document.getElementById("project-name");
var projectNumber = document.getElementById("project-number");
var projectBrief = document.getElementById("project-brief");
var navbarTitle = document.createElement("li");

/**
 * Inserts an element to use as the current page's title in the navbar.
 * @see swapNavbarTitle()
 */
function insertNavbarTitle() {
    var titleSpan = document.createElement("span");
    titleSpan.id = "page-topic";
    titleSpan.classList.add("flow-text", "hide-on-small-only", "truncate");
    titleSpan.innerHTML = docTitle.innerHTML;
    navbarTitle.append(titleSpan);
    navbarTitle.hidden = true;
    document.getElementById("nav-bar").append(navbarTitle);
}
insertNavbarTitle();

/**
 * This function triggers when window has scrolled past the page's title.
 * Essentially, it swaps the project name/number/brief description(s) in the navbar with
 * the current page's title.
 */
function swapNavbarTitle() {
    var showTitle = !(document.body.scrollTop > 64 || document.documentElement.scrollTop > 64);
    if (projectName){
        projectName.hidden = !showTitle;
    }
    if (projectNumber){
        projectNumber.hidden = !showTitle;
    }
    if (projectBrief){
        projectBrief.hidden = !showTitle;
    }
    navbarTitle.hidden = showTitle;
}
window.addEventListener("scroll", swapNavbarTitle);
