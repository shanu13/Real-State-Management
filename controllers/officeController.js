const { connection } = require('../connection/connection');

//renders back the login page of views folder
exports.getLogin = (req,res) => {
    res.render('office/login')
}



//login credentials in request body
//verify the login credentials
exports.postLogin = (req, res) => {
    // get params ;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    
     //check if username and password are valid

    connection.query(
      //for validating username and password , check if it is present in login database

      `select * from login where username = '${username}' and pass_word = '${password}' and is_admin=1;`,
      (err, rows, fields) => {
        if (!err) {

          // there exist a user with this username and pass_word
        //then create a session with that UserName and agent id
        //redirect to the office route
          if (rows.length > 0) {
            console.log(rows[0].a_id);
            req.session.user = username;
            req.session.officeId = rows[0].a_id;
            //console.log(req.session);
            res.redirect("/office");
          } 
          else {
                      //not a valid user ,redirect back to login route
            console.log("wrong username or password");
            res.redirect("/office/login");
          }
        } else {
          console.log("wrong username or password");
        }
      }
    );
   
  };
 


//render the office home page
exports.getOfficeHome = (req,res) => {

  //check if agentId is logged in
  //else redirect to office login page
    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    //fetches details of all agents
    const query1 = `select a_id,firstname,lastname from agent; select count(p_id) total_count from property; select count(trans_id) total_count from buyers_history; select count(p_id) total_count from property where current_status = 'rented';`
    connection.query(query1,(err,rows,fields) => {
        
        //details of all agents
        const agents = rows[0];

        //count of all properties
        const countp = rows[1];

        //count of sold properties
        const counts = rows[2];

        //select rented properties
        const countr = rows[3]
        // console.log('rows',rows);

            //renders agent office page
            res.render('office/officeHome',{
                agentdata : agents,
                countp : countp,
                counts : counts,
                countr : countr
            })
    });
}


//render profile page of each agent
exports.getAgentProfile = (req,res) => {
  
  //check if agentId is logged in
  //else redirect to office login page
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }

    //fetches the details of the agent from database for profile page
    const agentId = req.params.agentId;
    const query = `select * from agent where a_id = '${agentId}'; select * from property where a_id = '${agentId}'; select count(a_id) total_count from property where a_id = '${agentId}'; 
    select * from property where a_id = '${agentId}' and current_status='sold';  select count(a_id) total_count from property where a_id = ${agentId} and current_status='sold';  
    select * from property where a_id = '${agentId}' and current_status='rented'; select count(a_id) total_count from property where a_id = ${agentId} and current_status='rented';`
    console.log(agentId);
    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    connection.query(query,(err,rows,fields) => {
        if(!err){

      //details of agent
        const agentProfile = rows[0];
        const propertyDetails = rows[1] //property Details of that agent
        const countProperty = rows[2] //total properties count
        const sold = rows[3]  //total sold properties 
        const csold = rows[4] //total sold properties count
        const rented = rows[5] //total rented properties 
        const crented = rows[6] //total rented properties count
        //console.log(rows)

        //render profile page
        res.render('office/profile',{
            profile : agentProfile,
            pdetails : propertyDetails,
            cproperty : countProperty,
            solds : sold,
            csold : csold,
            rented : rented,
            crented : crented

        });
        }else{
            cosnole.log(err);
        } 
    })
}


//to add a new agent
//return the form to add new agent
exports.getAddAgent = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  res.render('office/add_agent')

}


exports.postAddAgent = (req, res) => {
  
  //check if the user is logged in
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }

  //fetches the form data
  let { firstname,lastname,contact,username,password } = req.body;
  contact = +contact;

  const id = Math.floor(Math.random()*200 + 11);
  console.log(req.body,id);

  //insert data into agent & login database
  const query = `insert into agent (a_id , firstname , lastname , is_admin , contact ) values
  ( '${id}' , '${firstname}' , '${lastname}' , 0 , '${contact}');  
   insert into login (username , pass_word , a_id , is_admin ) values
  ('${username}','${password}','${id}', 0);  `;
  connection.query(query,(err,rows,field) => {
    if(!err){
      //added successfully
      res.redirect('/office')
    }else{
      console.log(err);
    }
    
  })
}


//to add a new property
//return the form to add property
exports.getAddProperty = (req, res) => {

  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  
  res.render('office/add_property');
}


//add a new property
exports.postAddProperty = (req, res) => {
  
  //check if the user is logged in
  if(!req.session.officeId){
    res.redirect('/office/login')
    return;
  }

  //fetches the form data
  const id = Math.floor(Math.random()*90000 + 100000);
  let { area,bhk,price,asked_price,city,locality,type,status,owner_id,agent_id } = req.body;
  area = +area;
  bhk = +bhk;price = +price;
  asked_price = +asked_price;
  owner_id = +owner_id;
  agent_id = +agent_id;

  //insert data into property database
  const query = `insert into property (p_id , area , bhk ,asked_price , locality ,city , rent_sell ,current_status , owner_id , a_id , price ) values
  ( '${id}' , '${area}' , '${bhk}' , '${asked_price}' , '${locality}' ,'${city}' ,'${type}' , '${status}' ,'${owner_id}' ,'${agent_id}' ,'${price}');`

  connection.query(query,(err,rows,field)=> {
    if(!err){
      //successfully inserted
      res.redirect('/office');
    }else{
      console.log(err);
    }
  })
  // console.log(req.body);

}


//return total propertyDetails of that agent when clicked
exports.getTotalProperties = (req, res) => {
  
  //check if the user is already logged in
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }

  //then fetch all properties details from database
  const query = `select count(p_id) total_count from property; select * from property;`
  connection.query(query,(err,rows,fields) => {
    const countp = rows[0]; //total_count of property
    const pdetails = rows[1]; //total propertyDetails
    
    //render total_properties page 
    res.render('office/total_properties',{
      countp : countp,
      pDetails : pdetails
    })
  })
  
}


//return total sold propertyDetails of that agent when clicked
exports.getTotalSoldProperties = (req, res) => {
    //check if the user is already logged in
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }

  //then fetch all sold properties details from database
  const query = `select count(trans_id) total_count from buyers_history; select * from property where current_status = 'sold';`
  connection.query(query,(err,rows,fields) => {
    const counts =  rows[0]; //total count of sold properties
    const soldDetails  = rows[1]; //sold properties details
    
    //render sold properties page
    res.render('office/sold_properties',{
      counts : counts,
      soldDetails : soldDetails
    })

  })
 
}

//return total rented propertyDetails of that agent when clicked
exports.getTotalRentedProperties = (req, res) => {
  //check login
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }

  //then fetch all rented properties details from database
  const query = `select count(p_id) total_count from property where current_status = 'rented'; select * from property where current_status = 'rented';`
  connection.query(query,(err,rows,fields) => {
    const rentedp = rows[0]; //rented propertyDetails count
    const rentedDetails = rows[1] //rented propertyDetails
    
    //render rented propertyDetails page
    res.render('office/rented_properties',{
      rentedp : rentedp,
      rentedDetails : rentedDetails
    })
  })
 
}