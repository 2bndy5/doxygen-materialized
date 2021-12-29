
/**
 * @brief creates a clickable item for use in the side-nav list (or sub-list).
 * 
 * This is a helper function meant for recursively iterating over the menudata.children array(s).
 * @note This function assumes that each child node has a `text` and `url` value.
 * @param child The child node to create a list item from.
 * @param id The string used in conjunctio eith the index for the menu item's id.
 * @param index The specific index of the of the menu item in the array of menu data.
 * @returns a `<li>` element to be appended to the side-nav
 */
function createMenuItem(child, id, index) {
    let newitem = document.createElement("li");
    let menuLabel = document.createElement("a"); // a link element to contain the label
    if (child.children) {
        let menuId = id + "-" + index;
        let divLabel = document.createElement("div");
        divLabel.classList.add("menu-next");
        newitem.append(divLabel);

        menuLabel = document.createElement("label");
        menuLabel.setAttribute("for", menuId);
        menuLabel.classList.add("submenu-label");
        divLabel.append(menuLabel);

        // also use a chevron icon to indicate it has a sub-menu
        let mdIcon = document.createElement("label");
        mdIcon.classList.add("material-icons");
        mdIcon.setAttribute("for", menuId);
        mdIcon.append(document.createTextNode("chevron_right"));
        divLabel.append(mdIcon);

        let menuToggle = document.createElement("input");
        menuToggle.id = menuId;
        menuToggle.name = menuId;
        menuToggle.type = "checkbox";
        menuToggle.classList.add("menu-toggle");
        newitem.append(menuToggle);

        let divMenu = document.createElement("div");
        divMenu.classList.add(menuId, "sub-menu");
        let backToggle = document.createElement("label");
        backToggle.setAttribute("for", menuId);
        backToggle.classList.add("menu-back");

        let backIcon = document.createElement("i");
        backIcon.classList.add("material-icons");
        backIcon.append(document.createTextNode("west"));
        backToggle.append(backIcon);
        backToggle.append(document.createElement("br"));
        backToggle.append(document.createTextNode(child.text));
        divMenu.append(backToggle);
        let subItems = document.createElement("ul");
        for (let i = 0; i < child.children.length; i++) {
            subItems.append(createMenuItem(child.children[i], menuId, i));
        }
        divMenu.append(subItems);
        newitem.append(divMenu);
    }
    else {
        // if no children, then make the `<a>` element a hyperlink
        menuLabel.href = child.url;
        newitem.prepend(menuLabel);
    }
    menuLabel.prepend(document.createTextNode(child.text));
    return newitem;
}


/** 
 * The navtree data (an array) is split across multiple js files (depending on the project's
 * documented objects). Only the root of the data's array (navtree.js) is loaded in the html.
 * We'll need to load the subsequent data dynamically to fill out the side-nav menu when
 * `GENERATE_TREEVIEW = TES`.
 * 
 * This global variable will be our flag to indicate the data is loaded and ready to be
 * accessed/parsed.
 */
var navDataLoaded = false;

/**
 * @brief Moves the "doxygen tabs" (AKA index) into the side-nav list.
 * @warning This function can do nothing if the doxyfile's `DISABLE_INDEX` tag is set to `YES`.
 * @param output The wrapping HTML element to insert the modified elements.
 * @param input The wrapping HTML element to extract (and modify) elements from.
 */
function replaceTabbedIndex() {
    let sideNav = document.querySelector("#slide-out .scroll-wrapper");
    if (menudata && menudata.children) {
        for (let i = 0; i < menudata.children.length; i++){
            sideNav.append(createMenuItem(menudata.children[i], "nav", i));
        }
    }
    else {
        console.error("variable 'menudata' is NULL or does not have any children.");
    }
}

/**************************** TREEVIEW replacement */

function loadScript(scriptName, func)
{
  let head = document.querySelector("head");
  let script = document.createElement('script');
  script.id = scriptName;
  script.type = 'text/javascript';
  script.onload = func;
  script.src = scriptName+'.js';
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
 * @param {array[string, string, any]} child The child node to create a list item from.
 * @param {string} id The string used in conjunctio eith the index for the menu item's id.
 * @param {number} index The specific index of the of the menu item in the array of menu data.
 * @returns a `<li>` element to be appended to the side-nav
 */
function createTreeItem(child, id, index) {
    let newitem = document.createElement("li");
    let menuLabel = document.createElement("a"); // a link element to contain the label
    if (child[2]) {
        let menuId = id + "-" + index;
        let divLabel = document.createElement("div");
        divLabel.classList.add("menu-next");
        newitem.append(divLabel);

        menuLabel = document.createElement("label");
        menuLabel.setAttribute("for", menuId);
        menuLabel.classList.add("submenu-label");
        divLabel.append(menuLabel);

        // also use a chevron icon to indicate it has a sub-menu
        let mdIcon = document.createElement("label");
        mdIcon.classList.add("material-icons");
        mdIcon.setAttribute("for", menuId);
        mdIcon.append(document.createTextNode("chevron_right"));
        divLabel.append(mdIcon);

        let menuToggle = document.createElement("input");
        menuToggle.id = menuId;
        menuToggle.name = menuId;
        menuToggle.type = "checkbox";
        menuToggle.classList.add("menu-toggle");
        newitem.append(menuToggle);

        let divMenu = document.createElement("div");
        divMenu.classList.add("sub-menu");
        divMenu.id = menuId;

        let backToggle = document.createElement("label");
        backToggle.setAttribute("for", menuId);
        backToggle.classList.add("menu-back");

        let backIcon = document.createElement("i");
        backIcon.classList.add("material-icons");
        backIcon.append(document.createTextNode("west"));
        backToggle.append(backIcon);
        backToggle.append(document.createElement("br"));
        // add word-break elements if scoping operator is detected
        let words = child[0].split("::");
        if (words.length > 1) {
            backToggle.innerHTML += words.join("::<wbr>");
        }
        else{
            backToggle.append(document.createTextNode(child[0]));
        }
        divMenu.append(backToggle);
        let subItems = document.createElement("ul");
        if (typeof(child[2]) === "string") {
            loadScript(
                child[2],
                function () {
                    let evalWorkaround = new Function("return " + child[2] + ";");
                    let arrData = evalWorkaround();
                    for (let d = 0; d < arrData.length; d++) {
                        subItems.append(createTreeItem(arrData[d], menuId, d));
                    }
                }
            );
        }
        else { // if not a string nor null, then it is a nested array
            for (let i = 0; i < child[2].length; i++) {
                subItems.append(createTreeItem(child[2][i], menuId, i));
            }
        }
        divMenu.append(subItems);
        newitem.append(divMenu);
    }
    else {
        // if no children, then make the `<a>` element a hyperlink
        menuLabel.href = child[1];
        newitem.prepend(menuLabel);
    }
    menuLabel.classList.add("truncate");
    menuLabel.prepend(document.createTextNode(child[0]));
    return newitem;    
}

function initNavTree() {
    if (typeof(NAVTREE) === "undefined") {
        replaceTabbedIndex(); // Assumes DISABLE_INDEX = NO in Doxyfile
    }
    else {
        let sideNav = document.querySelector("#slide-out .scroll-wrapper");
        var navTree = NAVTREE[0][2];
        for (let i = 0; i < navTree.length; i++) {
            sideNav.append(createTreeItem(navTree[i], "nav", i));
        }
    }
}

// A dummy function that replaces the old function used by doxygen's default navtree feature
function initResizable() { return; }
