'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.group(() => {
    Route.get('people/:id', 'PersonController.index');
    Route.get('citys', 'PersonController.getCitys');
}).prefix('/api/v1');

//Route.get('/teste', 'SyncController.read');
//Route.get('/download', 'SyncController.dowload');
