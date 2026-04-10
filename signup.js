function selectRole(role) {
    const studentBtn = document.getElementById('btn-student');
    const teacherBtn = document.getElementById('btn-teacher');
    const roleInput = document.getElementById('role-input');
    const roleDisplay = document.getElementById('role-display');

    if (role === 'student') {
        studentBtn.classList.add('active');
        teacherBtn.classList.remove('active');
        roleInput.value = 'student';
        roleDisplay.textContent = 'Student';
    } else {
        teacherBtn.classList.add('active');
        studentBtn.classList.remove('active');
        roleInput.value = 'teacher';
        roleDisplay.textContent = 'Teacher';
    }
}
