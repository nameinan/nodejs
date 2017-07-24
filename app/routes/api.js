const User = require('../models/user');
const config = require('../../config');
const Story = require('../models/story');
const secretKey =  config.secretKey;
const jsonwebtoken = require('jsonwebtoken');

function createToken(user){
      const token= jsonwebtoken.sign({
            id:user._id,
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

    //middle ware
    api.use(function(req,res,next){
           console.log('Somebody just login application');
           const token = req.body.token || req.param('token')|| req.header('x-access-token');
           if (token) {
               jsonwebtoken.verify(token,secretKey,function(err,decoded){
                   if (err) {
                      res.status(403).send({success:false,message:'Failure to authenticate user'});
                   }else{
                       req.decoded=decoded;
                       next();
                   }
               });
           }else{
               res.status(403).send({success:false,message:'No token provided'});
           }
    });

    //destination -provide a legitimate token
   api.route('/')

    .post(function(req,res){
        const story = new Story({
          caeator : req.decoded.id,
          content: req.body.content
          })
        story.save(function(err){
            if (err) {
              res.send(err);
              return;
            }
            res.send({message:'Story is created'});
        }); 
    })

    .get(function(req,res){
       Story.find({
        caeator : req.decoded.id
       },function(err,stories){
            if (err) {
               res.send(err);
                return;
            }
          res.json(stories);
       });
    });

    return api;
}