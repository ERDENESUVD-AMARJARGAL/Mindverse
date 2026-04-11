document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();

    const email    = document.querySelector('input[name="email"]').value.trim();
    const password = document.getElementById('password').value;

    if (!email) {
        alert('Имэйл хаягаа оруулна уу!');
        return;
    }

    if (!email.includes('@')) {
        alert('Зөв имэйл хаяг оруулна уу!');
        return;
    }

    if (!password) {
        alert('Нууц үгээ оруулна уу!');
        return;
    }

    // Save a minimal session flag so other pages know the user is logged in
    sessionStorage.setItem('user_email', email);

    window.location.href = 'main.html';
});
