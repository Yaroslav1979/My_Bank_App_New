require('dotenv').config();

// Підключаємо роутер до бек-енду
const express = require('express');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../class/user');
const TokenStore = require('../class/token-store'); // шлях до файлу зберігання токенів

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

router.use(bodyParser.json());

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

    const existingUser = User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує'
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
          // user: newUser,
          // token: newUser.token,
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

      // Генерація токена після успішної верифікації
      const token = jwt.sign({ id: user.email }, SECRET_KEY, { expiresIn: '30d' });
     
      TokenStore.saveToken(user.email, token);

      return res.status(200).json({
        message: 'Електронну пошту успішно верифіковано',
        token: token  
      });
    } else {
      return res.status(400).json({
        message: 'Невірний код верифікації'
      });
    }
  } catch (e) {
    console.error('Помилка при верифікації електронної пошти:', e);
    return res.status(500).json({
      message: 'Не вдалося верифікувати електронну пошту'
    });
  }
});
// ---------------------------------------------

router.post('/user-enter', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Потрібно ввести email та пароль, щоб увійти в аккаунт'
      });
    }

    const user = await User.getByEmail(email); // Асинхронний виклик
    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не знайдено'
      });
    }

    if (!user.verifyPassword(password)) {
      return res.status(401).json({
        message: 'Невірний пароль'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: 'Користувач не верифікований'
      });
    }

    // Перевірка наявності токена користувача у сховищі
    const token = TokenStore.getToken(user.email);
    if (!token) {
      return res.status(500).json({
        message: 'Токен не знайдено',
      });
    }

    // Повертаємо токен, якщо користувач успішно увійшов
    return res.status(200).json({
      message: 'Ви успішно увійшли в аккаунт',
      token: token // Повертаємо вже наявний токен
    });

  } catch (e) {
    console.error('Помилка при вході в аккаунт:', e);
    return res.status(500).json({
      message: 'Не вдалося увійти в аккаунт'
    });
  }
});



// router.post('/user-enter', function (req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Потрібно ввести email та пароль щоб увійти в аккаунт'
//       });
//     }
     
//     const user = User.getByEmail(email);
//     if (!user) {
//       return res.status(400).json({
//         message: 'Користувача з таким email не знайдено'
//       });
//     }

//     if (!user.verifyPassword(password)) {
//       return res.status(401).json({
//         message: 'Невірний пароль'
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: 'Користувач не верифікований'
//       });
//     }   

//       // Створення токену на 30 днів
//     // const token = jwt.sign({ id: user.email }, SECRET_KEY, { expiresIn: '30d' });
//     // TokenStore.saveToken(user.email, token); // Зберігання токену у базі даних
    
//     console.log('Ви увійшли в аккаунт:', user);

//     // Відправка коду верифікації електронною поштою
//     // const mailOptions = {
//     //   from: 'your-email@gmail.com',
//     //   to: email,
//     //   subject: 'Verification Code',
//     //   text: `Your verification code is: ${verificationCode}`
//     // };

//     // transporter.sendMail(mailOptions, function (error, info) {
//     //   if (error) {
//     //     console.error('Помилка при відправці коду верифікації:', error);
//     //     return res.status(500).json({
//     //       message: 'Не вдалося відправити код верифікації'
//     //     });
//     //   } else {
//         // console.log('Код верифікації відправлено: ' + info.response);
//        return res.status(200).json({
//       message: 'Ви успішно увійшли в аккаунт',
//       token: token
//     });
        
//     //   }
//     // });
//   }  catch (e) {
//     console.error('Помилка при вході в аккаунт:', e);
//     return res.status(500).json({
//       message: 'Не вдалося увійти в аккаунт'
//     });
//   }
// });


// router.post('/user-enter', function (req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Потрібно ввести email та пароль, щоб увійти в аккаунт',
//       });
//     }

//     const user = User.getByEmail(email);
//     if (!user) {
//       return res.status(400).json({
//         message: 'Користувача з таким email не знайдено',
//       });
//     }

//     if (!user.verifyPassword(password)) {
//       return res.status(401).json({
//         message: 'Невірний пароль',
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: 'Користувач не верифікований',
//       });
//     }

    

//     return res.status(200).json({
//       message: 'Ви успішно увійшли в аккаунт',
//       token: user.token,
//     });
    
//   } catch (e) {
//     console.error('Помилка при вході в аккаунт:', e);
//     return res.status(500).json({
//       message: 'Не вдалося увійти в аккаунт',
//     });
//   }
// });
//--------------------------------------------

// const nodemailer = require('nodemailer'); // For sending emails

// Your user model and other necessary imports

router.post('/recovery', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a verification code or token
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Example code

    // Save the verification code in the user's record in the database
    user.resetPasswordCode = verificationCode;
    await user.save();

     // Виведення коду в консоль замість відправки на email
     console.log(`Verification code for ${email}: ${verificationCode}`);

    // Send the verification code to the user's email
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail', // or another email service
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USERNAME,
    //   to: email,
    //   subject: 'Password Reset Request',
    //   text: `Your verification code is: ${verificationCode}`,
    // };

    // await transporter.sendMail(mailOptions);

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//------------------------------------------------

router.post('/verify-code', async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
     const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetPasswordCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    res.json({ message: 'Verification code is correct' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//--------------------------------------------------

// const bcrypt = require('bcrypt'); // Для хешування паролів

// router.post('/recovery-confirm', async (req, res) => {
//   const { email, verificationCode, newPassword } = req.body;

//   try {
//     // Знаходимо користувача за електронною адресою
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Перевіряємо, чи код верифікації співпадає
//     if (user.resetPasswordCode !== verificationCode) {
//       return res.status(400).json({ message: 'Invalid verification code' });
//     }

//     // Хешуємо новий пароль
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Оновлюємо пароль користувача
//     user.password = hashedPassword;
//     user.resetPasswordCode = undefined; // Видаляємо код верифікації після успішної зміни пароля
//     await user.save();

//     res.json({ message: 'Password has been reset successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/recovery-confirm', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    // Знаходимо користувача за електронною адресою
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Перевіряємо, чи код верифікації співпадає
    if (user.resetPasswordCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Тимчасово зберігаємо пароль без хешування
    user.password = newPassword;
    user.resetPasswordCode = undefined; // Видаляємо код верифікації після успішної зміни пароля
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//-------------------------------------------------

// Експортуємо глобальний роутер
module.exports = router
