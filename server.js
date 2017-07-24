const express =  require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const app = express();

const api= require('./app/routes/api')(app,express);



mongoose.connect(config.db_local, function(err){
	if (err) {
		console.log(err);
	}
	else{
		console.log('connected to database');
	}
})

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use('/api',api);

app.get('*', function(req,res){
	res.sendFile(__dirname + '/public/app/views/index.html')
})

app.get('/test', function(req,res){
    res.write('Just a test server');
    res.end();
});

app.listen(config.port,function(err){
	if (err){
		console.log('error');
	}
	else{
		console.log(`Running on port ${config.port}`);
	}

});	