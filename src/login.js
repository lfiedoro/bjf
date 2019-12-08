let inMemoryToken;
console.log(`your token is ${inMemoryToken}`);

const loginButton = document.querySelector('.loginbtn');
if(loginButton) {
    loginButton.addEventListener('click', (event) => handleLogin(event));
}


function handleLogin() {
    event.preventDefault();
    const username = document.querySelector('input[type=text]').value;
    const password = document.querySelector('input[type=password]').value;

    const { jwt_token } = { jwt_token: `${username}-${password}` };
    inMemoryToken = jwt_token;
    console.log(inMemoryToken);

    window.location.href = 'dailyLog.html';
}

function handleLogout () {
  inMemoryToken = null;
  Router.push('/login')
}

// async function handleLogin() {
//     alert('Error')
//     const username = document.querySelector('input[type=text]');
//     const password = document.querySelector('input[type=password]');

//     try {
//         const response = await fetch(`/auth/login`, {
//             method: 'POST',
//             body: JSON.stringify({ username, password })
//         })

//         const { jwt_token } = await response.json()

//         inMemoryToken = jwt_token
//     }
//     catch {
//         alert('Error');
//     }
// }
