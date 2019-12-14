import bullet from './api/BullerBack'

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

async function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector('input[type=email]').value;
  const password = document.querySelector('input[type=password]').value;

  try {
    const resp = await bullet.post('/user/login', {
      email,
      password
    })

    if (resp.status === 403 || resp.status === 401) {
      displayErrorMessage(resp.status)
      console.log('User not found')
    }
    json = await resp.json()

    const { token } = json
    if (token) {
      sessionStorage.setItem('inMemoryToken', token);
      // window.location.href = 'log.html';
    } else {
      console.log('something went wrong')
    }
  }
  catch {
    console.log(new Error(err))
  }
}

const displayErrorMessage = (statusCode) => {
  const errorField = document.querySelector('#error-field');
  errorField.classList.add('visible');
  let message = 'Wrong password and/or email adress';
  errorField.innerHTML = `<div>${message}</div>`;
}
