const express = require('express');
const mysql   = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express();
app.use(cors())

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Password',
  database : 'AppWorld'
});
 
// check database connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//middleware to allow all post requests to parse data in the request body
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// listen for all api calls and get the url parsed 
app.all('/api/*' ,jsonParser, (req,res)=>  {
  let geturl = req.path;
    decideAction(geturl,req,res);
  // res.send('all done');
  console.log('response sent');


  });

/**
 * Decides whether to action request as a Get request or POST request
 * @param {*} geturl 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 let decideAction = (geturl,req,res) => {
  let userSql;
  //check if the url has api/post in it (see line 56)
  let checkReqMethod = /api\/post/i;

  if(geturl === "/api/getUsers")
  {
    getUserSql(req,res,userSql);
    return;
  }else if(checkReqMethod.test(geturl) === true)
  {
    postUserSql(geturl,req,userSql,res);
    return;
  }else{
    noValid_apiCall();
    return;
  }
 };


/**
 * Decides based on Url parameters which getSql statement to use to query database
 * @param {*} req 
 * @param {*} res 
 * @param {*} userSql 
 */
let getUserSql = function(req,res,userSql){
  //check what information user wants from the database
    if(req.query.id)
    {
      // userSql =  "select * from users where id='"+ req.query.id + "';";

      userSql = `CALL getUser( ${req.query.id} )`
    }else if(req.query.surname)
    {
      userSql =  "select * from users where surname='" + req.query.surname + "';";
    }else if(Object.keys(req.query).length === 0){
      userSql =  "select * from users;"
  };

  runQuery(res,userSql);
};

/**
 * Decides based on url which postSql statement to use to query database
 * @param {*} geturl 
 * @param {*} req 
 * @param {*} userSql 
 * @param {*} res 
 *
 */
let postUserSql = (geturl,req,userSql,res)=>{  

  //check what information user wants to post the database
  if(geturl === "/api/post/createUsers")
  {
    let name,surname,email,token,groupPermissions,deleted;
    name = req.body.name;
    surname = req.body.surname;
    email = req.body.email;
    token = req.headers.authorization;
    groupPermissions = req.body.groupPermissions;

    userSql = `CALL createUser( ${name},${surname},${email},${token},${groupPermissions} )`;
    sessionStorage.setItem("accessToken", token);
    runQuery(res,userSql);
    return;
  }else if(geturl === "/api/post/signIn")
  {
          userSql = `CALL signIN( ${email},${token})`;
          sessionStorage.setItem("accessToken", token);
          runQuery(res,userSql);
        return;
  }
  else if(req.query.id)
  {
    switch(geturl) {
      case "/api/post/updateUsers":
          for (let i = 0, columns = Object.keys(req.body); i < columns.length; i++) {
              // userSql = "UPDATE users SET "+columns[i] +"='"+Object.values(req.body)[i]+"'"+",Lastupdated = now() WHERE id='"+req.query.id+"';";
              userSql = `CALL updateUser( ${columns[i]},${Object.values(req.body)[i]},${req.query.id})`;
              runQuery(res,userSql);
              return
          };
      case "/api/post/deleteUsers":
        userSql = `CALL deleteUser( ${req.query.id} )`;
        runQuery(res,userSql);
        return;
      default:
        noValid_apiCall(res);
    };
  }else{
    noValid_apiCall(res);
  };
}

/**
 * Queries the databse and returns a response to the client
 * @param {*} res 
 * @param {*} userSql 
 */
 let runQuery = (res,userSql)=>{
  connection.query(userSql, function (error, results, fields) {
      if (error) res.send(error) ;
      res.send(results);
    });  
 };

/**
 * returns a response to client alerting them of an invalid api call
 * @param {*} res 
 */
 let noValid_apiCall = (res)=>{
  res.send("invalid api call , this is typically caused by invalid parameters:(")
 };

app.listen(3000 , '127.0.0.1');

console.log('Now listening port 3000');

