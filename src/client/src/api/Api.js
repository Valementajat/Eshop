import axios from 'axios';

export const fetchData = () => {
  return axios.get("/api/get");
}; //Get data

export const registerUser = (data) => {
  return axios.post('/api/user/register', data);
}; //Change data

export const loginUser = (data) => {
  return axios.post('/api/user/login', data);
};

export const updateUser = (data) => {
  //Getting the user info
  const headers = { Authorization: `Bearer ${data.token}` };

  return axios.put('/api/user/update', data, {headers});
};

export const deleteUser = (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return axios.delete('/api/user/delete', {headers});
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

export const VerifyEmail = (email, token) => {
  return axios.post('/api/user/verifyEmail', {params: {email, token}})
};

export const createUserOrder = (id, userId) => {
  return axios.post('/api/user/createUserOrder', { params: { id, userId } } )
};

export const getUserCarts = (userId) => {
  return axios.get('/api/user/getUserCarts', { params: { userId } });
};

export const getUserOrders = (userId) => {
  return axios.get('/api/user/getUserOrders', { params: { userId } });
};

export const getCartDetails = (userId, cartId) => {
  return axios.get('/api/user/getCartDetails', { params: { userId, cartId } });
};

export const getAllOrders = (token) => {
  return axios.get('/api/admin/getAllOrders', {params: {token}});
};

export const getOrderInfo = (token, orderId) => {
  return axios.get('/api/admin/getOrderInfo', {params: {token, orderId}});
};

export const updateOrderState = (id, data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return axios.put(`/api/admin/updateOrderState/${id}`, {state:data.orderState}, {headers});

};
export const addToCart = (userId, item, cartId) => {
  return axios.post('/api/user/addToCart', {params: {userId, item, cartId}})
};
export const updatedCartItemsQuantity = ( itemToUpdate, cartId, newQuantity ) => {
  return axios.post('/api/user/updatedCartItemsQuantity', {params: {  itemToUpdate, cartId, newQuantity }})
};
export const removeCart = (cartId) => {
  return axios.post('/api/user/removeCart', {params: {cartId}})

};

export const switchCart = (cartId) => {
  return axios.post('/api/user/switchCart', {params: {cartId}})
};

export const createCartFromLocal = (items,userId) => {
  return axios.post('/api/user/createCartFromLocal', {params: {items,userId}})
};
