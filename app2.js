let monthsWrapper = document.querySelector(".months-wrappers");
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");
let yearTxt = document.querySelector(".current-year");

let date = new Date();
let currentYear = date.getFullYear();

let months = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

let days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getCalendar() {
  monthsWrapper.innerHTML = "";

  yearTxt.textContent = currentYear;

  for (let i = 0; i < months.length; i++) {
    let monthWrap = document.createElement("div");
    monthWrap.className = "month-wrapper";

    monthWrap.innerHTML = `<div class="month-header">
    <h3 class="month">${months[i]}</h3>
  </div>
  <ul class="weeks"></ul>
  <ul class="days"></ul>`;

    monthsWrapper.insertAdjacentElement("beforeend", monthWrap);
    getWeeks(monthWrap.querySelector(".weeks"));
    getDates(monthWrap.querySelector(".days"), i);
  }
}

function getWeeks(weekWrapper) {
  let liTag = "";
  for (let i = 0; i < days.length; i++) {
    liTag += `<li>${days[i]}</li>`;
  }
  weekWrapper.innerHTML = liTag;
}

function getDates(daysWrapper, month) {
  //getting last date for this month
  let lastDateofMonth = new Date(currentYear, month + 1, 0).getDate();

  //getting first day of this month
  let firstDayofMoth = new Date(currentYear, month, 1).getDay();

  //getting last day of the month
  let lastDayofMonth = new Date(currentYear, month, lastDateofMonth).getDay();

  let liTag = "";

  //getting all last dates of lost month with value null
  for (let i = firstDayofMoth; i > 0; i--) {
    liTag += `<li></li>`;
  }

//getting all dates of the month
for (let i = 1; i <= lastDateofMonth; i++) {
  liTag += `<input type="button" class="day" onclick="handleDayClick(${i}, ${month}, ${currentYear}, event)" value="${i}">`;
}

//getting first dates of next month with value null
for (let i = lastDayofMonth; i < 6; i++) {
  liTag += `<li></li>`;
}
  daysWrapper.innerHTML = liTag;
}

function handleDayClick(day, month, year, event) {
    // Remove the 'active' class from all buttons
    const dayButtons = document.querySelectorAll('.day');
    dayButtons.forEach(button => button.classList.remove('active'));
  
    // Add the 'active' class to the clicked button
    event.target.classList.add('active');



   // Fill the date field with the selected date
   document.getElementById('date').value = `${day} ${months[month]} ${year}`;
   
}

/* form localStorage */


/*document.getElementById('calendar-form').addEventListener('submit', function(event) {
  //event.preventDefault(); // Prevent page reloading

  const date = document.getElementById('date').value;

    // Check if date is not empty
    if (!date) {
      alert('Please enter a date.');
      return; // Stop the execution of the function
    }

    // Split the date into an array [year, month, day]
    const [year] = date.split('-');

    // Show validation message
    alert(`Vous avez pris rendez-vous le ${year}`);

    // Convert the date string to a Date object
  const dateObject = new Date(date);

    // Get the timestamp
    const timestamp = dateObject.getTime();

    // Save the date to localStorage
    localStorage.setItem('date', date);

    // Saves the timestamp to localStorage
    localStorage.setItem('timestamp', timestamp);

    // Reload the page
   location.reload();

});*/

/* mongodb formulaire */

document.getElementById('calendar-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const date = document.getElementById('date').value;
  document.getElementById('error-message').style.display = 'none';  // Pour cacher le message d'erreur

  // Vérifier si le champ de date est vide
  if (!date) {
    document.getElementById('error-message').textContent = 'Veuillez sélectionner une date.';
    document.getElementById('error-message').style.display = 'flex';  // Pour afficher le message d'erreur
    return;  // Arrêter l'exécution de la fonction
  }

  fetch('http://localhost:3000/save-date', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date: date }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('error-message').textContent = 'Une erreur est survenue lors de l\'envoi de la date. Veuillez réessayer.';
  });
});

/* change year */



getCalendar();
prevBtn.addEventListener("click", () => {
  currentYear = currentYear - 1;
  getCalendar();
});

nextBtn.addEventListener("click", () => {
  currentYear = currentYear + 1;
  getCalendar();
});

