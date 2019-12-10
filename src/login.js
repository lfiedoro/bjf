let inMemoryToken;
console.log(`your token is ${inMemoryToken}`);

const loginButton = document.querySelector('.loginbtn');
if(loginButton) {
    loginButton.addEventListener('click', (event) => handleLogin(event));
}

// function handleLogin() {
//     event.preventDefault();
//     const username = document.querySelector('input[type=text]').value;
//     const password = document.querySelector('input[type=password]').value;

//     const { jwt_token } = { jwt_token: `${username}-${password}` };
//     inMemoryToken = jwt_token;
//     console.log(inMemoryToken);

//     window.location.href = 'dailyLog.html';
// }

function handleLogout () {
    inMemoryToken = null;
    Router.push('/login');
}

function handleLogin() {
    const username = document.querySelector('input[type=text]');
    const password = document.querySelector('input[type=password]');

    fetch('http://192.168.0.171:3030/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then((resp) => {
            const { jwt_token } =  resp.json();
            inMemoryToken = jwt_token;
        })
        .catch(err => console.log(err))
 }
