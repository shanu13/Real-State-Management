
//including all the necessary modules  

//setting the express server
const express = require('express');
const app = express();

//for parsing the incoming request 
const bodyParser = require('body-parser');
const path = require('path');

//
const cookieParser = require('cookie-parser');
const agentRoutes = require('./routes/agentRoutes')
const officeRoutes = require('./routes/officeRoutes')
const {connection,options} = require('./connection/connection')
const session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
// const sessionstore = new MySQLStore(options, connection)


//settings the view engine
//it handles with dynamic data
app.set('view engine' ,'ejs')


//used session for login authentication
app.use(session({ 
    secret: 'my secret',
    resave: false,
    // store: sessionstore,
    saveUninitialized: true,
    cookie: {  maxAge: 30 * 24 * 60 * 60 * 1000 } //session will expire after maxAge is reached
  }))


//middle ware 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname,'public')));



//routes

//home route
app.get('/', (req,res) => {
    res.render('home')
})

//agent route
app.use('/agent',agentRoutes);

//office route
app.use('/office',officeRoutes);



app.get('/logout',(req,res)=>{
    //when user logs out, redirect  back to home page
    req.session.destroy((err)=>{
        res.redirect('/');
    })

})


//server is connected and  ready to serve
app.listen(3000,() => {
    console.log('server connected')
})