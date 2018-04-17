var config = {
    apiKey: "AIzaSyA9NDAseDMeAKPJJe29g4oB-m3QRxQlXE0",
    authDomain: "walking-dead-68de4.firebaseapp.com",
    databaseURL: "https://walking-dead-68de4.firebaseio.com",
    projectId: "walking-dead-68de4",
    storageBucket: "walking-dead-68de4.appspot.com",
    messagingSenderId: "636464824953"
};
firebase.initializeApp(config);
firebase.auth().languageCode = 'fr';

var uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'http://localhost:8080/cgu'
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

var db = firebase.database();
var personnages = db.ref('personnages');
let myUid = "";

personnages.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.uid === myUid || !childData.uid)
            document.getElementById('name').innerHTML += '<li>' + childData.name + '</li>'
    });
});

function writeUserData(Name) {
    db.ref('personnages/' + name).push({
        name: Name,
        uid: myUid
    });
}

function add() {
    let name = document.getElementById('new').value;
    writeUserData(name);
    window.location.reload();
}

function initApp() {

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            // All datas
            // User is signed in.
            const displayName = user.displayName;
            const email = user.email;
            const emailVerified = user.emailVerified;
            const photoURL = user.photoURL;
            const uid = user.uid;
            const phoneNumber = user.phoneNumber;
            const providerData = user.providerData;


            // retour de l'utilisateur après authentification
            user.getIdToken().then((accessToken) => {
                document.getElementById('sign-in-status').textContent = 'Signed in';
                document.getElementById('sign-in').textContent = 'Sign out';
                document.getElementById('account-details').textContent = JSON.stringify({
                    displayName: displayName,
                    email: email,
                    emailVerified: emailVerified,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    uid: uid,
                    accessToken: accessToken,
                    providerData: providerData
                }, null, '  ');
            });
            myUid = user.uid;
        } else {

            // Gestion de la deconnexion
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
        }
    }, (error) => { // gestion de erreur de connexion
        console.error(error);
    });
}
initApp();

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}