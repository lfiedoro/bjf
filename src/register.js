const signUpButton = document.querySelector('.registerbtn');
if (signUpButton) {
    signUpButton.addEventListener('click', (event) => {
        event.stopPropagation();
        handleSignUp(event);
    });
}

function handleSignUp(event) {
    console.log('rejestruje');

    event.preventDefault();
    const email = document.querySelector('input[type=email]').value;
    const name = document.querySelector('input[type=text]').value;
    const password = document.querySelectorAll('input[type=password]');
    // const confirmPassword = document.querySelector('input[type=password]').value;
    console.log(password);
    if (password[0].value != password[1].value) {
        fetch('http://localhost:3030/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        })
            .then((resp) => resp.json())
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch(err => console.log(err));
    } else {
        console.log('hasla sie nie zgadzają');
    }
}
