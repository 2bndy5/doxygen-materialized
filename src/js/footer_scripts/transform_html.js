/**
 * For reasons unknown the breadcrumb element (id: nav-path) is located in the footer when
 * GENERATE_TREEVIEW = YES in the Doxyfile. Furthermore, doxygen uses a `<ul>` as the
 * structure the breadcrumbs (which is incompatible with the material-css framework).
 * 
 * Thus we'll take all list elements, stack them in a `<div>`, and append the new breadcrumbs
 * in the sticky navbar.
 */
function moveBreadcrumbs() {
    var navPath = document.getElementById("nav-path");
    if (!navPath) {
        return;
    }
    var navWrapper = document.createElement("nav");
    navWrapper.id = "nav-path";
    navWrapper.classList.add("nav-wrapper");
    var breadcrumbDiv = document.createElement("div");
    breadcrumbDiv.classList.add("col", "s12");
    navWrapper.append(breadcrumbDiv);
    var breadcrumbs = navPath.getElementsByTagName("li");
    for (var i = 0; i < breadcrumbs.length; i++) {
        breadcrumbDiv.innerHTML += breadcrumbs[i].innerHTML;
        breadcrumbDiv.lastElementChild.classList.add("breadcrumb");
    }
    var topElement = document.getElementById("top");
    if (breadcrumbDiv.childElementCount > 0) {
        topElement.append(navWrapper);
    }
    navPath.remove();
}
moveBreadcrumbs();

/**
 * materialize-css framework overrides the <ul> tags' markers due to their frequent use in modern design.
 * Revert the <ul> elements within the documentation's text using the `browser-default` css class.
 * @param {string} The parent css class for which to find and revert `<ul>` markers.
 */
function revertUL(className) {
    var textBlocks = document.getElementsByClassName(className);
    for (var i = 0; i < textBlocks.length; i++) {
        var unorderedLists = textBlocks[i].getElementsByTagName("ul");
        for (var j = 0; j < unorderedLists.length; j++) {
            unorderedLists[j].classList.add("browser-default");
        }
    }
}
revertUL("textblock");
revertUL("memdoc");
