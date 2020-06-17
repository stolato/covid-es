'use strict'

const People = use('App/Models/People');
const Graphic = use('App/Models/Graphic');
const Database = use('Database');

class PersonController {
    async index(){
        const obito = await People.where('municipio','GUACUI').where('evolucao','Óbito pelo COVID-19').count();
        const cura = await People.where('municipio','GUACUI').where('evolucao','Cura').count();
        const all = await People.where('municipio','GUACUI').count();
        const ativo = await People.where('municipio','GUACUI').where('evolucao','-').count();
        const graphic = await Graphic.query().orderBy('date','desc').fetch();
        return  { morte: obito, recuperado: cura, ativos: ativo, total: all, graphics: graphic }
    }
}

module.exports = PersonController
