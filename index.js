const express = require ("express");
const app = express();
const scraper = require ("./scrap");
let port = process.env.PORT || 3000;
var cors = require('cors')
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
let importData = '';


//Adicionar ao Heroku em Buildpack: https://buildpack-registry.s3.amazonaws.com/buildpacks/jontewks/puppeteer.tgz




app.get("/", (req, res) =>{
    res.send("/api/dados para acessar a api.");
});


app.get('/api/dados', cors(), function (req, res, next) {
    client.get('dadosx', (err, reply) => {
    if (err) throw err;
    console.log('reply' + reply)
    importData=reply
    console.log('import data' + importData)
    });
    res.send(importData)
})

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', "http://localhost:3001");
    res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', "Content-Type");
    next();
});

app.listen(port, () =>{
    console.log("Rodando na porta" + port)
});