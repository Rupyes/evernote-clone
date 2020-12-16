import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBDp41kYnkkXdqkr_nT2hrLn6f84xPe5nc',
  authDomain: 'evernote-clone-ea09a.firebaseapp.com',
  projectId: 'evernote-clone-ea09a',
  storageBucket: 'evernote-clone-ea09a.appspot.com',
  messagingSenderId: '1068351496599',
  appId: '1:1068351496599:web:feccfa6fc64e80e98664d2',
  measurementId: 'G-H4GWX5M2W6',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('evernote-container')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
