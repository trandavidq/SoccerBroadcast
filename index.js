const express = require('express');
const app = express();

const port = 3000;



//homepage serving
app.get('/epl',(req,res)=>{
    console.log('EPL get request');

    //runs the python script to create the database
    const spawn = require('child_process').spawn;
    const process = spawn('python',[__dirname+'/soccerLeagues/epl.py']);
    process.stdout.on('data',function(data){
        console.log(data.toString());
    });

    res.redirect('/epl.html');
});

app.get('/bundesliga',(req,res)=>{
    console.log('Bundesliga get request');
    const spawn = require('child_process').spawn;
    const process = spawn('python',[__dirname+'/soccerLeagues/bundesliga.py']);
    process.stdout.on('data',function(data){
        console.log(data.toString());
    });
    res.redirect('/bundesliga.html');
});

app.get('/laliga',(req,res)=>{
    console.log('La Liga get request');
    const spawn = require('child_process').spawn;
    const process = spawn('python',[__dirname+'/soccerLeagues/epl.py']);
    process.stdout.on('data',function(data){
        console.log(data.toString());
    });
    res.redirect('/laliga.html');
});
app.use(express.static(__dirname+'/public'));


app.listen(port,(portNum)=> console.log(port+' listening'));

