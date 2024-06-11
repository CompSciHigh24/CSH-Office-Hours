document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function() {
    const teacherName = this.getAttribute('data-teacher-name');

    // Display the selected teacher's name
    const selectedTeacherDiv = document.getElementById('selectedTeacher');
    selectedTeacherDiv.innerHTML = `<h3>Office Hours with ${teacherName}</h3>`;

    // Fetch and display appointments for the selected teacher
    fetch(`/teacher/${teacherName}/appointments`)
      .then(response => response.json())
      .then(appointments => {
        const appointmentsList = document.getElementById('appointmentsList');
        appointmentsList.innerHTML = ''; // Clear current list

        appointments.forEach(appointment => {
          const student = appointment.student_id;
          const appointmentCard = `
            <div class="row">
              <div class="card col-sm-12 col-md-6 col-lg-4">
                <div class="card-body">
                  <h5 class="card-title">${student.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${student.grade}</h6>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${student.email}</h6>
                  <p class="card-text">Appointment Date: ${new Date(appointment.date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          `;
          appointmentsList.innerHTML += appointmentCard;
        });
      });
  });
});
