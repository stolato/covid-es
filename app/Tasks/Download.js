'use strict'

const Task = use('Task')
const api = use('axios');
const fs = use('fs');

class Download extends Task {
  static get schedule () {
    return '0 3 * * *'
  }

  async handle () {
    const link = 'https://bi.static.es.gov.br/covid19/MICRODADOS.csv';
    await fs.unlink('./files/file.csv');
    await api({
        method: "get",
        url: link,
        responseType: "stream"
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream("./files/file.csv"));
    });

    this.info('Task Download handle')
  }
}

module.exports = Download
