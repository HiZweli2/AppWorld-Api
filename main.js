  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
  import { getAuth,GoogleAuthProvider,signInWithPopup,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
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
 
  // const email = document.getElementById("email").value;

  // const password = document.getElementById("password").value;

  // const email = "zwelitest@gmail.com";

  // const password = "password";



// console.log(email);

  googleButton.addEventListener('click',googleSignIN); 

  emailButton.addEventListener('click',signUpWithEmail); 
 
  function googleSignIN (){
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
     
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(result._tokenResponse.refreshToken);
      validateResponse(result._tokenResponse.refreshToken);
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

    if(!email || !password ? console.log('error with password or email') : console.log('success'))
    {
      console.log("Invaild email or password")
    }else{
      createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        // ..
      });
    }
  }

  let validateResponse = (refreshToken, user)=>{

    const headers = new Headers("Authorization" , refreshToken)
    headers.append()
   
    fetch("http://localhost:3000/api/post/login",{
      method: "POST",
      headers:headers

      // todo: send user in in the request body
    }).then(response=>{
    })
    console.log(refreshToken);
  }

  // console.log();