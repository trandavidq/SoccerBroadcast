const { ELOOP } = require('constants');
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();


const port = 3000;

function update_db(py_file_name){
    //this function runs the py files located in /soccerLeagues in order to update the db with
    //the current standings
    const spawn = require('child_process').spawn;
    const process = spawn('python',[__dirname+'/soccerLeagues/'+py_file_name]);
    process.stdout.on('data',function(data){
        //console.log(data.toString());
    });
}


//homepage serving
//updating db before any routing
let laliga_data=[]
let bundesliga_data=[];
let epl_data=[];


async function get_data(py_file_name,db_name,data_array,callback){
    //this function updates the db, then updates the arrays with the data from each row
    await callback(py_file_name);
    let db = new sqlite3.Database('./'+db_name+'.db', sqlite3.OPEN_READONLY,(err)=>{
        if(err){
            console.log('error connecting to db');
        }
        else{
            console.log('DB connection successful');
        }
    });
    db.each("SELECT * from "+db_name,(err,row)=>{
    
        data_array.push(row);
        //console.log(row.team_name);
        
    });
    db.close();
    console.log(db_name+" data retrieved");
}

get_data('epl.py','epl_table',epl_data,update_db);
get_data('laliga.py','laliga_table',laliga_data,update_db)
get_data('bundesliga.py','bundesliga_table',bundesliga_data,update_db);


app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/epl',(req,res)=>{
    console.log('EPL get request');
    //epl_data has every row now, with all info
    console.log(epl_data[1].team_name);
    res.render('epl',{theData: epl_data});
});

app.get('/bundesliga',(req,res)=>{
    console.log('Bundesliga get request');
    console.log(bundesliga_data[1].team_name);
    res.render('bundesliga',{theData: bundesliga_data});
});

app.get('/laliga',(req,res)=>{
    console.log('La Liga get request');
    //console.log(laliga_data[0].team_name);
    res.render('laliga',{theData: laliga_data});
    //res.send('debugging')
});


app.listen(port,(portNum)=> console.log(port+' listening'));

