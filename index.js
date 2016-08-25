#!/usr/bin/node

var argv = require('yargs').argv;

var Uh = require('./lib/uh.js');

var uh = new Uh;

var utils = require('./lib/utils.js');

var prettyjson = require('prettyjson');

var keytar = require('keytar');

if (argv.config){
  return utils.save();
}

if (argv.delete){
  return utils.del();
}


var cred = utils.get();

if (!cred.username){
  utils.save();
}

var connection = uh.login(cred.username, cred.password);


var query = argv._[0];

connection.then(function (err, res){
  uh.query(query, function (err, res){
    if (err) return console.log(err);

    var string = prettyjson.render(res);

    if (argv.j || argv.json){
      string = JSON.stringify(res, null, 2)
    }

    console.log(string);

    process.exit(0);

  })
})
