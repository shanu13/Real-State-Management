//import necessary modues

const { connection } = require("../connection/connection");


//renders back the login page of views folder
exports.getLogin = (req, res) => {
  res.render("agent/login");
};


//login credentials in request body
//verify the login credentials
exports.postLogin = (req, res) => {
  
  // get params ;
  const username = req.body.username;
  const password = req.body.password;

  //check if username and password are valid
  connection.query(

    //for validating username and password , check if it is present in login database
    `select * from login where username = '${username}' and pass_word = '${password}';`,
    (err, rows, fields) => {
      if (!err) {

        // there exist a user with this username and pass_word
        //then create a session with that UserName and agent id
        //redirect to the agent route
        if (rows.length > 0) {
          req.session.user = username;
          req.session.agentId = rows[0].a_id;
          res.redirect("/agent");
        } 
        else {
          //not a valid user ,redirect back to login route
          console.log("wrong username or password");
          res.redirect("/agent/login");
        }
      } 
      else {
        console.log("wrong username or password");
      }
    }
  );
  // perform check on

  
};


//render the agent home page
exports.getAgenthome = (req, res) => {
  let agentInfo;
  let agentId = req.session.agentId;
  let propertyDetails;
  let property_sold_rented;
  
  //console.log("session1 : ", req.session);
  

  //check if agentId exists
  //else redirect to login page
  if(!req.session.agentId){
    res.redirect('/agent/login');
  }

  //fetches the agent data from database
  connection.query(
    `SELECT * FROM agent WHERE a_id = '${agentId}' ; select * from property WHERE a_id = '${agentId}';
     select p_id,area,locality,current_status from property where (current_status = "sold" or current_status = "rented") and a_id = ${agentId}  ; `,
    (err, rows, fields) => {
      //row will contain the ouput of each above query
      //console.log(rows);

      //details about the agent
      agentInfo = rows[0];
      //console.log(agentInfo[0]);

      //all properties of the agent
      propertyDetails = rows[1];
      //console.log("agentinfo d", agentInfo);
     

      //all rented/sold properties of the agent
      property_sold_rented = rows[2];
      //console.log(property_sold_rented);
      

      //renders the agent home page
      res.render("agent/agentHome", {
        info: agentInfo,
        pDetails: propertyDetails,
        sold_rented : property_sold_rented
      });
    }
  );
};




//renders add property page
exports.getAddProperty = (req,res) => {
    const agentId = req.params.agentId;
    
    //only login user can add properties
    if(req.session.agentId == agentId) {
        console.log(agentId);

        //renders add properties page
        res.render('agent/add_property',{
            id : agentId
        });
    }
    else{
        res.redirect('/')
    }
   
}

//fetches details of new property to be added from form
//add that property into properties database
exports.postAddProperty = (req,res) => {

    //fetching form data
    let { area,bhk,price,asked_price,city,locality,type,status,owner_id,agentId } = req.body;
    const propertyId = Math.floor(Math.random()*88000 +11000);
    area = +area;
    bhk = +bhk;
    price = +price;
    asked_price = +asked_price;
    owner_id = +owner_id;
    agentId = +agentId;
    // console.log('working')
    // console.log(req.body)
    // console.log('status',status,type)
    // console.log(propertyId)

    //inserting new property in property database
     const query = `insert into property (p_id , area , bhk ,asked_price , locality ,city , rent_sell ,current_status , owner_id , a_id , price ) values
     ( ${propertyId} , '${area}' , '${bhk}' , '${asked_price}' ,'${locality}'  ,'${city}' ,'${type}' , '${status}' ,'${owner_id}' , '${agentId}' ,'${price}');`
     connection.query(query,(err,rows,field,) => {
       if(!err){
          //property inserted successfully
          res.redirect('/agent');
       }else{
         console.log(err);
       }
     })
}



//this will update the status of property from  available for rent to rented /available for sell to sold and vice versa
exports.postUpdateProperty = (req,res) => {
  
  //get required things to update
  const propertyId = req.params.propertyId;
  const agentId = req.session.agentId;
  const { status } = req.body
  
  //must be a valid agent
  if(!agentId){
    res.redirect('/agent/login');
    return;
  }

  //update the status of property of that agent in database
  const query = `update property set current_status='${status}' where p_id='${propertyId}';`
  connection.query(query,(err,rows,field) => {
    if(!err){

      //updated successfully
      res.redirect('/agent')
    }else{
      console.log(err);
    }
  })

  console.log(propertyId, agentId, status);
}
