const loginButton = document.querySelector('.loginbtn');
if (loginButton) {
  loginButton.addEventListener('click', (event) => handleLogin(event));
}
const logoutButton = document.querySelector('.logoutbtn');
if (logoutButton) {
  logoutButton.addEventListener('click', (event) => handleLogout(event));
}

function handleLogout() {
  sessionStorage.removeItem('inMemoryToken');
  window.location.href = '/login.html';
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector('input[type=email]').value;
  const password = document.querySelector('input[type=password]').value;

  fetch('http://localhost:3030/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((resp) => {
      console.log(resp);
      if (resp.status === 403 || resp.status === 401) {
        displayErrorMessage(resp.status)
        console.log('User not found')
      }
      return resp;
    })
    .then((resp) =>
      resp.json())
    .then(json => {
      const { token } = json
      if (token) {
        sessionStorage.setItem('inMemoryToken', token);
        window.location.href = 'log.html';
      } else {
        console.log('something went wrong')
      }
    })
    .catch(err => console.log(err));
}

const displayErrorMessage = (statusCode) => {
  const errorField = document.querySelector('#error-field');
  errorField.classList.add('visible');
  let message = 'Wrong password and/or email adress';
  errorField.innerHTML = `<div>${message}</div>`;
}
