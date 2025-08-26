const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = ()=> localStorage.getItem('token');
export const authHeader = ()=> ({ 'Authorization': `Bearer ${token()}` });

export const get = (url)=> fetch(API+url, { headers: { 'Content-Type':'application/json', ...authHeader() } }).then(r=>r.json());
export const del = (url)=> fetch(API+url, { method:'DELETE', headers: { 'Content-Type':'application/json', ...authHeader() } }).then(r=>r.json());
export const post = (url, body)=> fetch(API+url, { method:'POST', headers: { 'Content-Type':'application/json', ...authHeader() }, body: JSON.stringify(body) }).then(r=>r.json());
export const put = (url, body)=> fetch(API+url, { method:'PUT', headers: { 'Content-Type':'application/json', ...authHeader() }, body: JSON.stringify(body) }).then(r=>r.json());

export const upload = (url, formData)=> fetch(API+url, { method:'POST', headers: { ...authHeader() }, body: formData }).then(r=>r.json());
