const User = require('../models/user');
const config = require('../../config');
const secretKey =  config.secretKey;
const jsonwebtoken = require('jsonwebtoken');

function createToken(user){
      const token= jsonwebtoken.sign({
            _id:user._id,
            name:user.name,
            username:user.username
          },
         secretKey,
            {
               expiresIn:1440
           }
      ) ;
      return token;      
}


module.exports = function(app,express){

    const api = express.Router();

    api.post('/signup',function(req,res){
       
       const user = new User({
          name: req.body.name,
          username:req.body.username,
          password:req.body.password

       });

       user.save(function(err){
       	  if (err) {
       	  	res.send(err);
       	  	return;
       	  }
       	  res.send({message:'User has been created!'});
       });

    });


    api.get('/users',function(req,res){

      User.find(function(err,users){
        if (err) {
          res.send(err);
          return;
        }
        res.json(users)
      })
    });



    api.post('/login',function(req,res){
      User.findOne({
        name:req.body.name
      }).select('password').exec(function(err,user){
          if (err) {
            throw err
          }
          if (!user) {
            res.send({message:'User does not exist'});
          }else if (user) {
                      var validPassword = user.comparePassword(req.body.password);
                      if (!validPassword) {
                       res.send({message:'Invalid  Password'});
                  }
                  else{
                       const token = createToken(user);
                       res.json({
                          success:true,
                          message:'Successfull login!',
                          token: token
                       });

                  }

          }

      });

    });

    return api;
}