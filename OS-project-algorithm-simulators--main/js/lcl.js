let text = document.getElementById('theory');

window.addEventListener('scroll', ()=>{
    let value=window.scrollY;
    text.style.top= value*1.025+ 'px';
    text.style.opacity= 1-(value/700);
    // flowchart.style.top= value*1.025+ 'px';
})

let arr = []; // creating array for input queries by user

// From here we will add eventListener for input the queries and adding head
document.getElementById('add').onclick = inputQueries;
document.getElementById('number').addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        inputQueries();  
});
let head, temp;
document.getElementById('headbtn').onclick = addHead;
document.getElementById('starting').addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        addHead();
});

// function for input queries
function inputQueries() {
    let a = document.getElementById("number").value; // storing the number in variable a
    
    // checking the conditions for a
    if (parseInt(a) < 0 || a == '' || a % 1 !== 0 || parseInt(a) > 199) 
    {
        alert("Please enter a valid positive integer!! (0<= value <= 199)");
        document.getElementById("number").value = '';
    }
    else {
        // Now we will push a in array if all conditions are false
        arr.push(a);
        document.querySelector(".request-queue").insertAdjacentText("beforeend", a + ",");
        document.getElementById("number").value = '';
    }
}

// function to add head
function addHead() {
    temp = document.getElementById('starting').value; // storing the head in variable temp
    // checking the conditions for temp
    if (parseInt(temp) < 0 || temp == '' || temp % 1 !== 0 || parseInt(temp) > 199) {
        alert("Please enter a valid positive integer!! (0<= head <= 199)");
        document.getElementById("starting").value = '';
    }
    else {
        head = temp;
        document.querySelector(".toalert").innerHTML = "Head Added";
    }
}

// To ask whether direction is left and right
var rightDirection = document.getElementById('right');
var leftDirection = document.getElementById('left');

document.querySelector('#cal').addEventListener("click", () => {
    document.querySelector('.time-seek').classList.toggle('toogle-class');
    document.querySelector('#graph').classList.toggle('toogle-class');
});

let arr1 = [];
let right = [];
let left = [];
let diskSize = 199;
let current, distance = 0, seekTime = 0;
document.getElementById('cal').onclick = LOOK;

function LOOK() {

    // check the direction of user selecting left or right
    if (rightDirection.checked)
        direction = "right"
    if (leftDirection.checked)
        direction = "left"
        
    // creating left array and right array
    // numbers less than head will go in left and numbers greater than head will go in right array
    for (let i = 0; i < arr.length; ++i) {
        if (parseInt(arr[i]) < parseInt(head))
            left.push(arr[i]);
        else if (parseInt(arr[i]) > parseInt(head))
            right.push(arr[i]);
    }

    // sorting the left and right array
    left.sort(function (a, b) { return a - b });
    right.sort(function (a, b) { return a - b });

    // for loop will run 2 times for left and right array
    for (var x = 2; x > 0; --x)
    /* if direction is right we will push all elements of right array in particular array 
       and we will calculate seektime */
    {
        if (direction == 'right') {
            for (var i = 0; i < right.length; ++i) {
                current = right[i];
                arr1.push(current);
                distance = Math.abs(current - head);  // calculating distance 
                seekTime = seekTime + distance;       // calculating seektime
                head = current;
            }
            direction = 'left'; 
        }
        /* if direction equal to left we will start from end of an array */
        else if (direction == 'left') {
            for (var i = left.length - 1; i >= 0; --i) {
                current = left[i];
                arr1.push(current);
                distance = Math.abs(current - head);
                seekTime = seekTime + distance;
                head = current;
            }
            direction = 'right';
        }
    }

    // return the calculated SEEKTIME
    document.getElementById("output").setAttribute('value', seekTime);
}

document.querySelector('#clook').addEventListener("click", () => {
    document.querySelector('.time-seek').classList.toggle('toogle-class');
    document.querySelector('#graph').classList.toggle('toogle-class');
});
document.getElementById('clook').onclick = CLOOK;

function CLOOK() {
    // check the direction of user selecting left or right
    if (rightDirection.checked)
        direction = "right"
    if (leftDirection.checked)
        direction = "left"
        
    // creating left array and right array
    // numbers less than head will go in left and numbers greater than head will go in right array
    for (let i = 0; i < arr.length; ++i) {
        if (parseInt(arr[i]) < parseInt(head))
            left.push(arr[i]);
        else if (parseInt(arr[i]) > parseInt(head))
            right.push(arr[i]);
    }

    // sorting the left and right array
    left.sort(function (a, b) { return a - b });
    right.sort(function (a, b) { return a - b });

    // for loop will run 2 times for left and right array
    /* if direction is right we will push all elements of right array in particular array 
       and we will calculate seektime */
    for (var x = 2; x > 0; --x) {
        if (direction == 'right') {
            for (var i = 0; i < right.length; ++i) {
                current = right[i];
                arr1.push(current);
                distance = Math.abs(current - head);
                seekTime = seekTime + distance;
                head = current;
            }
            direction = 'left';
        }

        // Here we will start from first element of left array thats the only difference between LOOK and CLOOK
        else if (direction == 'left') {
            for (var i = 0; i <left.length ; ++i) {
                current = left[i];
                arr1.push(current);
                distance = Math.abs(current - head);
                seekTime = seekTime + distance;
                head = current;
            }
            direction = 'right';
        }
    }
    // return the calculated SEEKTIME
    document.getElementById("output").setAttribute('value', seekTime);
}


document.getElementById('output').disabled = true;


document.getElementById('diagram').onclick = showGraph;
function showGraph() {
    head = document.getElementById('starting').value;
    arr1.splice(0, 0, head);
    var seekSequence = arr1;
    var operationNumber = [];
    var j = 0;
    for (var i = 0; i < arr1.length; ++i) {
        operationNumber[i] = j;
        ++j;
    }

    var data = [{
        x: seekSequence,
        y: operationNumber,
        type: 'lines',
        line: {
            color: 'rgb(0,0,255)'
        },
        marker: {
            color: 'rgb(0,0,0)',
            size: 8
        }
    }];
    var layout = { 
        title: {
            text: 'LOOK/C-look Graph'
        },
        xaxis: {
            gridwidth: 3,
            fixedrange: true,
            tickvals: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
            zeroline: false,
            range: [0, 200],
            title: {
                text: 'Request Queue →'
            }
        },
        yaxis: {
            range: [j, 0],
            ticklen: 10,
            tickformat: '.0f',
            fixedrange: true,
            zeroline: false,
            title: {
                text: 'Operation Number →'
            }
        }
    };
    var config = {
        responsive: true,
        displayModeBar: false
    }
    Plotly.newPlot('graph', data, layout, config);
}