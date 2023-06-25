// Temp state to store appointments
let appointments = [];

// Function to add an appointment
function addAppointment() {
    const startDate = document.getElementById("start-date").value;
    const startTime = document.getElementById("start-time").value;
    const endDate = document.getElementById("end-date").value;
    const endTime = document.getElementById("end-time").value;
    const description = document.getElementById("description").value;

    // Validate input
    if (!startDate || !startTime || !endDate || !endTime || !description) {
        alert("Please fill in all fields.");
        return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Check if start time is before end time
    if (startDateTime >= endDateTime) {
        alert("Start time should be before end time.");
        return;
    }

    // Check for overlapping appointments
    const overlappingAppointments = appointments.filter(appointment => {
        const appointmentStart = new Date(appointment.start);
        const appointmentEnd = new Date(appointment.end);
        return (startDateTime < appointmentEnd && endDateTime > appointmentStart);
    });

    if (overlappingAppointments.length > 0) {
        alert("An appointment already exists for that time. Please select a different time slot.");
        return;
    }

    // Add the appointment to the appointments array
    appointments.push({
        start: startDateTime,
        end: endDateTime,
        description: description
    });

    // Clear the input fields
    document.getElementById("start-date").value ="";
    document.getElementById("start-time").value = "";
    document.getElementById("end-date").value = "";
    document.getElementById("end-time").value = "";
    document.getElementById("description").value = "";

    // Refresh the calendar
    refreshCalendar();
}
// Function to refresh the calendar display
function refreshCalendar() {
  const calendarBody = document.querySelector("#calendar tbody");

  // Clear the calendar
  while (calendarBody.firstChild) {
      calendarBody.removeChild(calendarBody.firstChild);
  }

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the number of days in the current month
  const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate the calendar grid
  let dayCount = 1;
  for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
          if (i === 0 && j < new Date(currentYear, currentMonth).getDay()) {
              const cell = document.createElement("td");
              row.appendChild(cell);
          } else if (dayCount > numDays) {
              break;
          } else {
              const cell = document.createElement("td");
              cell.textContent = dayCount;

              // Check if there are any appointments for the current day
              const appointmentsForDay = appointments.filter(appointment => {
                  return (appointment.start.getDate() === dayCount &&
                          appointment.start.getMonth() === currentMonth &&
                          appointment.start.getFullYear() === currentYear);
              });

              // Add appointment details to the cell
              appointmentsForDay.forEach(appointment => {
                  const appointmentDescription = document.createElement("p");
                  appointmentDescription.textContent = appointment.description;
                  cell.appendChild(appointmentDescription);
              });

              // Add event listeners to the cells to display appointment details
              cell.addEventListener("click", function() {
                  if (appointmentsForDay.length > 0) {
                      let appointmentDetails = "Appointments for " + dayCount + " " + getMonthName(currentMonth) + " " + currentYear + ":\n\n";
                      appointmentsForDay.forEach(appointment => {
                          const start = appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const end = appointment.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          appointmentDetails += "- " + start + " - " + end + ": " + appointment.description + "\n";
                      });
                      alert(appointmentDetails);
                  } else {
                      alert("No appointments for " + dayCount + " " + getMonthName(currentMonth) + " " + currentYear);
                  }
              });

              row.appendChild(cell);
              dayCount++;
          }
      }

      calendarBody.appendChild(row);
  }
}


// Helper function to get the name of the month
function getMonthName(month) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

// Initial calendar refresh
refreshCalendar();
