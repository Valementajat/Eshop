import axios from 'axios';

export const fetchData = () => {
  return axios.get("/api/get");
};

export const registerUser = (data) => {
  return axios.post('/api/user/register', data);
};

export const loginUser = (data) => {
  return axios.post('/api/user/login', data);
};

export const insertData = (data) => {
  return axios.post('/api/insert', data);
};

export const deleteData = (id) => {
  return axios.delete(`/api/delete/${id}`);
};

export const updateData = (id, data) => {
  return axios.put(`/api/update/${id}`, data);
};