const admin = require('firebase-admin');
const serviceAccount = require('../react-native-syscad-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-native-syscad-default-rtdb.firebaseio.com",
});

  function send(req) {
    const { title, description } = req.body;
  
    return loadAllUser()
      .then((users) => {
        let validTokens = [];
  
        users.forEach((user) => {
          if (user.idtoken && user.login && user.setting) {
            if (user.idtoken.trim() !== "") {
              validTokens.push(user.idtoken);
            }
          }
        });
  
        if (validTokens.length === 0) {
          console.error("No tokens válidos encontrados");
          throw new Error("No tokens válidos para enviar el mensaje");
        }
  
        return Promise.all(validTokens.map(async (token) => {
          try {
              await admin.messaging().send({
                token,
                data: {
                  title: title,
                  body: description,
                },
              });
              return { success: true, token };
          } catch (error) {
            return { success: false, token, error: error.message };
          }
        }));
      }).then((results) => {
        const successes = results.filter(result => result.success).map(result => result.token);
        const failures = results.filter(result => !result.success).map(result => ({ token: result.token, error: result.error }));
        console.log("Éxito:", successes.length, "tokens");
        console.log("Fracaso:", failures.length, "tokens");
        return true;
      })
      .catch((error) => {
        console.log("Error loading users:", error);
        return false
      });
  }

function loadAllUser(){
    let dbRef=admin.database().ref('/users');
    let defen=new Promise((resolve,reject)=>{
        dbRef.once('value',(snap)=>{
            let data=snap.val();
            let users= [];
            for(var property in data){
                users.push(data[property]);
            }
            resolve(users);
        },(err)=>{
            reject(err);
        });
    });
    return defen;
}

module.exports={send}