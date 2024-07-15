var admin = require("../node_modules/firebase-admin");
var serviceAccount = require("../react-native-syscad-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-native-syscad-default-rtdb.firebaseio.com"
});

function send(req){
    const { title, description } = req.body;
    return loadAllUser().then(users=>{
        let tokens=[];
        for(let user of users){
            if(user.idtoken !== undefined && user.login && user.setting ){
                tokens.push(user.idtoken);
            }
        }
        let payload={
            data: {
                title: title,
                description: description
            }
        };
        return admin.messaging().sendToDevice(tokens,payload).then((response) => {
            console.log('Successfully sent message:', response);
            return response
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
        
    }).catch((error) => {
        console.log('Error sending message:', error);
      });;
};


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