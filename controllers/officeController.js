const { connection } = require('../connection/connection');

exports.getLogin = (req,res) => {
    res.render('office/login')
}


exports.postLogin = (req, res) => {
    // get params ;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    
    connection.query(
      `select * from login where username = '${username}' and pass_word = '${password}' and is_admin=1;`,
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            console.log(rows[0].a_id);
            req.session.user = username;
            req.session.officeId = rows[0].a_id;
            console.log(req.session);
            res.redirect("/office");
          } else {
            console.log("wrong username or password");
            res.redirect("/office/login");
          }
        } else {
          console.log("wrong username or password");
        }
      }
    );
   
  };
 


exports.getOfficeHome = (req,res) => {

    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    const query1 = 'select a_id,firstname,lastname from agent;'
    connection.query(query1,(err,rows,fields) => {
        const agents = rows;
        console.log('rows',rows);
        
            res.render('office/officeHome',{
                agentdata : agents
            })
    });
}

exports.getAgentProfile = (req,res) => {
    const agentId = req.params.agentId;
    const query = `select * from agent where a_id = '${agentId}'; select * from property where a_id = '${agentId}'`
    console.log(agentId);
    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    connection.query(query,(err,rows,fields) => {
        if(!err){
        const agentProfile = rows[0];
        const propertyDetails = rows[1]
        console.log(rows)
        res.render('office/profile',{
            profile : agentProfile,
            pdetails : propertyDetails
        });
        }else{
            cosnole.log(err);
        }
        
    })
}