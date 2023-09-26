import axios from 'axios';
// Posts endpoint instance
export const authAPI = axios.create({
    baseURL: "https://notesapp1.pythonanywhere.com/auth"
});
// authentication endpoint instance
export const cruidAPI = axios.create({
    baseURL: "https://notesapp1.pythonanywhere.com/"
    , headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data; charset=utf-8; boundary="another cool boundary";'
    }
})
