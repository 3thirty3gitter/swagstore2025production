const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  "projectId": "store-hub-1ty89",
  "appId": "1:1040909284901:web:5519c67fbe3163c80431cc",
  "apiKey": "AIzaSyD6n6_SWrhN6cbTJnvU4G7KcGDoWzZ3jo0",
  "authDomain": "store-hub-1ty89.firebaseapp.com",
  "messagingSenderId": "1040909284901"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, 'admin@example.com', 'password')
  .then((userCredential) => {
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: password');
    process.exit(0);
  })
  .catch((error) => {
    console.log('Error creating user:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists! You can now login.');
    }
    process.exit(1);
  });
