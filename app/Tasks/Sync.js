'use strict'

const Task = use('Task')
const { promises: fs } = use('fs');
const People = use('App/Models/People');
const Graphic = use('App/Models/Graphic');
const Database = use('Database')

class Sync extends Task {
  static get schedule () {
    return '5 3 * * *'
  }

  async handle () {
    await this.populate();
    console.log('Rodou');
    //this.info('Task Sync handle')
  }

  async populate(){
    //return console.log('populate');
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
      const info = await People.create(obj);
      console.log(info);
    }
    await this.generate();
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

module.exports = Sync
