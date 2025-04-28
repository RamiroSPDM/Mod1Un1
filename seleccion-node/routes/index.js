var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', async (req, res, next) => {
  
var email = req.body.email;
var password = req.body.password;
var nombre = req.body.nombre;
var apellido = req.body.apellido;

console.log(req.body)

if (!email || !password || !nombre || !apellido) {
  return res.status(400).send('Faltan datos');
}

var obj = {
  to: 'ramirocarrizo@gmail.com',
  subject: 'Nuevo registro',
  html: nombre + ' ' + apellido + ' se ha registrado correctamente con el email: ' + email + ' y la contraseña del usuario es: ' + password
}

  var transport= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  var info = await transport.sendMail(obj);

  res.render('index', { message: 'se ha registrado de forma correcta' });

});



module.exports = router;
