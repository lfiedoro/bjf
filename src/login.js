import bullet from './api/BullerBack';

const loginButton = document.querySelector('.loginbtn');
if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
}
const logoutButton = document.querySelector('.logoutbtn');
if (logoutButton) {
    logoutButton.addEventListener('click', event => handleLogout(event));
}

function handleLogout() {
    sessionStorage.removeItem('inMemoryToken');
    window.location.href = '/login.html';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('input[type=email]').value;
    const password = document.querySelector('input[type=password]').value;

    bullet
        .post('/user/login', {
            email,
            password,
        })
        .then(resp => {
            const { token } = resp.data;
            if (token) {
                sessionStorage.setItem('inMemoryToken', token);
                window.location.href = 'log.html';
            } else {
                console.log('something went wrong');
            }
        })
        .catch(err => displayErrorMessage(err.message));
}

const displayErrorMessage = errorMessage => {
    console.log(errorMessage);
    const errorField = document.querySelector('#error-field');
    errorField.classList.add('visible');
    let message = 'Wrong password and/or email adress';
    errorField.innerHTML = `<div>${message}</div>`;
};
