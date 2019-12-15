import axios from 'axios';

export default axios.create({
    baseURL: 'http://172.24.80.1:3030',
});