'use strict'

const People = use('App/Models/People');
const Graphic = use('App/Models/Graphic');
const Database = use('Database');

class PersonController {
    async index({ params }){
        const city = params.id;
        const obito = await People.where('municipio',city).where('evolucao','Óbito pelo COVID-19').count();
        const cura = await People.where('municipio',city).where('evolucao','Cura').count();
        const all = await People.where('municipio',city).count();
        const ativo = await People.where('municipio',city).where('evolucao','-').count();
        const graphic = await Graphic.query().orderBy('date','desc').fetch();
        return  { morte: obito, recuperado: cura, ativos: ativo, total: all, graphics: graphic }
    }

    async getCitys(){
        const list = [];
        const citys = await People.avg('municipio', { name: '$municipio' });
        for(const [i, obj] of citys.entries()){
          if(obj._id.name !== null) {
            list.push(obj._id.name);
          }
        }
        return list.sort();
    }
}

module.exports = PersonController;
