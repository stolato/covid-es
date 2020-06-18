'use strict'

const api = use('axios');
const { promises: fs } = use('fs');
const fis = use('fs');
const People = use('App/Models/People');
const Graphic = use('App/Models/Graphic');
const Database = use('Database')


class SyncController {
    async index(){

    }

    async dowload(){
        const link = 'https://bi.static.es.gov.br/covid19/MICRODADOS.csv';
        await api({
            method: "get",
            url: link,
            responseType: "stream"
        }).then(function (response) {
            response.data.pipe(fis.createWriteStream("./files/file.csv"));
        });
        return true;
    }

    async read(){
        await this.clear();
        const itens = await fs.readFile('./files/file.csv', 'latin1');
        var linhas = itens.split(/\r?\n/);
        const t = [];
        const cab = linhas[0].split(';');
        await linhas.forEach((linha) => {
            const dado = linha.split(';');
            const obj = {};
            dado.forEach((v, i) => {
                obj[(cab[i]).toLowerCase()] = v;
            });
            t.push(obj);
        });
        console.log(t.length);
        for (const [idx, obj] of t.entries()) {
            await People.create(obj);
        }
        await this.generate();
        return t[1];
    }

    async clear(){
        const db = await Database.connect('mongodb')
        await db.collection('people').remove();
    }

    async generate(){
        const obito = await People.where('municipio','GUACUI').where('evolucao','Óbito pelo COVID-19').count();
        const cura = await People.where('municipio','GUACUI').where('evolucao','Cura').count();
        const all = await People.where('municipio','GUACUI').count();
        const ativo = await People.where('municipio','GUACUI').where('evolucao','-').count();
        const data = new Date();
        const payload = { morte: obito, recuperado: cura, ativos: ativo, total: all, date: data }
        await Graphic.create(payload);
    }
}

module.exports = SyncController
