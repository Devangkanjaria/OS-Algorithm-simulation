// // This section creates an event listener that triggers when the user scrolls. It adjusts the top and opacity CSS properties of the text element based on the scroll position, creating a parallax effect. The opacity decreases as the user scrolls down

let text = document.getElementById('theory');
let flowchart = document.getElementById('flow_chart');

window.addEventListener('scroll', ()=>{
    let value=window.scrollY;
    text.style.top= value*1.025+ 'px';
    text.style.opacity= 1-(value/700);
    // flowchart.style.top= value*1.025+ 'px';
})

// This section sets up event listeners for buttons (add_button, play_button, reset_button) in an algorithm simulation interface. It listens for clicks on the "Add Process," "Play," and "Reset" buttons

let add_button = document.querySelector(
    ".container>div:last-child>.add-process>.add"
  );
  let table = document.querySelector(".table>table");
  let play_button = document.querySelector(
    ".container>div:first-child>.buttons>.play"
  );
  let reset_button = document.querySelector(
    ".container>div:first-child>.buttons>.reset"
  );
  
  add_button.addEventListener("click", add_process);
  table.addEventListener("click", delete_process);
  play_button.addEventListener("click", run_algorithm);
  reset_button.addEventListener("click", reset_table);

// This function handles the logic for adding a process to the table in the algorithm simulation. It retrieves values for arrival time and burst time, validates them, updates the table, and resets the input fields

  function add_process(e) {
    let arrivalTime = parseInt(document.getElementById("arrival-time").value, 10);
    let burstTime = parseInt(document.getElementById("brust-time").value, 10);
    let tableBody = document.querySelector(".table>table>tbody");
  
    if (
      Number.isInteger(arrivalTime) &&
      Number.isInteger(burstTime) &&
      burstTime > 0 &&
      arrivalTime >= 0
    ) {
      document.querySelector(".error").style.display = "none";
      tableBody.innerHTML += `<tr>
          <td></td>
          <td>${arrivalTime}</td>
          <td>${burstTime}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="del">DEL</td>
        </tr>`;
  
      document.getElementById("arrival-time").value = "";
      document.getElementById("brust-time").value = "";
  
      for (let i = 0; i < table.rows.length; i++) {
        document.querySelector(
          `.table>table>tbody>tr:nth-child(${i + 1})>td:nth-child(1)`
        ).innerHTML = "P" + (i + 1);
      }
    } else {
      document.querySelector(".error").style.display = "block";
    }
  }

  // This function handles the logic for deleting a process from the table. It checks if the clicked element is the "DEL" button and removes the corresponding row from the table.

  function delete_process(e) {
    if (!e.target.classList.contains("del")) {
      return;
    }
    let deleteButton = e.target;
    deleteButton.closest("tr").remove();
  
    for (let i = 0; i < table.rows.length; i++) {
      document.querySelector(
        `.table>table>tbody>tr:nth-child(${i + 1})>td:nth-child(1)`
      ).innerHTML = "P" + (i + 1);
    }
  }

  
  // This function reloads the page, effectively resetting the entire table.
  function reset_table(e) {
    location.reload();
  }
  
  var processArr = [];
  var rowLength;
  var pid;
  var data = {
    header: ["processId", "TAT"],
    rows: [],
  };
  //This function runs the algorithm simulation based on the processes in the table. It calculates various process times (response time, turnaround time, etc.) and updates the table with the results.
   
  function run_algorithm(e) {
    let times = ["st", "ct", "rt", "wt", "tat"];
    rowLength = table.rows.length;
  
    for (let i = 1; i < rowLength; i++) {
      processArr.push({
        at: parseInt(table.rows.item(i).cells.item(1).innerHTML, 10),
        bt: parseInt(table.rows.item(i).cells.item(2).innerHTML, 10),
        pid: "P" + i,
      });
    }
  
    processArr = calculateAllTimes(processArr);
  
    let avgTAT = 0,
      avgWT = 0,
      avgRT = 0;
  
    for (let i = 0; i < processArr.length; i++) {
      avgTAT += processArr[i].tat;
      avgWT += processArr[i].wt;
      avgRT += processArr[i].rt;
      for (let j = 0; j < 5; j++) {
        document.querySelector(
          `.table>table>tbody>tr:nth-child(${i + 1})>td:nth-child(${j + 4})`
        ).innerHTML = processArr[i][times[j]];
      }
    }
  
    document.querySelector(".container>div:first-child>.avg-tat>span").innerHTML =
      (avgTAT / processArr.length).toFixed(2) == "NaN"
        ? 0
        : (avgTAT / processArr.length).toFixed(2);
    document.querySelector(".container>div:first-child>.avg-wt>span").innerHTML =
      (avgWT / processArr.length).toFixed(2) == "NaN"
        ? 0
        : (avgWT / processArr.length).toFixed(2);
    document.querySelector(".container>div:first-child>.avg-rt>span").innerHTML =
      (avgRT / processArr.length).toFixed(2) == "NaN"
        ? 0
        : (avgRT / processArr.length).toFixed(2);
  
    processArr.sort(function (a, b) {
      var keyA = a.ct,
        keyB = b.ct;
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    tableCreate();
    console.log(processArr);
    processArr.forEach((a, index) => {
      data.rows[index] = [a.pid, a.tat];
    });
  
    anychart.onDocumentReady(function () {
      // anychart.theme(anychart.themes.darkEarth);
  
      // set a data from process array for tat chart
  
      console.log(data);
      // create the chart
      var chart = anychart.bar();
  
      // add data
      chart.data(data);
  
      // set the chart title
      chart.title("process TAT comparison");
  
      // draw
      chart.container("container");
      chart.draw();
    });
  }
  
  function calculateAllTimes(arr) {
    let time = Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].at < time) {
        time = arr[i].at;
      }
    }
  
    while (arr.find((el) => el.finish == undefined)) {
      let minBT = Infinity;
      let process = {};
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].at <= time && arr[i].finish != true && arr[i].bt < minBT) {
          minBT = arr[i].bt;
          process = arr[i];
        }
      }
  
      if (minBT === Infinity) {
        time++;
        continue;
      }
  
      process.st = time;
      process.finish = true;
      time += process.bt;
      process.ct = time;
      process.rt = process.st - process.at;
      process.tat = process.ct - process.at;
      process.wt = process.tat - process.bt;
    }
    return arr;
  }
  //This section defines styles and colors for visual representation in the table. 
  var row1 = document.getElementById("row1");
  var row = document.getElementById("row");
  var colors = [
    "#58508d",
    "#bc5090",
    "#ff6361",
    "#ffa600",
    "#fc979e",
    "#a8f796",
    "#b0f287",
    "#f49381",
    "#b2ffda",
  ];
  
  function tableCreate() {
    var z = row1.insertCell(0);
    var w = row2.insertCell(0);
    z.id = "cell1";
    w.id = "cell2";
    document.getElementById("cell1").style.width = "80px";
    document.getElementById("cell2").style.width = "80px";
    z.innerHTML = "Start Time";
    w.innerHTML = processArr[0].st;
    document.getElementById("cell1").style.border = "none";
    document.getElementById("cell2").style.border = "none";
    document.getElementById("cell1").style.background = "#e0e0e0";
    document.getElementById("cell2").style.background = "#e0e0e0";
    document.getElementById("cell1").style.textAlign = "center";
    document.getElementById("cell2").style.textAlign = "center";
  
    for (let i = 0; i < rowLength - 1; i++) {
      var f = i % 9;
      var x = row1.insertCell(i + 1);
      var y = row2.insertCell(i + 1);
      x.id = "c" + i;
      y.id = "cc" + i;
      x.innerHTML = processArr[i].pid;
      y.innerHTML = processArr[i].ct;
      document.getElementById("c" + i).style.width = "50px";
      document.getElementById("cc" + i).style.width = "50px";
      document.getElementById("c" + i).style.height = "35px";
      document.getElementById("cc" + i).style.height = "35px";
      document.getElementById("am").style.margin = "20px";
      document.getElementById("am").style.padding = "20px";
      document.getElementById("c" + i).style.backgroundColor = colors[f];
      document.getElementById("cc" + i).style.backgroundColor = colors[f];
      document.getElementById("c" + i).style.textAlign = "center";
      document.getElementById("cc" + i).style.textAlign = "center";
      document.getElementById("c" + i).style.border = "none";
      document.getElementById("cc" + i).style.border = "none";
    }
  }
  