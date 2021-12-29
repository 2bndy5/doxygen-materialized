/**
 * We need to set a scrolling offset so the navbar won't cover up content when
 * scrolling to an anchor (on hashchange event).
function navScrollOffset() { 
    var scrollOffset = document.querySelector("nav").clientHeight;
    console.log("scrolling offset by " + (-1 * scrollOffset));
    scrollBy(0, -1 * scrollOffset);
}
window.addEventListener("hashchange", navScrollOffset);
 */
/**
 * Doxygen's Search field uses elements whose class names collide with materialize-css
 * framework (because they're not very descriptive).
 * 
 * Thus we'll replace the class names with more suitable descriptive names that don't
 * interfere with using materialize-css framework's class names.
 */
function modifySearchBar() {
    let divSearch = document.getElementById("MSearchBox");
    let right = divSearch.getElementsByClassName("right")[0];
    let left = divSearch.getElementsByClassName("left")[0];
    right.classList.replace("right", "search-right");
    left.classList.replace("left", "search-left");
}
modifySearchBar();

/**
 * For reasons unknown the breadcrumb element (id: nav-path) is located in the footer when
 * GENERATE_TREEVIEW = YES in the Doxyfile. Furthermore, doxygen uses a `<ul>` as the
 * structure the breadcrumbs (which is incompatible with the material-css framework).
 * 
 * Thus we'll take all list elements, stack them in a `<div>`, and append the new breadcrumbs
 * in the sticky navbar.
 */
function moveBreadcrumbs() {
    let navPath = document.getElementById("nav-path");
    if (!navPath) {
        return;
    }
    let navWrapper = document.createElement("nav");
    navWrapper.id = "nav-path";
    navWrapper.classList.add("nav-wrapper");
    let breadcrumbDiv = document.createElement("div");
    breadcrumbDiv.classList.add("col", "s12");
    navWrapper.append(breadcrumbDiv);
    let breadcrumbs = navPath.getElementsByTagName("li");
    for (let i = 0; i < breadcrumbs.length; i++) {
        breadcrumbDiv.innerHTML += breadcrumbs[i].innerHTML;
        breadcrumbDiv.lastElementChild.classList.add("breadcrumb");
    }
    let topElement = document.getElementById("top");
    if (breadcrumbDiv.childElementCount > 0) {
        topElement.append(navWrapper);
    }
    navPath.remove();
}
moveBreadcrumbs();

// modify the search form's close button to use material icons' close icon.
function replaceSearchCloseImg() {
    let closeLink = document.getElementById("MSearchClose");
    closeLink.innerHTML = "<span id=\"MSearchCloseImg\" class=\"material-icons\">close</span>";
}
replaceSearchCloseImg();

/**
 * materialize-css framework overrides the <ul> tags' markers due to their frequent use in modern design.
 * Revert the <ul> elements within the documentation's text using the `browser-default` css class.
 * @param {string} The parent css class for which to find and revert `<ul>` markers.
 */
function revertUL(className) {
    let textBlocks = document.getElementsByClassName(className);
    for (let i = 0; i < textBlocks.length; i++) {
        let unorderedLists = textBlocks[i].getElementsByTagName("ul");
        for (let j = 0; j < unorderedLists.length; j++) {
            unorderedLists[j].classList.add("browser-default");
        }
    }
}
revertUL("textblock");
revertUL("memdoc");

/**
 * Some `section` classed elements (in member's detailed descriptions) use tables to
 * mandate uniform margins on 1 line. Material design prefers the use of data fields in
 * which description is a subsequent line with increased indent.
 * 
 * Thus, we'll convert something like
 * @code
 * <dt>Parameters</dt>
 * <dd>
 *   <table class="params">
 *     <tbody>
 *       <tr>
 *         <td class="paramdir">[in]</td>
 *         <td class="paramname">var1</td>
 *         <td>var1 description.</td>
 *       </tr>
 *       <tr>
 *         <td class="paramname">var2</td>
 *         <td>var2 description.</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </dd>
 * @endcode
 * into something like
 * @code
 * <dt>Parameters</dt>
 * <dd>
 *   <dl class="params">
 *     <dt class="paramname">var1<span class="paramdir"> [in]</span></dt>
 *     <dd>var1 description.</dd>
 *     <dt class="paramname">var2</dt>
 *     <dd>var2 description.</dd>
 *   </dl>
 * </dd>
 * @endcode
 * @param className {string} A CSS class name identifying the `<table>` elements to
 * convert into `<dl>`.
 */
function replaceTableWithDataLists(className) {
    let oldTables = document.querySelectorAll("table." + className);
    for (let i = 0; i < oldTables.length; i++) {
        let newDataList = document.createElement("dl");
        newDataList.classList.add(className);
        let tableRows = oldTables[i].getElementsByTagName("tr");
        for (let j = 0; j < tableRows.length; j++) {
            let rowCells = tableRows[j].getElementsByTagName("td");
            let paramDir = "";
            let paramName = document.createElement("dt");
            let paramDesc = document.createElement("dd");
            for (let k = 0; k < rowCells.length; k++) {
                if (rowCells[k].classList.contains("paramdir")) {
                    paramDir = " " + rowCells[k].innerHTML;
                }
                else if (rowCells[k].classList.contains("paramname")) {
                    paramName.classList.add("paramname");
                    paramName.innerHTML = rowCells[k].innerHTML;
                    if (paramDir.length > 0) {
                        let spanParamDir = document.createElement("em");
                        spanParamDir.classList.add("paramdir");
                        spanParamDir.innerHTML = paramDir;
                        paramName.append(spanParamDir);
                    }
                    newDataList.append(paramName);
                }
                else {
                    // let's assume everything else is part of the description
                    paramDesc.innerHTML = rowCells[k].innerHTML;
                    newDataList.append(paramDesc);
                }
            }
        }
        oldTables[i].replaceWith(newDataList);
    }
}
replaceTableWithDataLists("params");
replaceTableWithDataLists("tparams");
replaceTableWithDataLists("retval");

/**
 * Doxygen tends to use the `<h2>` tag plus a class attribute to uniform font sizes for
 * all grouped documented member declarations. Because this heading is inside a `<tr>`,
 * the default rules in the materialize-css framework render this tactic aesthetically awkward.
 * Furthermore, and more importantly, the use of html tables does not scale well with smaller
 * screens.
 * 
 * Thus we will transform all member declarations into a responsive grid (and keep the css classes).
 * Review the [materialize-css docs about using their 12 column grids](https://materializecss.github.io/materialize/grid.html#grid-intro)
 */
function modifyDeclarations() {
    let declarationGroups = document.getElementsByClassName("memberdecls");
    for (let i = 0; i < declarationGroups.length; i++) {
        let rows = declarationGroups[i].getElementsByTagName("tr");
        let newGrid = document.createElement("div");
        newGrid.classList.add("memberdecls", "container");
        let inheritedDetails = false; // flag to signify nested rows
        for (let j = 0; j < rows.length; j++) {
            let hasContent = true; // flag to trigger adding content as a new row
            let newRow = document.createElement("div");
            if (rows[j].classList.contains("inherit_header")) {
                // use HTML5's details/summary tags for inherited members listed
                newRow = document.createElement("details");
                let summary = document.createElement("summary");
                summary.classList.add("inherit_header");
                
                // remove the "open/closed" img (we'll use material-icons in a psuedo `::before` element)
                let oldImg = rows[j].getElementsByTagName("img")[0];
                oldImg.remove();
                
                summary.innerHTML = rows[j].firstElementChild.innerHTML;
                if (summary.innerHTML.startsWith("&nbsp;")) {
                    // remove the psuedo padding whitespace
                    summary.innerHTML = summary.innerHTML.slice(6);
                }
                newRow.append(summary);
                inheritedDetails = true;
            }
            else {
                for (let k = 0; k < rows[j].children.length; k++)  {
                    let newCol = document.createElement("div");
                    newCol.classList.add("col");
                    if (rows[j].children[k].classList.contains("memItemLeft")) {
                        newCol.classList.add("s2", "memItemLeft");
                        if (!rows[j].children[k].classList.contains("mdescLeft")) {
                            newCol.innerHTML = rows[j].children[k].innerHTML;
                        }
                    }
                    else if (rows[j].children[k].classList.contains("memItemRight")) {
                        newCol.classList.add("s6", "memItemRight");
                        newCol.innerHTML = rows[j].children[k].innerHTML;
                    }
                    else if (rows[j].children[k].classList.contains("mdescRight")) {
                        newCol.classList.add("s4", "mdescRight");
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
                        for (let ch = 0; ch < rows[j].children[k].classList.length; ch++) {
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
    let memberPrototypes = parentElement.querySelectorAll(".mlabel");
    if (memberPrototypes.length > 0) {
        let actualPrototype = parentElement.querySelector("table.memname");
        let containerTable = parentElement.querySelector("table.mlabels");
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
 * <h5 class="memtitle">
 *   functionName()
 *   <a class="permalink material-icons" href="#a40d9e4cc0f4214150620c14a65ddd224">link</a>
 * </h5>
 */
function adaptMemberTitle() {
    let memTitles = document.querySelectorAll("h2.memtitle");
    for (let i = 0; i < memTitles.length; i++) {
        let iconLink = document.createElement("a");
        iconLink.innerHTML = "link";
        iconLink.classList.add("material-icons");
        let newTitle = document.createElement("h3");
        newTitle.classList.add("memtitle");
        // iterate throught the children
        for (let j = 0; j < memTitles[i].children.length; j++) {
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
        let badges = extractLabels(newTitle.nextElementSibling);
        if (badges) {
            for (let j = 0; j < badges.length; j++) {
                newTitle.append(badges[j]);
            }
        }
    }
}
adaptMemberTitle();
