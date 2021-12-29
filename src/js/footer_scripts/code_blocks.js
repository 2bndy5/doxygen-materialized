
/**
 * Doxygen uses its own (limited) way of highlighting syntax. Furthermore, each line is
 * encapsulated in its own `<div class="line">` which also includes the line's number (if any) as
 * a `<span class="lineno">` element. This is problematic for 2 reasons:
 * 
 * 1. Copying the the text value of all the lines also captures the line numbers.
 * 2. Any code highlighting performed by external JS libs cannot be applied. 
 *    Since syntax guessing (when the html is live) would be limited to 1 line at a
 *    time (unless somehow compensated).
 * 
 * Thus we will transform the code blocks into a 1 row table in which line numbers are 1 column
 * and the literal code is another column. For blocks without line numbers, the resulting table will
 * only have 1 column (for the literal code).
 * 
 * This transformation will take something like
 * @code
 * <div class="fragment">
 *   <div class="line">
 *     <a name="1000x"></a>
 *     <span class="lineno">x</span>
 *     literal code here
 *   </div>
 * </div>
 * @endcode
 * into something like
 * @code
 * <div class="fragment">
 *   <table>
 *     <tablebody>
 *       <tr>
 *         <td>
 *           <a name="1000x"></a>
 *           <span class="lineno">x</span>
 *         </td>
 *         <td>
 *           <!-- copy-to-clipboard button here -->
 *           <div class="highlight">
 *             <pre>
 *               <!-- id is used to copy the element's innerText (via clipboard.js)
 *               <code id="__code_0">literal code</code>
 *             </pre>
 *           </div> 
 *         </td>
 *       </tr>
 *     </tablebody>
 *   </table>
 * </div>
 * @endcode
 */
function transformCodeBlocks() {
    let fragments = document.getElementsByClassName("fragment");
    for (let i = 0; i < fragments.length; i++) {
        let copyDataTargetId = "code__" + i;
        // create the 1-row table
        let table = document.createElement("table");
        let tablebody = document.createElement("tbody");
        table.append(tablebody);
        let tableRow = document.createElement("tr");
        tablebody.append(tableRow);
        
        // create a column for the line numbers
        let lineColumn = document.createElement("td");
        lineColumn.classList.add("line-numbers");
        let linePre = document.createElement("pre");
        lineColumn.append(linePre);

        // create the column to be used for the literal code
        let codeColumn = document.createElement("td");
        let codePre = document.createElement("pre");
        codeColumn.append(codePre);

        // create the copy-to-clipboard button
        let codeCopyBtn = document.createElement("button");
        codeCopyBtn.classList.add("btn-flat", "copy-code-btn", "tooltipped");
        codeCopyBtn.setAttribute("data-clipboard-target", "#" + copyDataTargetId);
        codeCopyBtn.setAttribute("data-position", "left");
        codeCopyBtn.setAttribute("data-tooltip", "copy to clipboard");
        codeCopyBtn.addEventListener("mouseleave", function(event) {
            // reset the tooltip text
            event.target.setAttribute("data-tooltip", "copy to clipboard");
        }, false);
        let copyIcon = document.createElement("span");
        copyIcon.classList.add("material-icons");
        copyIcon.innerHTML = "content_copy";        
        codeCopyBtn.append(copyIcon);

        let codeCode = document.createElement("code");
        codeCode.id = copyDataTargetId;
        codePre.append(codeCopyBtn);
        codePre.append(codeCode);

        // get the elements containing each line
        let lines = fragments[i].getElementsByClassName("line");
        // get the elements containing the line numbers.
        let linenos = fragments[i].getElementsByClassName("lineno");
        
        if (linenos.length > 0) {
            tableRow.append(lineColumn);
        }
        tableRow.append(codeColumn);

        // iterate over each line
        while (lines.length > 0) {
            let spanLineNumber = lines[0].querySelector("span.lineno");
            if (spanLineNumber) {
                // we need the line's hyperlink and the span element containing the line number
                linePre.append(spanLineNumber.previousElementSibling);
                linePre.append(spanLineNumber);
                linePre.lastElementChild.classList.remove("lineno");
                linePre.lastElementChild.classList.add("line-number");
                linePre.lastElementChild.innerHTML = linePre.lastElementChild.innerHTML.trimStart();
                if (linePre.lastElementChild.children.length) {
                    let linkElement = linePre.lastElementChild.getElementsByClassName("line");
                    linkElement[0].innerHTML = linkElement[0].innerHTML.trimStart();
                    // linePre.lastElementChild.firstElementChild.innerHTML = linePre.lastElementChild.firstElementChild.innerHTML.trimStart();
                }
                linePre.innerHTML += "\n";
            }

            // doxygen hardcodes &#160; as psuedo padding to each line with line numbers.
            // remove leading &nbsp; 
            if (lines[0].innerHTML.startsWith("&nbsp;")) {
                codeCode.innerHTML += lines[0].innerHTML.slice(6).trimEnd();
            }
            else {
                codeCode.innerHTML += lines[0].innerHTML;
            }
            lines[0].remove(); // remove original line's element
            if (lines.length > 0) {
                codeCode.append(document.createTextNode("\n"));
            }
        }

        // now replace the original fragment element with the new table structure
        // using prepend here because the popup info exists in hidden trailing div elements
        fragments[i].prepend(table);
    }
}
transformCodeBlocks();

// Setup handling of copy-to-clipboard buttons' events
var copyClipboardHabdler = new ClipboardJS(".copy-code-btn");
copyClipboardHabdler.on('success', function(e) {
    // console.info('Action:', e.action);
    // console.info('Text:', e.text);
    // console.info('Trigger:', e.trigger);
    e.clearSelection();
    e.trigger.setAttribute("data-tooltip", "copied!");
    M.Tooltip.getInstance(e.trigger).open();
});

copyClipboardHabdler.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
