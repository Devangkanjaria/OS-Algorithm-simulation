let text = document.getElementById('theory');
let flowchart = document.getElementById('flow_chart');

window.addEventListener('scroll', ()=>{
    let value=window.scrollY;
    text.style.top= value*1.025+ 'px';
    text.style.opacity= 1-(value/700);
    // flowchart.style.top= value*1.025+ 'px';
})


// Get references to the philosopher input elements
const philosopher1 = document.getElementById('philosopher1');
const philosopher2 = document.getElementById('philosopher2');
const philosopher3 = document.getElementById('philosopher3');
const philosopher4 = document.getElementById('philosopher4');
const philosopher5 = document.getElementById('philosopher5');

// Initialize the state of the chopsticks and philosophers
let chopsticks = [false, false, false, false, false];
let philosophers = ['thinking', 'thinking', 'thinking', 'thinking', 'thinking'];

// Define a function to update the state of the philosophers
function updatePhilosophers() {
  philosopher1.value = philosophers[0];
  philosopher2.value = philosophers[1];
  philosopher3.value = philosophers[2];
  philosopher4.value = philosophers[3];
  philosopher5.value = philosophers[4];
}

// Define a function to simulate a philosopher eating
function eat(i) {
  // Check if the philosopher can eat
  if (!chopsticks[i] && !chopsticks[(i + 1) % 5]) {
    // Update the state of the chopsticks and philosopher
    chopsticks[i] = true;
    chopsticks[(i + 1) % 5] = true;
    philosophers[i] = 'eating';
    
    // Wait for a random amount of time to simulate eating
    setTimeout(() => {
      // Update the state of the chopsticks and philosopher
      chopsticks[i] = false;
      chopsticks[(i + 1) % 5] = false;
      philosophers[i] = 'thinking';
      // Update the display of philosophers
      updatePhilosophers();
    }, Math.floor(Math.random() * 5000) + 1000); // Wait for 1-5 seconds
  }
}

// Define a function to start the simulation
function startSimulation() {
  // Initialize the state of the philosophers
  philosophers = ['thinking', 'thinking', 'thinking', 'thinking', 'thinking'];
  // Update the display of philosophers
  updatePhilosophers();
  // Start the simulation by calling the eat function for each philosopher
  for (let i = 0; i < 5; i++) {
    setInterval(() => eat(i), 1000);
  }
}

// Attach the startSimulation function to the simulate button
const simulateButton = document.getElementById('simulate');
simulateButton.addEventListener('click', startSimulation);
