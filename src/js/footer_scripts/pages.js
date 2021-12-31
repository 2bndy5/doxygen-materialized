/**
 * Convert "detail Level" options into something more UI friendly (like pagination links).
 */
function convertDetailLevelLinks() {
    var detailLevels = document.querySelector(".directory .levels");
    if (detailLevels) {
        var newElement = document.createElement("ul");
        newElement.classList.add("levels", "pagination");
        var spanLinks = detailLevels.getElementsByTagName("span");
        for (var i = 1; i <= spanLinks.length; i++) {
            var newLink = document.createElement("li");
            var hyperlink = document.createElement("a");
            newLink.append(hyperlink);
            newLink.setAttribute("onclick", "toggleLevel(" + i + ")");
            hyperlink.innerHTML = i;
            newElement.append(newLink);
        }
        newElement.prepend(document.createTextNode("detail level "));
        detailLevels.replaceWith(newElement);
    }
}
convertDetailLevelLinks();

/** Convert directory tables into responsive grids */
function condenseDirectoryTables() {
    var dirTables = document.querySelectorAll("table.directory");
    for (var i = 0; i < dirTables.length; i++) {
        var newGrid = document.createElement("div");
        newGrid.classList.add("directory");
        var oldRows = dirTables[i].getElementsByTagName("tr");
        for (var j = 0; j < oldRows.length; j++) {
            var newRow = document.createElement("div");
            newRow.classList.add("row");
            for (var ji = 0; ji < oldRows[j].classList.length; ji++) {
                newRow.classList.add(oldRows[j].classList.item(ji));
            }
            if (oldRows[j].id) {
                newRow.id = oldRows[j].id;
            }
            var oldCols = oldRows[j].getElementsByTagName("td");
            for (var k = 0; k < oldCols.length; k++) {
                var newCol = document.createElement("div");
                newCol.classList.add("col");
                for (var ki = 0; ki < oldCols[k].classList.length; ki++) {
                    newCol.classList.add(oldCols[k].classList.item(ki));
                }
                newCol.innerHTML += oldCols[k].innerHTML;
                var arrow = newCol.querySelector("span.arrow");
                if (arrow) {
                    arrow.classList.add("material-icons");
                    arrow.innerHTML = "expand_more";
                }
                if (newCol.classList.contains("desc")) {
                    newCol.classList.add("s6");
                }
                else if (newCol.children.length > 0 && newCol.firstElementChild.innerHTML === "&nbsp;") {
                    width = parseInt(newCol.firstElementChild.style.width);
                    newCol.classList.add("s" + (6 - width / 32));
                    // append an indenting column
                    if (width) {
                        var indent = document.createElement("div");
                        indent.classList.add("col", "s" + (width / 32));
                        newRow.append(indent);
                    }
                }
                else if (oldCols[k].getElementsByClassName("mlabel").length > 0) {
                    newCol.classList.add("s12");
                }
                else {
                    newCol.classList.add("s6");
                }
                // insert word break opportunities in long text
                newCol.innerHTML = newCol.innerHTML.replaceAll("::", "::<wbr>");
                newRow.append(newCol);
            }
            newGrid.append(newRow);
        }
        dirTables[i].replaceWith(newGrid);
    }
}
condenseDirectoryTables();


toggleLevel = function (level) {
    var rows = document.querySelectorAll('.directory .row');
    for (var i = 0; i < rows.length; i++) {
        var l = rows[i].id.split('_').length - 2;
        var arrow = rows[i].getElementsByClassName("arrow")[0];
        if (l > level) {
            if (arrow) { arrow.innerHTML = "expand_more"; }
            rows[i].hidden = true;
        }
        else if (l == level) {
            if (arrow) { arrow.innerHTML = "expand_less"; }
            rows[i].hidden = false;
        }
        else {
            if (arrow) { arrow.innerHTML = "expand_more"; }
            rows[i].hidden = false;
        }
    }
}

toggleFolder = function (id) {
    // the clicked row
    var currentRow = document.querySelector('#row_' + id);
    var childRows = new Array();
    var nextSibling = currentRow.nextElementSibling;
    if (nextSibling == null) { console.warn("currentRow has no immediate sibling?!"); }
    var visible = !nextSibling.hidden;
    while (nextSibling != null && nextSibling.id.startsWith("row_" + id)) {
        nextSibling.hidden = visible;
        childRows.push(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
    }
    var arrow = currentRow.querySelector("span.arrow");
    arrow.innerHTML = visible ? "expand_less" : "expand_more";
    if (visible) {
        // collapse any child row arrows since they are now hidden;
        for (var i = 0; i < childRows.length; i++) {
            arrow = childRows[i].querySelector("span.arrow");
            if (arrow) {
                arrow.innerHTML = "expand_less";
            }
        }
    }
}
