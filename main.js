  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
  import { getAuth,GoogleAuthProvider,signInWithPopup,
           createUserWithEmailAndPassword,
           signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCS0Jyb9pmxo34I-1fp55e1e1ioIarNeos",
    authDomain: "appworld-53628.firebaseapp.com",
    projectId: "appworld-53628",
    storageBucket: "appworld-53628.appspot.com",
    messagingSenderId: "636952747084",
    appId: "1:636952747084:web:a89c17d373d7c34d2668e9",
    measurementId: "G-NBEMNQ78E5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleButton = document.getElementById("googleButton");

  const emailButton = document.getElementById("emailButton");

  const signInButton = document.getElementById("signInButton");
 

  googleButton.addEventListener('click',googleSignIN); 

  emailButton.addEventListener('click',signUpWithEmail); 

  signInButton.addEventListener('click',signInWithEmail); 
 
  function googleSignIN (){
    signInWithPopup(auth, provider)
    .then((response) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(response);
     console.log(response);
      const token = credential.accessToken;
      // The signed-in user info.
      const userEmail = response._tokenResponse.email;
      const refreshToken = response._tokenResponse.refreshToken;
      const userfirstName = response._tokenResponse.firstName;
      const userlastName = response._tokenResponse.lastName;
      saveCredentials(userEmail,refreshToken,userfirstName,userlastName);
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    })
  };


  function signUpWithEmail (){

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
      createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        // Signed in 
        console.log(userCredential);
        userCredential._tokenResponse.firstName = name;
        userCredential._tokenResponse.lastName = surname;
        const userEmail = userCredential._tokenResponse.email;
        const refreshToken = userCredential._tokenResponse.refreshToken;
        const userfirstName = userCredential._tokenResponse.firstName;
        const userlastName = userCredential._tokenResponse.lastName;
        console.log(userCredential);
        saveCredentials(userEmail,refreshToken,userfirstName,userlastName);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        // ..
      }); 
  }

  function signInWithEmail(){
    let email = document.getElementById("signInEmail").value;
    let password = document.getElementById("signInPassword").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      console.log(userCredential);
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }



  let saveCredentials = (userEmail,refreshToken,userfirstName,userlastName)=>{
    
    let user = {email:userEmail, name:userfirstName, surname:userlastName};
    fetch("http://localhost:3000/api/post/createUsers",{
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization" : `Bearer ${refreshToken}`
      },
      // todo: send user in in the request body
      body: JSON.stringify(user)
    }).then(response=>{
    })
  }