// Підключаємо роутер до бек-енду
const express = require('express');
const router = express.Router();
const User = require('../class/user');
// const fetch = require('node-fetch');
// const nodemailer = require('nodemailer'); 

// Встановіть конфігурацію для nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-email-password'
//   }
// });

router.post('/user-create', function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Потрібно ввести email та пароль для створення аккаунту користувача'
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000); 
    const newUser = new User(email, password, verificationCode); 
    
    User.add(newUser);

    console.log('Новий користувач створений:', newUser, verificationCode);

    // Відправка коду верифікації електронною поштою
    // const mailOptions = {
    //   from: 'your-email@gmail.com',
    //   to: email,
    //   subject: 'Verification Code',
    //   text: `Your verification code is: ${verificationCode}`
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.error('Помилка при відправці коду верифікації:', error);
    //     return res.status(500).json({
    //       message: 'Не вдалося відправити код верифікації'
    //     });
    //   } else {
        // console.log('Код верифікації відправлено: ' + info.response);
        return res.status(201).json({
          message: 'На ваш email надісланий код верифікації аккаунту.',
          user: newUser
        });
    //   }
    // });
  }  catch (e) {
    console.error('Помилка при створенні аккаунту користувача:', e);
    return res.status(500).json({
      message: 'Не вдалося створити аккаунт користувача'
    });
  }
});


//--------------------------------------------------------
router.post('/verify-email', function (req, res) {
  try {
    const { email, verificationCode } = req.body;
    const user = User.getByEmail(email);

    if (user && user.verificationCode === parseInt(verificationCode)) {
      user.isVerified = true;
      return res.status(200).json({
        message: 'Електронну пошту успішно верифіковано'
      });
    } else {
      return res.status(400).json({
        message: 'Невірний код верифікації'
      });
    }
  } catch (e) {
    console.error('Помилка при верифікації коду:', e);
    return res.status(500).json({
      message: 'Не вдалося верифікувати код'
    });
  }
});

// Експортуємо глобальний роутер
module.exports = router
