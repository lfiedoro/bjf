const entryFormInit = () => {
    let sendBtn = document.querySelector('.loginbtn');
    if (sendBtn) sendBtn.addEventListener('click', send);
    let clearBtn = document.querySelector('.resetbtn');
    if (clearBtn) clearBtn.addEventListener('click', reset);
}

const reset = (e) => {
    e.preventDefault();

    document.querySelector('#entryForm').reset();
};

const getRadioTypeInput = (radioId) => {
    let sv = " ";

    const radio = document.querySelector(radioId).querySelectorAll('input[type=radio]');
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            return radio[i].value;
        }
    }

    // radio.forEach(element => {
    //     if (element.checked) {
    //         if (element.value == "task") {
    //             console.log(element.value);
    //             return "task";
    //         }
    //     }
    // });
};

// const altSend = (e) => {
//     e.preventDefault();
//     console.log('sending');
// }

const send = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const type = getRadioTypeInput('#type-radio');
    const significant = getRadioTypeInput('#sign-radio');
    const date = document.querySelector('.entry-date').value;
    const description = document.querySelector('.description').value;

    console.log(date);
    console.log(description);
    console.log(type, significant);

    let body = {
        "entryType": type,
        "taskState": "incomplete",
        "significationType": significant,
        "date": date,
        "body": description
    };

    console.log(body);

    fetch('http://localhost:3030/api/entries/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }).then(resp => console.log(resp))
        .catch(err => console.log(err));

    // // let ret = validate();
    // if (ret) {
    //     document.querySelector('#entryForm').submit();
    // } else {
    //     alert('dupa');
    // }
};

const wind = window.location.href;

if (wind.includes('entryForm.html')) {
    console.log('entryform init')
    entryFormInit();
}