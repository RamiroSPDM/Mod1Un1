var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var estadisticasModel = require('../models/estadisticasModel');
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function(req, res, next) {

  var estadisticas = await estadisticasModel.getEstadisticas();
  estadisticas = estadisticas.splice(0, 7); // Limitar a las primeras 6 estadísticas
  estadisticas = estadisticas.map(estadistica => {
    if (estadistica.img_id) {
      const imagen = cloudinary.url(estadistica.img_id, );
      return {
        ...estadistica,
        imagen
      }
    } else {
      return {
        ...estadistica,
        imagen: '/images/no-image.png' // Imagen por defecto si no hay img_id
      }
    }
  });

  res.render('index', {
    estadisticas
  });
});
      
  
  


router.post('/', async (req, res, next) => {
  
var nombre = req.body.nombre;
var apellido = req.body.apellido;
var email = req.body.email;
var telefono = req.body.tel;
var mensaje = req.body.mensaje;

console.log(req.body)
if (!nombre || !apellido || !email || !telefono || !mensaje) {
  return res.render('index', { 
    message: 'Por favor, complete todos los campos.' });
}
 


var obj = {
  to: 'ramirocarrizo@gmail.com',
  subject: 'Contacto desde la web',
  html: nombre + ' ' + apellido + ' se ha registrado correctamente con el email: ' + email + '<br> y el telefono: ' + telefono + '. <br> y dejo el siguiente mensaje: ' + mensaje
};

  var transporter = nodemailer.createTransport({
    host: process.env.STMP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });




  var info = await transporter.sendMail(obj);

  res.render('index', { 
    message: 'El mensaje fue enviado correctamente, Gracias!' });
  console.log(info);

});



module.exports = router ;
