/**  This global variable used to access the html dom element for the slide-out nav menu. */
var sideNav = document.getElementById("slide-out");

/** global variable used to sync nav menu with site URL's path (deepest only). */
var pathName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
if (pathName.includes('#')) {
    // remove the hash location
    pathName = pathName.substring(0, pathName.lastIndexOf('#'));
}

/** global variable used to sync nav menu with page's hash location */
var hashName = window.location.hash;


/**
 * @brief creates a clickable item for use in the side-nav list (or sub-list).
 *
 * This is a helper function meant for recursively iterating over the menudata.children array(s).
 * @note This function assumes that each child node has a `text` and `url` value.
 * @param {{text: string, url: string, children: {}}} child The child node to create a list item from.
 * @param {string} id The string used in conjunctio eith the index for the menu item's id.
 * @param {number} index The specific index of the of the menu item in the array of menu data.
 * @returns {HTMLLIElement} a `<li>` element to be appended to the side-nav
 */
function createMenuItem(child, id, index) {
    var newItem = document.createElement("li");
    var menuLabel;
    if (child.children) {
        var menuId = id + "-" + index;
        var divLabel = document.createElement("div");
        divLabel.classList.add("menu-next");
        newItem.append(divLabel);

        menuLabel = document.createElement("label");
        menuLabel.setAttribute("for", menuId);
        menuLabel.classList.add("submenu-label");
        divLabel.append(menuLabel);

        // also use a chevron icon to indicate it has a sub-menu
        var mdIcon = document.createElement("label");
        mdIcon.classList.add("material-icons");
        mdIcon.setAttribute("for", menuId);
        mdIcon.append(document.createTextNode("chevron_right"));
        divLabel.append(mdIcon);

        var menuToggle = document.createElement("input");
        menuToggle.id = menuId;
        menuToggle.name = menuId;
        menuToggle.type = "checkbox";
        menuToggle.classList.add("menu-toggle");
        newItem.append(menuToggle);

        var divMenu = document.createElement("div");
        divMenu.classList.add(menuId, "sub-menu");
        var backToggle = document.createElement("label");
        backToggle.setAttribute("for", menuId);
        backToggle.classList.add("menu-back");

        var backIcon = document.createElement("i");
        backIcon.classList.add("material-icons");
        backIcon.append(document.createTextNode("west"));
        backToggle.append(backIcon);
        backToggle.append(document.createElement("br"));
        backToggle.append(document.createTextNode(child.text));
        divMenu.append(backToggle);
        var subItems = document.createElement("ul");
        for (var i = 0; i < child.children.length; i++) {
            subItems.append(createMenuItem(child.children[i], menuId, i));
        }
        divMenu.append(subItems);
        newItem.append(divMenu);
    } else {
        // if no children, then make the `<a>` element a hyperlink element to contain the label
        menuLabel = document.createElement("a");
        menuLabel.href = child.url;
        newItem.prepend(menuLabel);
        if (menuLabel.href.includes("#") && menuLabel.href.split("#")[0] === pathName) {
            newItem.classList.add("sidenav-close");
        }
    }
    menuLabel.prepend(document.createTextNode(child.text));
    return newItem;
}

/**
 * @brief Moves the "doxygen tabs" (AKA index) into the side-nav list.
 * @warning This function can do nothing if the doxyfile's `DISABLE_INDEX` tag is set to `YES`.
 * @param output The wrapping HTML element to insert the modified elements.
 * @param input The wrapping HTML element to extract (and modify) elements from.
 */
function replaceTabbedIndex() {
    var sideNavContent = sideNav.getElementsByClassName("scroll-wrapper")[0];
    if (menudata && menudata.children) {
        for (var i = 0; i < menudata.children.length; i++) {
            sideNavContent.append(createMenuItem(menudata.children[i], "nav", i));
        }
    } else {
        console.error("variable 'menudata' is NULL or does not have any children.");
    }
}

/**************************** TREEVIEW replacement */

/**
 *
 * @param {STRING} scriptName The string representation of the script to dynamically lod into the DOM.
 * @param {() => void} func A callback function to perform once the script is loaded.
 */
function loadScript(scriptName, func) {
    var head = document.querySelector("head");
    var script = document.createElement('script');
    script.id = scriptName;
    script.type = 'text/javascript';
    script.onload = func;
    script.src = scriptName + '.js';
    head.appendChild(script);
}

/**
 * @brief creates a clickable item for use in the side-nav list (or sub-list).
 *
 * This is a helper function meant for recursively iterating over the navtreedata nested array(s).
 * 1. menu item title
 * 2. menu item url
 * 3. menu item's sub-menu (for which follows the same structure)
 * @note This function assumes that each child node has 3 values.
 * @param {Array[string, string, any]} child The child node to create a list item from.
 * @param {string} id The string used in conjunctio eith the index for the menu item's id.
 * @param {number} index The specific index of the of the menu item in the array of menu data.
 * @param {HTMLInputElement} parentElement A convenience reference to the parent element's input checkbox
 * for which the returned element will be appended to.
 * @returns {HTMLLIElement} a `<li>` element to be appended to the side-nav
 */
function createTreeItem( child, id, index, parentElement) {
    var newItem = document.createElement("li");
    var menuLabel;
    if (child[2]) {
        var menuId = id + "-" + index;
        var divLabel = document.createElement("div");
        divLabel.classList.add("menu-next");
        newItem.append(divLabel);

        menuLabel = document.createElement("label");
        menuLabel.setAttribute("for", menuId);
        menuLabel.classList.add("submenu-label");
        divLabel.append(menuLabel);

        // also use a chevron icon to indicate it has a sub-menu
        var mdIcon = document.createElement("label");
        mdIcon.classList.add("material-icons");
        mdIcon.setAttribute("for", menuId);
        mdIcon.append(document.createTextNode("chevron_right"));
        divLabel.append(mdIcon);

        var menuToggle = document.createElement("input");
        menuToggle.id = menuId;
        menuToggle.name = menuId;
        menuToggle.type = "checkbox";
        menuToggle.classList.add("menu-toggle");
        newItem.append(menuToggle);

        // implement pseudo sync between side nav menu and current page location
        if (child[1].split("#")[0] == pathName && !child[1].includes("#")) {
            var checkboxes = document.querySelectorAll("input.menu-toggle");
            checkboxes.forEach(function (el) { el.checked = false; });
            menuToggle.checked = true;
            var walkingId = id;
            while (walkingId != "nav") {
                var checkbox = document.querySelector("input#" + walkingId);
                if (checkbox) { checkbox.checked = true; }
                else if (parentElement) { parentElement.checked = true; }
                walkingId = walkingId.substring(0, walkingId.lastIndexOf("-"));
            }
        }

        var divMenu = document.createElement("div");
        divMenu.classList.add("sub-menu");
        divMenu.id = menuId;

        var backToggle = document.createElement("label");
        backToggle.setAttribute("for", menuId);
        backToggle.classList.add("menu-back");

        var backIcon = document.createElement("i");
        backIcon.classList.add("material-icons");
        backIcon.append(document.createTextNode("west"));
        backToggle.append(backIcon);

        var goToIcon = document.createElement("a");
        goToIcon.href = child[1];
        goToIcon.classList.add("material-icons-outlined", "tooltipped");
        if (child[1].includes("#") && child[1].split("#")[0] == pathName) {
            goToIcon.classList.add("sidenav-close");
        }
        goToIcon.append(document.createTextNode("menu_open"));
        M.Tooltip.init(goToIcon, { text: "Go to corresponding page", position: "left" });
        backToggle.append(goToIcon);
        backToggle.append(document.createElement("br"));

        // add word-break elements if scoping operator is detected
        var words = child[0].split("::");
        if (words.length > 1) {
            backToggle.innerHTML += words.join("::<wbr>");
        }
        else {
            backToggle.append(document.createTextNode(child[0]));
        }

        divMenu.append(backToggle);
        newItem.append(divMenu);
        var subItems = document.createElement("ul");
        if (typeof child[2] === "string") {
            loadScript(
                child[2],
                function () {
                    var evalWorkaround = new Function("return " + child[2] + ";");
                    var arrData = evalWorkaround();
                    for (var d = 0; d < arrData.length; d++) {
                        subItems.append(createTreeItem(arrData[d], menuId, d, menuToggle));
                    }
                }
            );
        }
        else { // if not a string nor null, then it is a nested array
            for (var i = 0; i < child[2].length; i++) {
                subItems.append(createTreeItem(child[2][i], menuId, i, menuToggle));
            }
        }
        divMenu.append(subItems);
    }
    else {
        // if no children, then make an `<a>` element a hyperlink element to contain the label
        menuLabel = document.createElement("a");
        menuLabel.href = child[1];
        newItem.prepend(menuLabel);
        if (child[1].includes("#") && child[1].split("#")[0] == pathName) {
            newItem.classList.add("sidenav-close");
        }
    }
    menuLabel.classList.add("truncate");
    menuLabel.prepend(document.createTextNode(child[0]));
    return newItem;
}

/**
 * Rewrite the initNavTree generated by doxygen. This populates the slide-out nav menu from JS
 * variables that are loaded into the DOM; some JS scripts containing specific nav data may need
 * to be loaded into DOM dynamically.
 */
function initNavTree() {
    if (typeof NAVTREE === "undefined") {
        replaceTabbedIndex(); // Assumes DISABLE_INDEX = NO in Doxyfile
    } else {
        var sideNavContent = sideNav.getElementsByClassName("scroll-wrapper")[0];
        let navTree = NAVTREE[0][2];
        for (var i = 0; i < navTree.length; i++) {
            sideNavContent.append(createTreeItem(navTree[i], "nav", i, null));
        }
    }
}

// A dummy function that replaces the old function used by doxygen's default navtree feature
function initResizable() { return; }
