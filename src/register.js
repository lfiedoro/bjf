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
    const passwords = document.querySelectorAll('input[type=password]');
    const password = passwords[0].value;
    const otherPassword = passwords[1].value;
    // validateForm(email, passwords, name);
    if (password === otherPassword) {
        fetch('http://localhost:3030/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        })
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch(err => console.log(err));
    } else {
        displayErrorMessage();
    }
}
const displayErrorMessage = (statusCode) => {
    const errorField = document.querySelector('#error-field');
    errorField.classList.add('visible');
    let message = 'Passwords do not match.';
    errorField.innerHTML = `<div>${message}</div>`;
}