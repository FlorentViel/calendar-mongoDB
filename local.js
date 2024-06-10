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
