import axios from 'axios';

export default axios.create({
    baseURL: 'http://172.28.64.1:3030',
    headers: {
        'Content-Type': 'application/json'
    }
})