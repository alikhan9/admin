import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://chatapp.alikhan-zaipoulaiev.fr';

export const getAllUsers = () => axios.get('/management/api/v1/users');

export const getAllGroups = () => axios.get('/management/api/v1/groups');

export const getAllContacts = () => axios.get('/management/api/v1/contacts');

export const getAllMessages = () => axios.get('/management/api/v1/messages');

export const getAllGroupsMessages = () => axios.get('/management/api/v1/groupMessages');

export const getUsersUsernames = () => axios.get('/management/api/v1/users/usernames');

export const getApiHealth = () => axios.get('/management/health');

export const get200HttpRequests = () => axios.get('/management/metrics/http.server.requests?tag=status:200');

export const get404HttpRequests = () => axios.get('/management/metrics/http.server.requests?tag=status:404');

export const getDiskFreeSpace = () => axios.get('/management/metrics/disk.free');

export const getDiskTotal = () => axios.get('/management/metrics/disk.total');




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

export const addMessage = async (message) => {
    return axios.post('/management/api/v1/messages/add', message);
}

export const addGroup = async (group) => {
    const data = {
        name: group.name,
        owner: group.owner,
    }
    return axios.post('/management/api/v1/groups/add', data);
}


export const editUser = (user) => {
    const data = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: 'null',
        first_name: user.first_name,
        last_name: user.last_name,
        dateofbirth: user.dateofbirth,
        is_admin: false,
    }
    return axios.put('/management/api/v1/users/update', data);
}

export const deleteUsers = (ids) => {
    return axios.delete('/management/api/v1/users/delete/' + ids);
}

export const deleteMessages = (ids) => {
    return axios.delete('/management/api/v1/messages/delete/' + ids);
}

export const deleteGroupsMessages = (ids) => {
    return axios.delete('/management/api/v1/groupMessages/delete/' + ids);
}

export const deleteGroups = (ids) => {
    return axios.delete('/management/api/v1/groups/delete/' + ids);
}

export const deleteContacts = (ids) => {
    return axios.delete('/management/api/v1/contacts/delete/' + ids);
}

export const editGroup = (group) => {
    const data = {
        id: group.id,
        name: group.name,
        owner: group.owner,
    }
    return axios.put('/management/api/v1/groups/update', data);
}

export const editContact = (contact) => {
    return axios.put('/management/api/v1/contacts/update', contact);
}

export const editMessage = (message) => {
    return axios.put('/management/api/v1/messages/update', message);
}

export const editGroupMessage = (message) => {
    return axios.put('/management/api/v1/groupMessages/update', message);
}

export const addGroupMessage = (message) => {
    return axios.post('/management/api/v1/groupMessages/add', message);
}

export const addContact = (contact) => {
    return axios.post('/management/api/v1/contacts/add', contact);
}