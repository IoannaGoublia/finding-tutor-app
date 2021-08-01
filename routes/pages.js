const express = require("express");
const cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require("fs");





const db = mysql.createConnection({
    user:'localhost',
    user: "root",
    password : '7112001##',
    database: 'apasxolisi'

});



const router = express.Router();




router.get("/", (req,res)=> {
    res.render('welcome')
});

router.get("/register", (req,res)=> {
    res.render('studentRegister')
});

router.get("/registerprofessor", (req,res)=> {
    res.render('professorRegister')
});


//--------------------------- LOGIN -------------------------

router.get("/login", (req,res)=> {
    
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        console.log(sess.email);
        return res.status(401).render('home' , {
            message: 'You are in!!'
        })
    }
    else {
        res.render('login' ,{
            message: 'You have to login'
        });
    }
});


//--------------------------- HOME -------------------------

router.get("/auth/home", (req,res)=> {
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        console.log(sess.email);
        return res.status(401).render('home' , {
            message: 'You are in!!'
        })
    }
    else {
        res.render('home' ,{
            message: 'You have to login'
        });
    }


});




//--------------------------- HOME -------------------------

router.get("/auth/home", (req,res)=> {
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        console.log(sess.email);
        return res.status(401).render('home' , {
            message: 'You are in!!'
        })
    }
    else {
        res.render('welcome' ,{
            message: 'You have to login'
        });
    }


});



//--------------------------- CATEGORIES -------------------------

router.get("/auth/categories", (req,res)=> {
    
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM lesson GROUP BY LessonCategory;' , (error, results) => {


            return res.status(401).render('categories' ,{
                results : results});
        })

        
    }
    else {
        res.render('categories')
    }

});




//--------------------------- NEWS -------------------------

router.get("/auth/news", (req,res)=> {
    
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        return res.status(401).render('news')
    }
    else {
        res.render('news')
    }


});


//--------------------------- ABOUT -------------------------

router.get("/auth/About", (req,res)=> {
    
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        return res.status(401).render('about')
    }
    else {
        res.render('about')
    }


});


//--------------------------- CONTACT -------------------------

router.get("/auth/contact", (req,res)=> {
    
    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        return res.status(401).render('contact')
    }
    else {
        res.render('login')
    }


});



//--------------------------- PROFILE -------------------------
router.get("/auth/profile", (req,res)=> {

  
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM Student WHERE StudentEmail = ?' ,[sess.email], (error,results)=> {
            if(results.length === 0)
            {
                

                db.query('SELECT * FROM Professor WHERE ProfessorEmail = ?' , [sess.email], (error,data) =>{
                    if(error)
                    {
                        console.log(error);
                    }
                    
                    if(data.length === 0)
                    {
                        res.status(401).render('login' , {
                            message: 'You are Student. You have to Register as Professor!'
                        });
                    }
                    else
                    {
                        const idProfessor = data[0].ProfessorID ;
        
                        db.query('SELECT * FROM lesson WHERE LessonID IN (SELECT LessonID FROM teaches WHERE ProfessorID = ?)' , [idProfessor] , (error,results) => {
                            
                            db.query('SELECT * FROM professor JOIN evaluation ON ProfessorID = EvaluationProfessorID JOIN student ON EvaluationMakerID = StudentID WHERE ProfessorID = ? ;' , [idProfessor] , (error,datas) => {

                                if(error)
                                {
                                    console.log(error);
                                }

                                if(datas.length === 0)
                                {
                                    return res.status(401).render('ProfessorProfile', {
                                        message: 'Professor Profile' ,
                                        results: results, 
                                        data: data
                                    });
                                }

                                else{

                                    db.query('SELECT ROUND((AVG(EvaluationRating) ),1) AS total_rating FROM evaluation WHERE EvaluationProfessorID = ?;' , [idProfessor] , (error,result) => {

                                        return res.status(401).render('ProfessorProfile', {
                                            message: 'Professor Profile' ,
                                            results: results, 
                                            data: data , 
                                            datas : datas ,
                                            result : result
                                        });

                                    })   

                                }
                            })
       
                        })
                    }       
                })      
            }
            else
            {
                return res.status(401).render('StudentProfile', {
                    message: 'THIS IS A STUDENT' ,
                    results: results
                });
            }
        })     
    }
    else {
        res.render('login')
    }
});



//----------------------------------------------LOGOUT-------------------------------------

router.get('/auth/logout' , (req,res) => {

    
    var sess; 
    sess = req.session;
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.render('login');
    });

    

})




// ---------------------------------- CREATE LESSON -------------------------

router.get('/auth/lessons' , (req,res) => {
    var sess; 
    sess = req.session;


    if(sess.email)
    {
        db.query('SELECT * FROM Professor WHERE ProfessorEmail = ?' , [sess.email], (error,data) =>{
            if(error)
            {
                console.log(error);
            }
            
            if(data.length === 0)
            {
                res.status(401).render('login' , {
                    message: 'You are Student. You have to Register as Professor!'
                });
            }
            else
            {
                const idProfessor = data[0].ProfessorID ;

                db.query('SELECT * FROM lesson WHERE LessonID IN (SELECT LessonID FROM teaches WHERE ProfessorID = ?)' , [idProfessor] , (error,results) => {

                    console.log(results);

                    return res.status(401).render('lessons', {
                        message: 'CREATE A LESSON' ,
                        results: results
                    });

                })
            }
           
        })
        
    }
    else{
        res.status(401).render('login');
    }


})



// ------------------------------- CREATE REVIEW -----------------------------------------

router.get('/auth/review' , (req,res) => {
    var sess; 
    sess = req.session;


    if(sess.email)
    {
        db.query('SELECT * FROM Professor WHERE ProfessorEmail = ?' , [sess.email], (error,data) =>{
            if(error)
            {
                console.log(error);
            }
            
            if(data.length === 1)
            {
                res.status(401).render('login' , {
                    message: 'You are Professor. You have to Register as Student!'
                });
            }
            else
            {
                

                return res.status(401).render('CreateReview', {
                    message: 'Make Your Review' 
                    
                });

                
            }
           
        })
        
    }
    else{
        res.status(401).render('login');
    }


})



//--------------------------------my subjects-------------------------------------------

router.get('/auth/mysubjects' , (req,res) => {

    
    var sess; 
   sess = req.session;
   
   if (sess.email) 
   {
       return res.status(401).render('mysubjects')
   }
   else {
       res.render('StudentProfile')
   }

   

});


//----------------------------------CATEGORIES-------------------------------------//

// ------------------------- UNIVERSITY ------------------------------


router.get('/auth/university' , (req,res) => {

        
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΠΑΝΕΠΙΣΤΗΜΙΟ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR UNIVERSITY CATEGORY'
                })
            }
            else
            {
                return res.status(401).render('university' , {
                    message: 'UNIVERSITY CATEGORY' ,
                    data : data
                })
            }
        
        })
        
    }
    else {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΠΑΝΕΠΙΣΤΗΜΙΟ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR UNIVERSITY CATEGORY'
                })
            }
            else
            {
                return res.status(401).render('university' , {
                    message: 'UNIVERSITY CATEGORY' ,
                    data : data
                })
            }
        
        })
    }

});



// ------------------------ART AND COLTURE ----------------

router.get('/auth/ArtAndColture' , (req,res) => {

    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΤΕΧΝΕΣ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR ART AND CULTURE CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'ART AND CULTURE CATEGORY' ,
                    data : data
                })
            }
        
        })
        
    }
    else {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΤΕΧΝΕΣ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR ART AND CULTURE CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'ART AND CULTURE CATEGORY' ,
                    data : data
                })
            }
        
        })
    }
    

});



// ---------------------- SPORTS ---------------------------------------------

router.get('/auth/sports' , (req,res) => {

    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΑΘΛΗΤΙΚΑ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR SPORTS CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'SPORTS CATEGORY' ,
                    data : data
                })
            }
        
        })
        
    }
    else {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΑΘΛΗΤΙΚΑ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR SPORTS CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'SPORTS CATEGORY' ,
                    data : data
                })
            }
        
        })
    }
    

});




// ---------------------- COMPUTER SCIENCE -------------------------------------------

router.get('/auth/ComputerScience' , (req,res) => {

    
    var sess; 
    sess = req.session;
    
    if (sess.email) 
    {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΠΛΗΡΟΦΟΡΙΚΗ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR COMPUTER SCIENCE CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'COMPUTER SCIENCE CATEGORY' ,
                    data : data
                })
            }
        
        })
        
    }
    else {
        db.query('SELECT * FROM professor as P JOIN teaches as T ON P.ProfessorID = T.ProfessorID JOIN lesson as L ON T.LessonID = L.LessonID  WHERE LessonCategory = "ΠΛΗΡΟΦΟΡΙΚΗ" ' , (error,data) => {

            if(data.length === 0 )
            {
                return res.status(401).render('university' , {
                    message : 'THERE NOT LESSONS FOR COMPUTER SCIENCE CATEGORY'
                })
            }
            else
            {
                console.log(data)
                return res.status(401).render('university' , {
                    message: 'COMPUTER SCIENCE CATEGORY' ,
                    data : data
                })
            }
        
        })
    }
    

});


// -------------------------PROFPROD/:ID --------------------------------

router.get('/auth/profprof/:id' , (req,res) => {

   
    var sess; 
    sess = req.session;
    var idid;
    idid = req.params;
   
     
    
   db.query('SELECT * FROM Professor WHERE ProfessorID = ?' , [idid.id], (error,data) =>{
       if(error)
       {
           console.log(error);
       }
       
       if(data.length === 0)
       {
           res.status(401).render('login' , {
               message: 'You are Student. You have to Register as Professor!'
           });
       }
       else
       {
           const idProfessor = data[0].ProfessorID ;

           db.query('SELECT * FROM lesson WHERE LessonID IN (SELECT LessonID FROM teaches WHERE ProfessorID = ?)' , [idProfessor] , (error,results) => {

            db.query('SELECT * FROM professor JOIN evaluation ON ProfessorID = EvaluationProfessorID JOIN student ON EvaluationMakerID = StudentID WHERE ProfessorID = ? ;' , [idProfessor] , (error,datas) => {

                if(error)
                {
                    console.log(error);
                }

                if(datas.length === 0)
                {
                    return res.status(401).render('ProfessorProfile', {
                        message: 'Professor Profile' ,
                        results: results, 
                        data: data
                    });
                }

                else{

                    db.query('SELECT ROUND((AVG(EvaluationRating) ),1) AS total_rating FROM evaluation WHERE EvaluationProfessorID = ?;' , [idProfessor] , (error,result) => {

                        return res.status(401).render('ProfessorProfile', {
                            message: 'Professor Profile' ,
                            results: results, 
                            data: data , 
                            datas : datas ,
                            result : result
                        });

                    })
                    
                    

                }

            })

           })
       }
       

   })

  

   
});






module.exports = router;