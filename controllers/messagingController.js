const admin = require('firebase-admin');
const serviceAccount = require('../react-native-syscad-firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://react-native-syscad-default-rtdb.firebaseio.com"
  });

  function send(req) {
    const { title, description } = req.body;

    return loadAllUser()
      .then((users) => {
        let validTokens = [];
    
        // Filtrar tokens válidos
        users.forEach(user => {
          if (user.idtoken && user.login && user.setting) {
            if (user.idtoken.trim() !== '') {
              validTokens.push(user.idtoken);
            }
          }
        });
    
        if (validTokens.length === 0) {
          console.error('No tokens válidos encontrados');
          throw new Error('No tokens válidos para enviar el mensaje');
        }

        return validTokens.forEach(token =>{
            let payload = {
                data: {
                title: title,
                body: description,
              },
              token,
            };
            admin.messaging().send(payload)
        })
      })
      .catch((error) => {
        console.log("Error loading users:", error);
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