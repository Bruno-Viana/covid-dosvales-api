const express = require ("express");
const app = express();
const scraper = require ("./scrap");
let port = process.env.PORT || 3000;
var cors = require('cors')
const schedule = require('node-schedule');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
let importData = [];


//Adicionar ao Heroku em Buildpack: https://buildpack-registry.s3.amazonaws.com/buildpacks/jontewks/puppeteer.tgz




app.get("/", (req, res) =>{
    res.send("/api/dados para acessar a api.");
});
client.get('dadosx', (err, reply) => {
    if (err) throw err;
    importData=reply
    console.log('Data importada:', reply)
})
app.get('/api/dados', cors(), function (req, res, next) {
    res.send(importData)
})

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', "Content-Type");
    next();
});

app.listen(port, () =>{
    console.log("Rodando na porta" + port)
});

schedule.scheduleJob('0 */1 * * *', function(){
    scraper;
    console.log('Entrou Scheduler')
    client.get('dadosx', (err, reply) => {
        if (err) throw err;
        importData=reply
        console.log('Novos dados apos scraping')
    })
    console.log('Refresh de dados')
    app.get('/api/dados', cors(), function (req, res, next) {
        res.send(importData)
    })
  });
