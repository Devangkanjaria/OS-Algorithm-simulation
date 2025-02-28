let text = document.getElementById('theory');
let flowchart = document.getElementById('flow_chart');

window.addEventListener('scroll', ()=>{
    let value=window.scrollY;
    text.style.top= value*1.025+ 'px';
    text.style.opacity= 1-(value/700);
    // flowchart.style.top= value*1.025+ 'px';
})


// This function is called when the "Submit" button is clicked.
// It retrieves the input values from the HTML form, creates a table,
// and calls the FIFO1 class to simulate page replacement using the FIFO algorithm.
function FIFO() {
    // Retrieve input values from HTML form
    let arr_1 = document.getElementById("pages").value.split(" ");
    let frames = document.getElementById("frame").value;

    // Convert input values into array of page sequence
    let arr_2 = [];
    for (let i = 0; i < arr_1.length; i++) {
        if (arr_1[i] != " " && arr_1[i] != "") {
            arr_2.push(arr_1[i]);
        }
    }

    // Create table
    createTable("table", frames, arr_2);

    // Call FIFO1 class to simulate page replacement
    let obj = new FIFO1(frames);
    for (let i = 0; i < arr_2.length; i++) {
        obj.refer(arr_2[i]);

        // Add data to table
        adddata("table", i + 1, obj.frames, frames, obj.searchIndex);
    }

    // Print summary of page hits and misses
    output("output", obj.pageMiss, obj.pageMiss + obj.pageHits, frames);
}

// This class simulates page replacement using the FIFO algorithm.
// It keeps track of the number of page hits and misses, as well as the
// current state of the page frames.
class FIFO1 {
    constructor(capacity) {
        this.capacity = capacity;
        this.pageMiss = 0;
        this.pageHits = 0;
        this.searchIndex = -1;
        this.frames = [];
    }

    // This method is called whenever a page reference is made.
    // It checks if the page is already in a frame, and if not,
    // it replaces the oldest page in the frame with the new page.
    refer(token) {
        this.searchIndex = this.frames.indexOf(token);
        if (this.searchIndex == -1) {
            this.pageMiss++;
            this.frames.push(token);
            if (this.frames.length > this.capacity) {
                this.frames.shift();
            }
        } else {
            this.pageHits++;
        }
    }
}

// This function creates the table for displaying the page reference sequence
// and the state of the page frames after each reference.
function createTable(tablename, frames, arr_2) {
    document.getElementById(tablename).innerHTML = "";

    // Create table header with page reference sequence
    let table =
        '<tr><td id="' + tablename + '00" style="font-weight:bolder;">Reference</td>';
    for (let i = 0; i < arr_2.length; i++) {//to make first row , add data etc
        table +=
            '<td style="font-weight:bolder;" id="' +
            tablename +
            "0" +
            (i + 1) +
            '">' +
            arr_2[i] +
            "</td>";
    }
    table += "</tr>";

    // Create rows for each page frame and each reference
    for (let i = 0; i < frames; i++) {//to add data in rows that has frames data
        table +=
            '<tr><td style="font-weight:bolder;"id="' +
            tablename +
            (i + 1) +
            '0">Frame ' +
            (i + 1) +
            "</td>";
        for (let j = 0; j < arr_2.length; j++) {
            table += '<td id="' + tablename + (i + 1) + (j + 1) + '"></td>';
        }
        table += "</tr>";
    }
    frames++;
    table +=
        '<tr><td style="font-weight:bolder;"id="' +
        tablename +
        frames +
        '0">Status</td>';
    for (var j = 1; j <= arr_2.length; j++) {//to add the last row i.e if its miss or hit
        table += '<td id="' + tablename + frames + j + '"></td>';
    }
    table += "</tr>";
    document.getElementById(tablename).innerHTML += table;
}

// function to add data in table
function adddata(tablename, col, objframes, n, searchindex) {
    for (let i = 1; i <= objframes.length; i++) {
        let cell = document.getElementById(tablename + i + "" + col);
        cell.innerHTML = objframes[i - 1];
    }
    n++;
    let cell = document.getElementById(tablename + n + "" + col);
    if (searchindex == -1) cell.innerHTML = "MISS";
    else {
        cell.innerHTML = "HIT";
        document
            .getElementById(tablename + (searchindex + 1) + "" + col)
            .classList.add("bg-success", "text-white");
    }
}

// function to print the summary
function output(id, pageMiss, pages, frames) {
    let output = "";
    let missratio = ((pageMiss / pages) * 100 + "%");
    let hitratio = ((100 - (pageMiss / pages) * 100) + "%");
    output += `<div>Pages: ${pages}</div>`;
    output += `<div>Frames: ${frames}</div>`;
    output += `<div>Page Hits: ${pages - pageMiss}</div>`;
    output += `<div>Page Miss: ${pageMiss}</div>`;
    output += `<div>Hit Ratio: ${hitratio}</div>`;
    output += `<div>Miss Ratio: ${missratio}</div>`;
    document.getElementById(id).innerHTML = output;
}