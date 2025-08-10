import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

// Products
export async function getProducts() {
  // TODO: Replace with Firebase Firestore collection('products').get()
  const filePath = path.join(dataDir, 'products.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

export async function getProductById(id) {
  // TODO: Replace with Firebase Firestore doc('products', id).get()
  const products = await getProducts();
  return products.find(product => product.id === id);
}

export async function addProduct(product) {
  // TODO: Replace with Firebase Firestore collection('products').add(product)
  const products = await getProducts();
  const newProduct = {
    ...product,
    id: 'suit-' + Date.now(),
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  const filePath = path.join(dataDir, 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return newProduct;
}

export async function updateProduct(id, updates) {
  // TODO: Replace with Firebase Firestore doc('products', id).update(updates)
  const products = await getProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  const filePath = path.join(dataDir, 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return products[index];
}

export async function deleteProduct(id) {
  // TODO: Replace with Firebase Firestore doc('products', id).delete()
  const products = await getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  const filePath = path.join(dataDir, 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(filteredProducts, null, 2));
  return true;
}

// Users
export async function getUsers() {
  // TODO: Replace with Firebase Firestore collection('users').get()
  const filePath = path.join(dataDir, 'users.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

export async function getUserByEmail(email) {
  // TODO: Replace with Firebase Firestore collection('users').where('email', '==', email).get()
  const users = await getUsers();
  return users.find(user => user.email === email);
}

export async function getUserById(id) {
  // TODO: Replace with Firebase Firestore doc('users', id).get()
  const users = await getUsers();
  return users.find(user => user.id === id);
}

export async function addUser(user) {
  // TODO: Replace with Firebase Firestore collection('users').add(user)
  const users = await getUsers();
  const newUser = {
    ...user,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  const filePath = path.join(dataDir, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return newUser;
}

// Countries and States
export async function getCountriesStates() {
  // TODO: Replace with Firebase Firestore doc('config', 'countries').get()
  const filePath = path.join(dataDir, 'countries_states.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

