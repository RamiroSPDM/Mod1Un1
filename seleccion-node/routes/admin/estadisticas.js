var express = require('express');
var router = express.Router();
var estadisticasModel = require('../../models/estadisticasModel');



router.get('/', async function (req, res, next) {
  var estadisticas = await estadisticasModel.getEstadisticas();
  console.log(estadisticas);

  res.render('admin/estadisticas', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    estadisticas
  });
});

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  console.log(id);
  await estadisticasModel.deleteEstadisticaById(id);
  res.redirect('/admin/estadisticas');
});


router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout',

  });
})

router.post('/agregar', async (req, res, next) => {
  try {
    if (req.body.nombre != "" && req.body.partidos != "" && req.body.goles != "" && req.body.asistencias != "" && req.body.amarillas != "" && req.body.rojas != "") {
      // Insertar la estadística en la base de datos
      await estadisticasModel.insertEstadistica(req.body);

      res.redirect('/admin/estadisticas');
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son obligatorios'
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo agregar la estadística'
    });
  }
});

router.get('/modificar/:id', async (req, res, next) => {
  let id = req.params.id;
  let estadistica = await estadisticasModel.getEstadisticaById(id);
  res.render('admin/modificar', {
    layout: 'admin/layout',
    estadistica
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
     let obj = {
      nombre: req.body.nombre,
      partidos: req.body.partidos,
      goles: req.body.goles,
      asistencias: req.body.asistencias,
      amarillas: req.body.amarillas,
      rojas: req.body.rojas
    }
     await estadisticasModel.modificarEstadisticaById(obj, req.body.id);
    res.redirect('/admin/estadisticas');
    console.log(obj);
  } catch (error) {
    console.log(error);
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo modificar la estadística'
    });
  }
});











module.exports = router;