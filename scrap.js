const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const fs = require('fs');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

const ValeDoTaquari = [
    'Arroio do Meio','Cachoeira do Sul','Candelária','Lajeado','Passo do Sobrado','Rio Pardo',
    'Santa Cruz do Sul','Sinimbu','Sobradinho','Taquari','Vale do Sol','Vale Verde','Venâncio Aires','Vera Cruz'
]

let Data;
let DataFinal = [];

    (async () => {
        
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
              ],
        });
        const page = await browser.newPage();
        await page.goto('https://ti.saude.rs.gov.br/covid19/');
        //Limpa o Json para não ter append
        DataFinal = [];
        for(x in ValeDoTaquari){
            await page.type('[type=search]', ValeDoTaquari[x]);
            //Nome Municipio
            const [el] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[2]');
            const nome = await el.getProperty('textContent');
            const nomeTxt = await nome.jsonValue();
            //Confirmados
            const [el2] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[3]');
            const confirmados = await el2.getProperty('textContent');
            const confirmadosTxt = await confirmados.jsonValue();
            //Novos confirmados
            const [el3] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[4]');
            const NovosConfirmados = await el3.getProperty('textContent');
            const NovosConfirmadosTxt = await NovosConfirmados.jsonValue();
            //Incidência /100mil habitantes
            const [el4] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[5]');
            const Incidencia = await el4.getProperty('textContent');
            const IncidenciaTxt = await Incidencia.jsonValue();
            //Óbitos
            const [el5] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[6]');
            const Obitos = await el5.getProperty('textContent');
            const ObitosTxt = await Obitos.jsonValue();
            //Novos Óbitos
            const [el6] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[7]');
            const NovosObitos = await el6.getProperty('textContent');
            const NovosObitosTxt = await NovosObitos.jsonValue();
            //Mortalidade /100 mil habitantes
            const [el7] = await page.$x('//*[@id="dataTableMunicipio"]/tbody/tr[1]/td[8]');
            const IndiceMortalidade = await el7.getProperty('textContent');
            const IndiceMortalidadeTxt = await IndiceMortalidade.jsonValue();

            Data = {
                "nome":  nomeTxt,
                "confirmados": confirmadosTxt,
                "novosconfirmados": NovosConfirmadosTxt,
                "incidencia" : IncidenciaTxt,
                "obitos" : ObitosTxt,
                "novosobitos" : NovosObitosTxt,
                "mortalidade" : IndiceMortalidadeTxt,
                }
                DataFinal.push(Data);
                //console.log(Data)
                const inputValue = await page.$eval('[type=search]', el => el.value);
                for (let i = 0; i < inputValue.length; i++) {
                    await page.keyboard.press('Backspace');
                }
        }//Fecha for
            await browser.close();

        //console.log(DataFinal)
        //Escreve JSON
        client.set('dadosx', JSON.stringify(DataFinal, null, 2), (err, reply) => {
        if (err) throw err;
        console.log('Dados Recuperados: ', reply)
    
         });
        
        
    })();
