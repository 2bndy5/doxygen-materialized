
/**
 * Some `section` classed elements (in member's detailed descriptions) use tables to
 * mandate uniform margins on 1 line. Material design prefers the use of data fields in
 * which description is a subsequent line with increased indent.
 * 
 * Thus, we'll convert the tables into more responsive grid.
 * Review the [materialize-css docs about using their 12 column grids](
 * https://materializecss.github.io/materialize/grid.html#grid-intro)
 * 
 * @param className {string} A CSS class name identifying the `<table>` elements to
 * convert into responsive grid.
 */
function replaceSectionTableWithDataLists(className) {
    var oldTables = document.querySelectorAll("table." + className);
    for (var i = 0; i < oldTables.length; i++) {
        var newDataList = document.createElement("div");
        // newDataList.classList.add("left-align");
        newDataList.classList.add(className);
        var tableRows = oldTables[i].getElementsByTagName("tr");
        for (var j = 0; j < tableRows.length; j++) {
            var rowCells = tableRows[j].getElementsByTagName("td");
            var newRow = document.createElement("div");
            newRow.classList.add("row");
            var paramDir = "";
            var paramName = document.createElement("div");
            paramName.classList.add("col", "s5", "m3", "l2", "right-align");
            var paramDesc = document.createElement("div");
            paramDesc.classList.add("col", "s7", "m9", "l10");

            for (var k = 0; k < rowCells.length; k++) {
                if (rowCells[k].classList.contains("paramdir")) {
                    paramDir = " " + rowCells[k].innerHTML;
                }
                else if (rowCells[k].classList.contains("paramname")) {
                    paramName.classList.add("paramname");
                    paramName.innerHTML = rowCells[k].innerHTML;
                    if (paramDir.length > 0) {
                        var spanParamDir = document.createElement("em");
                        spanParamDir.classList.add("paramdir");
                        spanParamDir.innerHTML = paramDir;
                        paramName.append(spanParamDir);
                    }
                    newRow.append(paramName);
                }
                else {
                    // let's assume everything else is part of the description
                    paramDesc.innerHTML = rowCells[k].innerHTML;
                    newRow.append(paramDesc);
                }
            }
            newDataList.append(newRow);
        }
        oldTables[i].replaceWith(newDataList);
    }
}
replaceSectionTableWithDataLists("params");
replaceSectionTableWithDataLists("tparams");
replaceSectionTableWithDataLists("retval");

/**
 * Consolidate `@retval` with corresponding `@return` description.
 * This function also serves to add some uniform padding that seems overlooked by
 * doxygen's default HTML output.
 */
function consolidateReturns() {
    var memberDocs = document.getElementsByClassName("memdoc");
    for (var i = 0; i < memberDocs.length; i++) {
        var returnDesc = memberDocs[i].querySelector("dl.return");
        var returnValues = memberDocs[i].querySelector("dl.retval");
        if (returnDesc != null) {
            // encapsulate data description in a proper paragraph (for uniform padding)
            var newPara = document.createElement("p");
            newPara.innerHTML = returnDesc.lastElementChild.innerHTML;
            returnDesc.lastElementChild.innerHTML = "";
            returnDesc.lastElementChild.append(newPara);
        }
        if (returnDesc != null && returnValues != null) {
            returnDesc.lastElementChild.append(
                returnValues.querySelector("div.retval")
            );
            returnValues.remove();
        }
        else if (returnValues != null) {
            returnValues.classList.add("section"); // for uniform padding
        }
    }
}
consolidateReturns();

/**
 * Doxygen tends to use the `<h2>` tag plus a class attribute to uniform font sizes for
 * all grouped documented member declarations. Because this heading is inside a `<tr>`,
 * the default rules in the materialize-css framework render this tactic aesthetically awkward.
 * Furthermore, and more importantly, the use of html tables does not scale well with smaller
 * screens.
 * 
 * Thus we will transform all member declarations into a responsive grid (& keep the css classes).
 * Review the [materialize-css docs about using their 12 column grids](
 * https://materializecss.github.io/materialize/grid.html#grid-intro)
 */
function modifyDeclarations() {
    var declarationGroups = document.getElementsByClassName("memberdecls");
    for (var i = 0; i < declarationGroups.length; i++) {
        var rows = declarationGroups[i].getElementsByTagName("tr");
        var newGrid = document.createElement("div");
        newGrid.classList.add("memberdecls", "container");
        var inheritedDetails = false; // flag to signify nested rows
        for (var j = 0; j < rows.length; j++) {
            var hasContent = true; // flag to trigger adding content as a new row
            var newRow = document.createElement("div");
            if (rows[j].classList.contains("inherit_header")) {
                // use HTML5's details/summary tags for inherited members listed
                newRow = document.createElement("details");
                var summary = document.createElement("summary");
                summary.classList.add("inherit_header");

                // remove the "open/closed" img (we'll use material-icons in a pseudo `::before` element)
                var oldImg = rows[j].getElementsByTagName("img")[0];
                oldImg.remove();

                summary.innerHTML = rows[j].firstElementChild.innerHTML;
                if (summary.innerHTML.startsWith("&nbsp;")) {
                    // remove the pseudo padding whitespace
                    summary.innerHTML = summary.innerHTML.slice(6);
                }
                newRow.append(summary);
                inheritedDetails = true;
            }
            else {
                for (var k = 0; k < rows[j].children.length; k++) {
                    var newCol = document.createElement("div");
                    newCol.classList.add("col");
                    if (rows[j].children[k].classList.contains("memItemLeft")) {
                        newCol.classList.add("s5", "m3", "l2", "memItemLeft");
                        if (!rows[j].children[k].classList.contains("mdescLeft")) {
                            newCol.innerHTML = rows[j].children[k].innerHTML;
                        }
                    }
                    else if (rows[j].children[k].classList.contains("memItemRight")) {
                        newCol.classList.add("s7", "m9", "l6", "memItemRight");
                        newCol.innerHTML = rows[j].children[k].innerHTML;
                    }
                    else if (rows[j].children[k].classList.contains("mdescLeft")) {
                        newCol.classList.add("s3", "l0", "mdescLeft");
                        // append to last row element
                        hasContent = false; // prevent a new row for this brief description
                        if (inheritedDetails) {
                            // inherited brief description should be appended to the nested `<details>`
                            newGrid.lastElementChild.lastElementChild.append(newCol);
                        }
                        else {
                            newGrid.lastElementChild.append(newCol);
                        }
                    }
                    else if (rows[j].children[k].classList.contains("mdescRight")) {
                        newCol.classList.add("s9", "l4", "mdescRight");
                        newCol.innerHTML = rows[j].children[k].innerHTML;
                        // append to last row element
                        hasContent = false; // prevent a new row for this brief description
                        if (inheritedDetails) {
                            // inherited brief description should be appended to the nested `<details>`
                            newGrid.lastElementChild.lastElementChild.append(newCol);
                        }
                        else {
                            newGrid.lastElementChild.append(newCol);
                        }
                    }
                    else if (!(rows[j].children[k].classList.contains("memSeparator") || rows[j].children[k].classList.contains("mdescLeft"))) {
                        for (var ch = 0; ch < rows[j].children[k].classList.length; ch++) {
                            newCol.classList.add(rows[j].children[k].classList[ch]);
                        }
                        newCol.innerHTML = rows[j].children[k].innerHTML;
                        newCol.classList.add("s12");
                        if (newCol.firstElementChild.classList.contains("groupText") || newCol.classList.contains("ititle")) {
                            // append group description to last row's cols
                            hasContent = false; // prevent adding a new row
                            newGrid.lastElementChild.append(newCol);
                        }
                    }
                    else {
                        hasContent = false;
                    }

                    if (hasContent) {
                        newRow.append(newCol);
                    }
                }
            }
            newRow.classList.add("row");
            if (hasContent) {
                if (inheritedDetails && !rows[j].classList.contains("inherit_header")) {
                    // conditionally nest the new row inside the `<details>` element
                    newGrid.lastElementChild.append(newRow);
                }
                else {
                    newGrid.append(newRow);
                }
            }
        }
        declarationGroups[i].replaceWith(newGrid);
    }
}
modifyDeclarations();

/**
 * @brief A helper function to extract the generated labels (resembling badges) from prototypes
 * 
 * @param parentElement {Element} This should typically be an element classed by `memproto`.
 * @returns An array of Elements containing the labels (or null if it has none).
 */
function extractLabels(parentElement) {
    var memberPrototypes = parentElement.querySelectorAll(".mlabel");
    if (memberPrototypes.length > 0) {
        var actualPrototype = parentElement.querySelector("table.memname");
        var containerTable = parentElement.querySelector("table.mlabels");
        containerTable.replaceWith(actualPrototype);
        return memberPrototypes;
    }
    return null;
}

/**
 * @brief Adapt the documented members' titles
 * 
 * Originally, doxygen uses a `<h2>` tag and a hardcoded textual symbol to represent the
 * hyperlink and title for a documented member. This does not mix well with material design as
 * the text is too big and the hyperlink icon could use an image.
 * 
 * Thus we will transform something like
 * @code
 * <h2 class="memtitle">
 *   <span class="permalink">
 *     <a href="#a40d9e4cc0f4214150620c14a65ddd224">◆&nbsp;</a>
 *   </span>
 *   functionName()
 * </h2>
 * @endcode
 * into something like
 * @code
 * <h3 class="memtitle">
 *   functionName()
 *   <a class="permalink material-icons" href="#a40d9e4cc0f4214150620c14a65ddd224">link</a>
 * </h3>
 * @endcode
 * 
 * Lastly, this function extracts any badge-type labels from the subsequent member prototype
 * and appends them (if any) after the hyperlink icon.
 */
function adaptMemberTitle() {
    var memTitles = document.querySelectorAll("h2.memtitle");
    for (var i = 0; i < memTitles.length; i++) {
        var iconLink = document.createElement("a");
        iconLink.innerHTML = "link";
        iconLink.classList.add("material-icons");
        var newTitle = document.createElement("h3");
        newTitle.classList.add("memtitle");
        // iterate through the children
        for (var j = 0; j < memTitles[i].children.length; j++) {
            if (memTitles[i].children[j].classList.contains("permalink")) {
                iconLink.classList.add("permalink");
                // assuming the `<span>` only has 1 child (`<a>` link), copy the href from it
                iconLink.href = memTitles[i].children[j].children[0].href;
                // remove old hyperlink text, so it isn't copied with `innerHTML`
                memTitles[i].removeChild(memTitles[i].children[j]);
            }
        }
        // copy the title's text
        newTitle.innerHTML = memTitles[i].innerHTML;
        newTitle.append(iconLink);
        memTitles[i].replaceWith(newTitle);

        // get badges from next sibling's element and append them after the hyperlink icon
        var badges = extractLabels(newTitle.nextElementSibling);
        if (badges) {
            for (var k = 0; k < badges.length; k++) {
                newTitle.append(badges[k]);
            }
        }
    }
}
adaptMemberTitle();
