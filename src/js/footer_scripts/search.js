/**
 * Doxygen's Search field uses elements whose class names collide with materialize-css
 * framework (because they're not very descriptive).
 * 
 * Thus we'll replace the class names with more suitable descriptive names that don't
 * interfere with using materialize-css framework's class names.
 */
function modifySearchBar() {
    var divSearch = document.getElementById("MSearchBox");
    if (!divSearch) {
        return;
    }
    var right = divSearch.getElementsByClassName("right")[0];
    var left = divSearch.getElementsByClassName("left")[0];
    right.classList.replace("right", "search-right");
    left.classList.replace("left", "search-left");
}
modifySearchBar();

// modify the search form's close button to use material icons' close icon.
function replaceSearchCloseImg() {
    var closeLink = document.getElementById("MSearchClose");
    if (closeLink) {
        closeLink.innerHTML = "<span id=\"MSearchCloseImg\" class=\"material-icons\">close</span>";
        closeLink.style = "display: none;";
    }
}
replaceSearchCloseImg();

var searchParamList = document.getElementById("searchParameters");

/**
 * Override the initSearch function which populates the search parameters dropdown options.
 * 
 * Using materialize-css framework, the structure of this list has to change from
 * @code
 * <a class="SelectItem" onclick="searchBox.OnSelectItem(0)" href="javascript:void(0)">
 *     <span class="SelectionMark">•</span>
 *     All
 * </a>
 * @endcode
 * into something like
 * @code
 * <li onclick="searchBox.OnSelectItem(0)">
 *     <p><label class="SelectItem">
 *         <input class="with-gap" type="radio" checked />
 *         <span>All</span>
 *     </label></p>
 * </li>
 */
init_search = function () {
    for (var key in indexSectionLabels) {
        var link = document.createElement('li');
        searchParamList.appendChild(link);
        link.setAttribute('onclick', 'searchBox.OnSelectItem(' + key + ')');
        link.classList.add("SelectItems");

        var p = document.createElement("p");
        link.append(p);

        var label = document.createElement("label");
        p.append(label);

        var labelInput = document.createElement("input");
        label.append(labelInput);
        labelInput.classList.add("with-gap");
        labelInput.type = "radio";

        var textNode = document.createElement("span");
        textNode.innerHTML = indexSectionLabels[key];
        label.append(textNode);
    }
    // set the "All" parameter to "checked" on init
    searchBox.OnSelectItem(0);

    // now re-adjust the dropdown instance via materialize-css JS API
    var dropdownTrigger = document.querySelectorAll("#nav-bar .search-wrapper .dropdown-trigger");
    var instance = M.Dropdown.init(
        dropdownTrigger,
        { // instance options
            constrainWidth: false,
            coverTrigger: false
        }
    );
}

searchBox.SelectItemSet = function (id) {
    for (var i = 0; i < searchParamList.children.length; i++) {
        var node = searchParamList.children[i].querySelector("input");
        node.checked = i == id;
    }
}
