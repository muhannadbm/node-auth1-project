/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const User = require('../users/users-model')

function restricted(req, res, next) {
  try{
if(req.session && req.session.user){
  next()
}
else{
  next({status: 401, message: "You shall not pass!"})
}
}
catch(e) {
  next(e)
}
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  let username = req.body.username
 let [user] =  await User.findBy({username})
if(!user){
  next()
}
else{
  next(  {
    message: 'Username taken',
    status: 422
  })
}
  
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try{
  let username = req.body.username
 let [user] =  await User.findBy({username})
if(!user){
  next(  {
    message: 'Invalid credentials',
    status: 401
  })
}
else{
  next()
}
}
catch(e) {
  next(e)
}
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
if(!req.body.password || req.body.password.length < 4){
  next({status: 422,
  message: "Password must be longer than 3 chars"
  })
}
else{
  next()
}
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {restricted, checkPasswordLength, checkUsernameExists, checkUsernameFree}