var express=require("express");
var app = express();
var mysql2=require("mysql2");
var cloudinary=require("cloudinary").v2;
var fileuploader=require("express-fileupload");

app.use(express.static('public'));
app.use(express.urlencoded(true));
app.use(fileuploader());
cloudinary.config({ 
    cloud_name: 'dei6dn3k1', 
    api_key: '291342881824211', 
    api_secret: 'ptZ0K5BE0ePW9Hf5GDHVYfvbVkM' 
});

app.listen("2002",function(){
    console.log("listning at port 2002");
})

app.get("/",function(req,res){
res.sendFile(__dirname+"/public/index.html");
})

app.get("/volKyc",function(req,res){
    res.sendFile(__dirname+"/public/vol-kyc.html");
    })

app.get("/clientKyc",function(req,res){
     res.sendFile(__dirname+"/public/client-profile.html");
     })

app.get("/clientdash",function(req,res){
     res.sendFile(__dirname+"/public/client-dash.html");
    }) 

app.get("/voldash",function(req,res){
    res.sendFile(__dirname+"/public/voldash.html");
    })     
    
app.get("/postjob",function(req,res){
     res.sendFile(__dirname+"/public/postjob.html");
    })    
app.get("/adminDash",function(req,res){
        res.sendFile(__dirname+"/public/admin-dash.html");
    })   
app.get("/userControl",function(req,res){
        res.sendFile(__dirname+"/public/user-cntrl.html");
})  

app.get("/vol-manage",function(req,res){
    res.sendFile(__dirname+"/public/vol-manage.html");
}) 

app.get("/client-manage",function(req,res){
    res.sendFile(__dirname+"/public/client-manage.html");
}) 
app.get("/job-manage",function(req,res){
    res.sendFile(__dirname+"/public/job-manager.html");
}) 
   
app.get("/findJob",function(req,res){
    res.sendFile(__dirname+"/public/find-work.html");
}) 
   

var sql=mysql2.createConnection("mysql://avnadmin:AVNS_VKY9rKWpFUWR9q37Vue@mysql-bce-tushargarg50797-0811.i.aivencloud.com:17097/nexthope");
sql.connect(function(err){
    if(err!=null){
        console.log(err.message);
    }else console.log("connection created successfully");
})

app.get("/do-signup",function(req,res){

    
   sql.query("insert into users(email,pass_word,utype,dos,status) values(?,?,?,current_date,?)",[req.query.email,req.query.pwd,req.query.utype,1],function(err){
    if(err!=null){
        res.send(err.message);
    }else res.send("data saved successfully");
   });
    });

    app.get("/do-login",function(req,res){

        
    
        sql.query("select * from users where email=? and pass_word=?",[req.query.email,req.query.pwd],function(err,result){
         if(err!=null){
             return res.send(err.message);
         }else {
            if(result.length==1){
                if(result[0].status===0){
                    return  res.status(500).send('you have been blocked by the admin!') 
                  }
               return res.send(result);
                
            }else res.status(500).send('incorrect username or password!');
         }
        });
         });

         app.post("/save-volkyc", async function(req,res){
  
            // handling profile pic 
           let picname="nopic.jpg";
           if(req.files!=null){
           picname=req.files.profpic.name;
            picpath=__dirname+"/public/uploads/profile_pics/"+picname;
           await req.files.profpic.mv(picpath);
           await cloudinary.uploader.upload(picpath).then(function(response){
            picname=response.url;
            console.log(picname);
           })
            
           }

        //    handling docpic
           let docname="nodoc.jpg";
           if(req.files!=null){
           docname=req.files.doc.name;
            docpath=__dirname+"/public/uploads/id_proofs/"+docname;
           await req.files.doc.mv(docpath);
           await cloudinary.uploader.upload(docpath).then(function(response){
            docname=response.url;
            console.log(docname);
           })
            
           }

              let b=req.body;
    
            sql.query("insert into volkyc(emailid,uname,contact,address,city,gender,dob,qualification,occupation,info,picpath,idpath) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                [b.inpEmail,b.inpName,b.inpContact,b.inpAddress,b.inpCity,b.inpGender,b.inpDob,b.inpQual,b.inpOccu,b.inpInfo,picname,docname],
                function(err){
             if(err!=null){
                 res.send(err.message);
             }else res.sendFile(__dirname+"/public/vol-data-saved-pop.html");
            });
             });

           app.get("/fetch-vol-info",function(req,res){
               sql.query("select * from volkyc where emailid=?",[req.query.email],function(err,result){
                if(err==null){
                res.send(result);
                }else res.send(err.message);
               })
    })  
    app.get("/check-visit",function(req,res){
        sql.query("select * from volkyc where emailid=?",[req.query.email],function(err,result){
         if(err==null){
         if(result.length==1){
            res.send(true);
            
         }else res.send(false);
         }else res.send(err.message);
        })
    })
           
           
           app.post("/update-volkyc", async function(req,res){
  
            // handling profile pic 
           let picname="nopic.jpg";
           if(req.files&&req.files.profpic){
           picname=req.files.profpic.name;
            picpath=__dirname+"/public/uploads/profile_pics/"+picname;
           await req.files.profpic.mv(picpath);
           await cloudinary.uploader.upload(picpath).then(function(response){
            picname=response.url;
            console.log(picname);
           })
            
           }else if(req.body.oldpic!=null){
            picname=req.body.oldpic;
            console.log(picname);
           }

        //    handling docpic
           let docname="nodoc.jpg";
           if(req.files&&req.files.doc){
           docname=req.files.doc.name;
            docpath=__dirname+"/public/uploads/id_proofs/"+docname;
           await req.files.doc.mv(docpath);
           await cloudinary.uploader.upload(docpath).then(function(response){
            docname=response.url;
            console.log(docname);
           })
            
           }else if(req.body.olddoc!=null){
            docname=req.body.olddoc;
           }

              let b=req.body;
    
            sql.query("update volkyc set uname=?,contact=?,address=?,city=?,gender=?,dob=?,qualification=?,occupation=?,info=?,picpath=?,idpath=? where emailid=?",
                [b.inpName,b.inpContact,b.inpAddress,b.inpCity,b.inpGender,b.inpDob,b.inpQual,b.inpOccu,b.inpInfo,picname,docname,b.inpEmail],
                function(err){
             if(err!=null){
                 res.send(err.message);
             }else res.send("data updated successfully");
            });
             });


        app.post("/save-client", async function(req,res){
  
            
                  let b=req.body;
        
                sql.query("insert into clientkyc(clientid,cname,address,city,contact,business,bprofile,idproof,idnumber,info) values(?,?,?,?,?,?,?,?,?,?)",
                    [b.inpCid,b.inpName,b.inpAddress,b.inpCity,b.inpContact,b.inpFirm,b.inpBprofile,b.inpId,b.inpNum,b.inpInfo],
                    function(err){
                 if(err!=null){
                     res.send(err.message);
                 }else res.send("data saved successfully");
                });
                 });

         app.post("/update-client", async function(req,res){
  
                   
                      let b=req.body;
            
                    sql.query("update clientkyc set cname=?,address=?,city=?,contact=?,bprofile=?,idproof=?,idnumber=?,info=? where clientid=?",
                        [b.inpName,b.inpAddress,b.inpCity,b.inpContact,b.inpBprofile,b.inpId,b.inpNum,b.inpInfo,b.inpCid],
                        function(err){
                     if(err!=null){
                         res.send(err.message);
                     }else res.send("data updated successfully");
                    });
                     });  
                     
         app.get("/fetch-client-info",function(req,res){
                        sql.query("select * from clientkyc where clientid=?",[req.query.cid],function(err,result){
                         if(err==null){
                         res.send(result);
                         }else res.send(err.message);
                        })
                    })
              
            
         app.post("/save-job", async function(req,res){
  
            
         let b=req.body;
              
        sql.query("insert into jobs(jobid,cid,jobtitle,jobtype,address,city,edu,contact) values(?,?,?,?,?,?,?,?)",
              [null,b.inpCid,b.inpJtitle,b.inpType,b.inpAddress,b.inpCity,b.inpEdu,b.inpContact],
                  function(err){
                    if(err!=null){
                    res.send(err.message);
                   }else res.sendFile(__dirname+"/public/vol-data-saved-pop.html");
               });
});


app.get("/showAll",function(req,res){
    sql.query("select * from users",function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/updateStatus",function(req,res){

    
    sql.query("update users set status=? where email=?",[req.query.newstatus,req.query.email],function(err){
     if(err!=null){
         res.send(err.message);
     }else res.send("status updated");
    });
});

app.get("/showAllVol",function(req,res){
    sql.query("select * from volkyc",function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/showAllClient",function(req,res){
    sql.query("select * from clientkyc",function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/fetchCity",function(req,res){
    
    sql.query("select distinct city from jobs",function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/fetchTitle",function(req,res){
    sql.query("select distinct jobtitle from jobs",function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/showJob",function(req,res){
    let query;
    if(req.query.city=="all" && req.query.title!="all"){
        query="select * from jobs where jobtitle=?";
    }else if(req.query.city!="all" && req.query.title=="all"){
        query="select * from jobs where city=?";
    }else if(req.query.city=="all" && req.query.title=="all"){
        query="select * from jobs";
    }else {
        query="select * from jobs where city=? and jobtitle=?"
    }

    sql.query(query,[req.query.city,req.query.title],function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})

app.get("/fetchClientJobs",function(req,res){
    console.log(req.query.e);
    sql.query("select * from jobs where cid=?",[req.query.e],function(err,result){
     if(err==null){
     res.send(result);
     }else res.send(err.message);
    })
})
app.get("/deleteJob",function(req,res){

    
    sql.query("delete from jobs where jobid=?",[req.query.id],function(err){
     if(err!=null){
         res.send(err.message);
     }else res.send("deleted");
    });
});


        
  
        
    


