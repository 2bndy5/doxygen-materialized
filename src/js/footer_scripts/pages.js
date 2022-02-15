/**
 * Add css classes to style the page's ToC as a secondary sticky nav menu (on the right).
 * This feature is dependent on the project's use of `\tableofcontents` doxygen cmd.
 */
function styleSecondaryToc() {
    var tocElements = document.querySelector("div.toc");
    if (!tocElements) {
        return;
    }
    tocElements.parentElement.classList.add("row");
    tocElements.classList.add("col", "hide-on-small-only", "m3", "push-m9");
    tocElements.nextElementSibling.classList.add("col", "s12", "m9", "pull-m3");
    var nestedLists = tocElements.getElementsByTagName("ul");
    for (var j = 0; j < nestedLists.length; j++) {
        nestedLists[j].classList.add("table-of-contents");
        if (j > 0) {
            nestedLists[j].attributes["style"] = "padding-left: 0.8rem !important";
        }
    }

    // now add the `scrollspy` css class to any headers
    var anchors = document.getElementsByClassName("anchor");
    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].parentElement.tagName.startsWith("H")) {
            anchors[i].classList.add("scrollspy", "no-autoinit");
            var linkIcon = document.createElement("span");
            linkIcon.classList.add("material-icons");
            linkIcon.innerHTML = "link";
            anchors[i].setAttribute("href", "#" + anchors[i].id);
            anchors[i].append(linkIcon);
            anchors[i].parentElement.append(anchors[i]);
        }
    }
    M.ScrollSpy.init(
        document.querySelectorAll('.scrollspy'),
        { scrollOffset: 0 }
    );
}
styleSecondaryToc();
