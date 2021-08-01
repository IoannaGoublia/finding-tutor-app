
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const fs = require("fs");



const db = mysql.createConnection({
    user:'localhost',
    user: "root",
    password : '7112001##',
    database: 'apasxolisi'

});


//----------Register Students Function -----------------

exports.register = (req , res) => {

    console.log(req.body);
    
    const {FirstName,LastName,password,passwordRepeat,email,phone,location,address} = req.body ;
    
    db.query('SELECT StudentEmail FROM STUDENT WHERE StudentEmail = ?' , [email] , (error,results) =>{

        if(error)
        {
            console.log(error);
        }

        if(results.length>0)
        {
            return res.render('studentRegister' ,{
                message: 'That email is already in use!'
            });
            
        } else if(password !== passwordRepeat)
        {
            return res.render('studentRegister',{
                message: 'That passwords do not mached!!'
            });
        }
        db.query('INSERT INTO STUDENT SET ?',{ StudentEmail:email , StudentPhone:phone , StudentPassword:password , StudentPasswordRepeat:passwordRepeat , StudentFirstName:FirstName ,StudentLastName: LastName , StudentLocation: location , StudentAddress: address} , (error,results) => {
            if(error)
            {
            console.log(error);
            }
            else {
                console.log(results);
                return res.render('studentRegister',{
                    message: 'User Registered!!'
                });
            }
        } ); 
    });
}





//------------- Register  Professor Function---------

exports.professorRegister = (req,res) => {

    console.log(req.body);
    const {FirstName,LastName,password,passwordRepeat,email,phone,location,address,skills,serviceArea} = req.body ;
   
   
   



 

    db.query('SELECT ProfessorEmail FROM PROFESSOR WHERE ProfessorEmail = ?' , [email] , (error,results) =>{

        if(error)
        {
            console.log(error);
        }

        if(results.length>0)
        {
            return res.render('professorRegister' ,{
                message: 'That email is already in use!'
            });
            
        } else if(password !== passwordRepeat)
        {
            return res.render('professorRegister',{
                message: 'That passwords do not mached!!'
            });
        }

        db.query('INSERT INTO PROFESSOR SET ?',{ ProfessorEmail:email , ProfessorPhone:phone , ProfessorPassword:password , ProfessorPasswordRepeat:passwordRepeat , ProfessorFirstName:FirstName ,ProfessorLastName: LastName , ProfessorLocation: location , ProfessorAddress: address ,ProfessorSkills:skills , ProfessorServicesArea:serviceArea } , (error,results) => {
            if(error)
            {
            console.log(error);
            }
            else {var x = Math.random() * (45 - 10)
                var data1 = fs.readFileSync("./views/marker.json");
                var myObject = JSON.parse(data1);
  
       if (location === "Patras" ) {
            //  Defining new data to be added
            
         let newData = {
             lat: 38.2490092 + (x/1000),
             lng: 21.7105863,
                LN: LastName,
                FN: FirstName
            };

            // Adding the new data to our object
            myObject.push(newData);

            //Writing to our JSON file
            var newData2 = JSON.stringify(myObject);
            fs.writeFile("./views/marker.json", newData2, (err) => {
                //Error checking
              if (err) throw err;
              console.log(newData2);
           });
       }else if (location === "Athens") {
           let newData = {
             lat: 37.9909517 + (x/1000),
              lng: 23.6682988,
              LN: LastName,
                FN: FirstName

           };

            // Adding the new data to our object
            myObject.push(newData);

            // Writing to our JSON file
           var newData2 = JSON.stringify(myObject);
            fs.writeFile("./views/marker.json", newData2, (err) => {
                // Error checking
             if (err) throw err;
               console.log(newData2);
           });


        } else if (location === "Thesaloniki") {
           let newData = {
                lat: 40.68002740878776 + (x/1000),
                lng: 22.970745061324756,
                LN: LastName,
                FN: FirstName

            };

            // Adding the new data to our object
            myObject.push(newData);

            // Writing to our JSON file
            var newData2 = JSON.stringify(myObject);
           fs.writeFile("./views/marker.json", newData2, (err) => {
                // Error checking
              if (err) throw err;
                console.log(newData2);
           });


        }else if (location === "Larisa") {
            let newData = {
                 lat: 39.6310695 + (x/1000),
                 lng: 22.3891266,
                 LN: LastName,
                 FN: FirstName
 
             };
 
             // Adding the new data to our object
            myObject.push(newData);
 
             // Writing to our JSON file
            var newData2 = JSON.stringify(myObject);
             fs.writeFile("./views/marker.json", newData2, (err) => {
                 // Error checking
                 if (err) throw err;
               console.log(newData2);
            });
 
 
        }

                console.log(results);
                return res.render('professorRegister',{
                    message: 'User Registered!!'
                });
            }
    
    

    
       

    
    });
    

}


    )}









//-----------------Login FUNCTION---------

exports.login = async (req,res) => {

   try{
       const {email,password} = req.body;

       if (!email || !password) {
           return res.status(400).render('login' , {
               message: 'Please provide an email and password'
           })
       }

       db.query('SELECT * FROM STUDENT WHERE StudentEmail = ? ' , [email] , async (error,results) => {
           console.log(results);
           
           if(results.length<1)
           {

                db.query('SELECT * FROM professor WHERE ProfessorEmail = ?' ,  [email] , async (error,results) => {
                    console.log(results);

                    if(results.length===0 || password !== results[0].ProfessorPassword)
                    {
                        return res.status(400).render('login' , {
                            message: 'Email or password is incorect!'
                        })
                    }
                    else
                    {
                        //-----------SESSION-----------------
                        var sess;
                        sess = req.session;
                        sess.email = req.body.email;
                        //-----------END  SESSION-----------------
                        return res.status(200).render('home' , {
                            message: 'You are succefully Login! You are a Professor'
                        })

                    }
                })
           }  
           else if( password !== results[0].StudentPassword) 
           {
            return res.status(400).render('login' , {
                message: 'Email or password is incorect!'
            })
           }
           else{
            //-----------SESSION-----------------
            var sess;
            sess = req.session;
            sess.email = req.body.email;
            //-----------END  SESSION-----------------
            return res.status(200).render('home' , {
                message: 'You are succefully Login! You are a Student!'
            })
           }
       })
   }
   catch (error) {
       console.log(error);
   }
};





//---------------- CREATE LESSON ----------------

exports.CreateLesson = async (req,res) => {
    var sess; 
    sess = req.session;
    const {lessonCategory, lessonName, Knowlegde, LessonReviews, priceperhour  } = req.body;

    db.query('SELECT ProfessorID FROM professor WHERE ProfessorEmail = ? ' , [sess.email] , (error,results) => {
        const idProfessor = results[0].ProfessorID ;

        db.query('INSERT INTO lesson SET ? ' , {LessonCategory:lessonCategory , LessonName:lessonName , LessonPricePerHour: priceperhour , LessonΝecessaryΚnowledge:Knowlegde , LessonReviews:LessonReviews } , (error,results)=> {

            if(error)
            {
                console.log(error);
            }
            db.query('SELECT MAX(LessonID) AS maxlessonid FROM lesson' , (error,results)=> {
                const idlesson = results[0].maxlessonid;
                db.query('INSERT INTO TEACHES SET ? ' , {ProfessorID:idProfessor , LessonID:idlesson } , (error,results)=> {
                    if(error)
                    {
                        console.log(error)
                    }
                    console.log("Lesson create succesfuly");
                    res.redirect('/auth/lessons');
                })
            })
        })
    });
}



// -----------------------CREATE REVIEW --------------------------------------

exports.CreateReview = async (req,res) => {
    
    var sess; 
    sess = req.session; 
    console.log(sess.email)

    const {review,idprofessor,rating} = req.body;

    console.log(review,idprofessor,rating);
    

    if (sess.email)
    {
        db.query('SELECT * FROM STUDENT WHERE StudentEmail = ? ' , [sess.email] , async (error,results) => {

            if(results.length === 0 )
            {
                res.status(401).render('login' , {
                    message: 'You are Professor. You have to Register as Student!'
                });
            }
    
            else{
    
                const studentid = results[0].StudentID;
                console.log(studentid)
                db.query('INSERT INTO evaluation SET ? ' , {EvaluationMakerID:studentid , EvaluationProfessorID:idprofessor , EvaluationRating: rating , EvaluationReview:review } , (error,results)=> {
                    if(error)
                    {
                      console.log(error)
                    }
    
                    console.log("Review create succesfuly");
                
                    res.redirect(`/auth/profprof/${idprofessor}`);
    
                })
            }
        
        })
    }
    else
    {
        res.render('login')
    }


    
}




// --------------------------------- SEARCH LESSON -----------------------

exports.SearchLesson = async (req,res) => {

    
    var sess; 
    sess = req.session;
    console.log(sess.email)

    const {txt} = req.body;
    const text = "%" + txt + "%" ;
    console.log(text);

    db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonName LIKE  ? ;' , [text] , (error,data) => {

        if(data.length === 0)
        {
            res.status(401).render('home' , {
                message: 'THERE NOT RESULTS FOR THIS SEARCH. TRY AGAIN!'
            });
        }

        else
        {
            res.status(401).render('university' , {
                message: 'THERE ARE RESULTS FOR THIS SEARCH !!!' , 
                data : data
            });
        }

    })





    
    

}