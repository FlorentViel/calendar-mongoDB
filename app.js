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


async function fetchSavedDates() {
  try {
    const response = await fetch('http://localhost:3000/get-dates');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const dates = await response.json();
    console.log(dates); // Log the dates returned by the server
    return dates; // Return the timestamps directly
  } catch (error) {
    console.error('Error fetching dates:', error);
    return [];
  }
}

async function getCalendar() {
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
    await getDates(monthWrap.querySelector(".days"), i);
  }
}

function getWeeks(weekWrapper) {
  let liTag = "";
  for (let i = 0; i < days.length; i++) {
    liTag += `<li>${days[i]}</li>`;
  }
  weekWrapper.innerHTML = liTag;
}

async function getDates(daysWrapper, month) {
  const savedDates = await fetchSavedDates();

  let lastDateofMonth = new Date(currentYear, month + 1, 0).getDate();
  let firstDayofMoth = new Date(currentYear, month, 1).getDay();
  let lastDayofMonth = new Date(currentYear, month, lastDateofMonth).getDay();

  let liTag = "";

  for (let i = firstDayofMoth; i > 0; i--) {
    liTag += `<li></li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    const date = new Date(currentYear, month, i);
    const isHighlighted = savedDates.some(savedTimestamp => {
      const savedDate = new Date(savedTimestamp); // Convert the date string to a Date object
      return savedDate.getFullYear() === date.getFullYear() &&
        savedDate.getMonth() === date.getMonth() &&
        savedDate.getDate() === date.getDate();
    });
    const className = isHighlighted ? 'day highlighted' : 'day';
    liTag += `<li><input type="button" class="${className}" onclick="handleDayClick(${i}, ${month}, ${currentYear}, event)" value="${i}"></li>`;
  }
  
  for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li></li>`;
  }

  daysWrapper.innerHTML = liTag;
}

function handleDayClick(day, month, year, event) {
  const dayButtons = document.querySelectorAll('.day');
  dayButtons.forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('date').value = `${day} ${months[month]} ${year}`;
}

document.getElementById('calendar-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const date = document.getElementById('date').value;
  document.getElementById('error-message').style.display = 'none';

  if (!date) {
    document.getElementById('error-message').textContent = 'Veuillez sélectionner une date.';
    document.getElementById('error-message').style.display = 'flex';
    return;
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
  .then(data => {
    alert(data);
    location.reload();
  })
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('error-message').textContent = 'Une erreur est survenue lors de l\'envoi de la date. Veuillez réessayer.';
  });
});



async function displaySavedDates() {
  const savedDates = await fetchSavedDates();
  console.log('Saved dates:', savedDates); // Log the saved dates
  const datesList = document.querySelector('.saved-dates-list');
  datesList.innerHTML = '';
  for (const dateString of savedDates) {
    const dateObj = new Date(dateString);  // Convert the date string to a Date object
    console.log('Date object:', dateObj); // Log the date object
    if (!isNaN(dateObj.getTime())) { // Check if the date is valid
      const listItem = document.createElement('li');
      listItem.textContent = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      datesList.appendChild(listItem);
    } else {
      console.log('Invalid date:', dateString); // Log the invalid date string
    }
  }
}
displaySavedDates();

getCalendar();
prevBtn.addEventListener("click", () => {
  currentYear = currentYear - 1;
  getCalendar();
});

nextBtn.addEventListener("click", () => {
  currentYear = currentYear + 1;
  getCalendar();
});


