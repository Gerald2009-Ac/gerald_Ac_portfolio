javascript
// Display the current year in the website footer.

document.getElementById("year").textContent =
    new Date().getFullYear();


// Set the earliest selectable appointment date to today.

const dateInput = document.getElementById("date");

const today = new Date();

const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.min = localDate;


// Handle the appointment form.

const appointmentForm =
    document.getElementById("appointment-form");

const formMessage =
    document.getElementById("form-message");

appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!appointmentForm.reportValidity()) {
        return;
    }

    const patientName =
        document.getElementById("name").value.trim();

    const service =
        document.getElementById("service").value;

    const appointmentDate =
        document.getElementById("date").value;

    const appointmentTime =
        document.getElementById("time").value;

    formMessage.textContent =
        `Thank you, ${patientName}. Your request for ${service} ` +
        `on ${appointmentDate} at ${appointmentTime} has been prepared. ` +
        `This is a demonstration only. No appointment has been sent ` +
        `or confirmed. Please contact the hospital to arrange your visit.`;

    formMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});

