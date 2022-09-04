import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8081';

export const getAllUsers = () => axios.get('/management/api/v1/users');

export const logout = () => axios.get('/logout');


export const login = (username, password) => {
    const options = {
        url: `/login?login=${username}&password=${password}`,
        method: 'POST',
    };
    return axios(options);
}


export const addUser = async (user) => {
    const data = {
        username: user.username,
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        dateofbirth: user.dateofbirth
    }
    return axios.post('/management/api/v1/users/add', data);
}


export const editUser = (user) => {
    const data = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: 'null',
        first_name: user.first_name,
        last_name: user.last_name,
        dateofbirth: user.dateofbirth
    }
    return axios.put('/management/api/v1/users/update', data);
}

export const deleteUsers = (ids) => {
    return axios.delete('/management/api/v1/users/delete/' + ids);
}