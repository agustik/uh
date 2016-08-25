
var cheerio = require('cheerio');
var request = require('request');

var argv = require('yargs').argv;


var iconv = require('iconv-lite');

var Promise = require('promise');

var loginCookie = {};

iconv.skipDecodeWarning = true;


var debug = function (){
  if (argv.v){
    console.log(arguments);
  }
}

function uhToJSON(body){
  // var $ = cheerio.load(body);
  var arr = [];
  // var collapser = $('.okCollapser');

  var json = {};

  json['basic'] = getBasicInfo(body);
  return json;
}
function getBasicInfo(content){
  var $ = cheerio.load(content);

  var trs = $('.okGrunnUppl').find('table tr');
  var obj = {};

  trs.each(function (key, value){
    var tds = $(this).find('td');
    tds.each(function (i, td){
      if ($(this).hasClass('key')){
        var _key = cleanString($(this).text());
        var _value = cleanString($(this).next('.val').text());
        if (_key.length > 1){
          obj[_key] = _value;

        }
      }
    });
  });
  return obj;
}

function cleanString(string){
  return string.replace(/\s\s+|\t+/g, '');
}

var Uh = function (){
  this._loginCookie = false;
  this._login = false;
}

Uh.prototype.query = function (query, callback){
  var url = "https://www.uh.is/okutaekjaskra/leit";

  var form = {
    PermNo:query.toUpperCase(),
    RegNo:"",
    VIN:"",
    Submit:"sækja"
  };

  var self = this;
  request.post(url, {
     form: form,
     headers : {
       Cookie : self._loginCookie
     },
     encoding : 'binary'
    }, function (err, res){
    if (err) return callback(err);

    debug('response headers for login', res.headers, res.statusCode);

    var json = uhToJSON(iconv.decode(res.body.toString('binary'), 'ISO-8859-1'));

    callback(err, json);
  });


}

Uh.prototype.login = function (username, password){
  var self = this;
  var url = "https://uh.is/bitar/askrifendur/DetermineActiveVisitor.jsp";


  var form = {
    FailedURL:"/innskraning/",
    TargetURL:"/Gerast_notandi/",
    Destination:"/",
    Login:username,
    Password:password,
  };

  return new Promise(function (resolve, reject) {
    request.post(url, { form: form }, function (err, res){
      if (err) return reject(err);
      var cookie = res.headers['set-cookie'][0];

      self._loginCookie = cookie;
      debug('response headers for login', res.headers);

      resolve('success');
    });
  });

}


module.exports = Uh;
