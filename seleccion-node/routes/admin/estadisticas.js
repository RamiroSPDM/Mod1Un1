var express = require('express');
var router = express.Router();
var estadisticasModel = require('../../models/estadisticasModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);



router.get('/', async function (req, res, next) {
  
  var estadisticas = await estadisticasModel.getEstadisticas();
  console.log(estadisticas);

  estadisticas = estadisticas.map(estadistica => {
    if (estadistica.img_id) {
      const imagen = cloudinary.image(estadistica.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...estadistica,
        imagen
      }
    } else {
      return {
        ...estadistica,
        imagen: ''
      };
    }
   });
  

  res.render('admin/estadisticas', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    estadisticas
  });
});

router.get('/eliminar/:id', async (req, res, next) => {
  const id = req.params.id;
  let estadistica = await estadisticasModel.getEstadisticaById(id);
  if (estadistica.img_id) {
    await destroy(estadistica.img_id);
  }
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
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }


    if (req.body.nombre != "" && req.body.partidos != "" && req.body.goles != "" && req.body.asistencias != "" && req.body.amarillas != "" && req.body.rojas != "") {
      // Insertar la estadística en la base de datos
      await estadisticasModel.insertEstadistica({
        ...req.body,
      img_id
    });

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
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }



     var obj = {
      id: req.body.id,
      nombre: req.body.nombre,
      partidos: req.body.partidos,
      goles: req.body.goles,
      asistencias: req.body.asistencias,
      amarillas: req.body.amarillas,
      rojas: req.body.rojas,
      img_id
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