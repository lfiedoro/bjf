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
  const email = document.querySelector('input[type=text]').value;
  const password = document.querySelector('input[type=password]').value;

  fetch('http://localhost:3030/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((resp) => resp.json())
    .then(json => {
      const { token } = json
      if (token) {
        sessionStorage.setItem('inMemoryToken', token);
        window.location.href = 'log.html';
      }
    })
    .catch(err => console.log(err));
}
