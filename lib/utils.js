
var keytar = require('keytar');

var prompt = require('prompt');


function setPassword(){

  prompt.start();

  prompt.get({
    properties: {
      username : {
        message : 'Username for uh.is',
        required: true
      },
      password: {
        hidden: true,
        message : 'Password for uh.is',
        required: true
      }
    }
  }, function (err, result) {


    keytar.addPassword('uhPassword',result.username, result.password);

    keytar.addPassword('uhUsername',result.username, result.username);


    console.log(result.username, 'saved!');
  });

}

function deletePassword(){

  var keyTarUser = keytar.findPassword('uhUsername');

  keytar.deletePassword('uhUsername',keyTarUser);

  keytar.deletePassword('uhPassword',keyTarUser);
  console.log(keyTarUser, 'deleted');
}


function getPassword(){
  var keyTarPass = keytar.findPassword('uhPassword');

  var keyTarUser = keytar.findPassword('uhUsername');

  return {
    username : keyTarUser,
    password : keyTarPass
  };
}

module.exports = {
  del :  deletePassword,
  save : setPassword,
  get : getPassword
};
