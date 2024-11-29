require('dotenv').config();

// Підключаємо роутер до бек-енду
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../class/user');
const TokenStore = require('../class/token-store'); // шлях до файлу зберігання токенів
const balanceStore = require('../class/balance-store'); // шлях до файлу зберігання балансу
const router = express.Router();
const notificationStore = require('../class/notification-store');

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

      // Отримуємо вже існуючий токен
      const token = TokenStore.getToken(user.email);
      console.log("Token:", token);
//       
      return res.status(200).json({
        message: 'Електронну пошту успішно верифіковано',
        token: token,
        id: user.id,
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



//--------------------------------------------

// const nodemailer = require('nodemailer'); // For sending emails

// Your user model and other necessary imports

router.post('/recovery', async (req, res) => {
  const { email } = req.body;  

  try {   
    const user = User.getByEmail(email);

    if (!user) {     
      return res.status(404).json({ message: 'Email not found' });
    }

    const newResetCode = Math.floor(100000 + Math.random() * 900000); // Example code

    // Save the verification code in the user's record in the database
    user.passwordResetCode = newResetCode;
    // await user.save();

     // Виведення коду в консоль замість відправки на email
     console.log(`Verification code for ${email}: ${newResetCode}`);

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
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//------------------------------------------------

router.post('/recovery-confirm', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
 
  try {
    const user = User.getByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordResetCode !== parseInt(verificationCode, 10)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword; 
    user.passwordResetCode = null; 

    // Генерація JWT токена для авторизації
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: 86400 });
    TokenStore.saveToken(email, token);
    res.json({ message: 'Пароль успішно відновлено', token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------------------------------

router.put('/settings-email', async (req, res) => {
  const { currentEmail, newEmail, password } = req.body;
  const token = req.headers['authorization'];

  if (!newEmail || !password) {
    return res.status(400).json({ error: 'Заповніть поля Email та Password' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  try {
    const tokenValue = token.split(' ')[1]; 
    const decoded = jwt.verify(tokenValue, SECRET_KEY);

    // Перевірка дійсності токена
    if (!TokenStore.isValidToken(currentEmail, tokenValue)) {
      return res.status(401).json({ error: 'Недійсний токен для цього email' });
    }
    if (decoded.id !== user.id) {
      return res.status(401).json({ error: 'Недійсний токен для цього користувача' });
    }

    // Шукаємо користувача по email
    const user = User.getByEmail(currentEmail); 
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (!user.verifyPassword(password)) {
      return res.status(400).json({ error: 'Неправильний пароль' });
    }

    // Оновлюємо email користувача
    user.email = newEmail; // оновлення email
    console.log(`Email updated for user ID: ${user.id}`);

    // Створюємо новий токен після зміни email
    const newToken = jwt.sign({ id: user.id, email: newEmail }, SECRET_KEY, { expiresIn: 86400 });

    // Оновлюємо токен у сховищі
    TokenStore.deleteToken(currentEmail); // видаляємо старий токен
    TokenStore.saveToken(newEmail, newToken); // зберігаємо новий токен

    // Відправляємо новий токен на клієнт
    res.status(200).json({
      message: 'Email успішно змінено',
      token: newToken, // Новий токен
      user: { id: user.id, email: newEmail }, // Відправляємо оновленого користувача
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'На жаль, щось пішло не так' });
  }
});

//-------------------------------------------------

router.put('/settings-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body; 
  const token = req.headers['authorization'];

  if (!oldPassword || !newPassword) { 
    return res.status(400).json({ error: "Всі поля є обов'язковими" });
  }

  if (!token) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  try {
    const tokenValue = token.split(' ')[1];
    console.log("Token Value:", tokenValue);
    
    const decoded = jwt.verify(tokenValue, SECRET_KEY);
    console.log("Decoded:", decoded);

    const user = User.getById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    console.log("Found user:", user);

    if (!user.verifyPassword(oldPassword)) {
      return res.status(400).json({ error: 'Неправильний старий пароль' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword
    // User.update(user, { password: hashedPassword });

    const newToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: 86400 });
    TokenStore.deleteToken(user.email);
    TokenStore.saveToken(user.email, newToken);

    res.status(200).json({
      message: 'Пароль успішно змінено',
      token: newToken,
      user: { ...user, password: undefined } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ой, щось пішло не так' });
  }
});

   //------------------------------------------------------------------
router.get('/balance/:id', (req, res) => {
  const { id } = req.params; // Отримуємо id користувача з параметрів URL
  console.log('User ID:', id); // Логуємо отриманий userId

  try {
    const user = User.getById(id); // Отримуємо користувача (цей метод має повертати користувача за id)
    console.log('Found user:', user); 
    if (!user || !user.balanceStore) {
      throw new Error('User or balanceStore not found');
    }

    const balance = user.balanceStore.getBalance(id); // Викликаємо getBalance через balanceStore
    const transactions = user.balanceStore.getTransactions(id);

    res.json({
      balance: balance,
      transactions: transactions,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: error.message });
  }
});
//-------------------------------------------------------------------------
// Додавання нової транзакції для конкретного користувача
router.post('/balance-transaction', (req, res) => {
  const { userId, amount, type, address, system } = req.body;

  console.log("Отримано запит:", req.body);

  // Перевірка на наявність обов'язкових полів
  if (!userId || !amount || amount <= 0 || !type) {
    return res.status(400).json({ success: false, error: 'Відсутні обов\'язкові параметри або некоректні значення' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!TokenStore.isValidToken(userId, token)) {
    return res.status(401).json({ success: false, error: 'Невалідний токен' });
  }

  try {
    // Додаємо транзакцію з userId
    const newTransaction = balanceStore.addTransaction(userId, amount, type, address, system);

    // Повертаємо успішний результат
    return res.status(201).json({ success: true, transaction: newTransaction });
  } catch (error) {
    console.error("Помилка транзакції:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
//------------------------------------------------------------
// Отримання транзакції за ID для конкретного користувача
router.get('/transaction/:transactionId', (req, res) => {
  const { userId } = req.query;
  const { transactionId } = req.params;
  const transaction = balanceStore.getTransactionById(userId, transactionId);
  if (transaction) {
    return res.status(200).json(transaction);
  } else {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});
//-----------------------------------------------------------------
// Отримання всіх транзакцій для конкретного користувача
router.get('/transactions', (req, res) => {
  const { userId } = req.query;
  const transactions = balanceStore.getTransactions(userId);
  res.status(200).json({ success: true, transactions });
});

//------------------- Ендпоїнти сповіщень ---------------------

// Отримання всіх сповіщень для конкретного користувача
router.get('/notifications', (req, res) => {
  const { token } = req.headers; // Токен отримується з заголовків
  if (!token) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY); // Розшифрування токена
  } catch (error) {
    return res.status(401).json({ error: 'Недійсний токен' });
  }

  const { userId } = req.query;
  if (!userId || decoded.id !== userId) {
    return res.status(401).json({ error: 'Недійсний токен для цього користувача' });
  }

  const userNotifications = notificationStore.getNotifications(userId);
  res.json({ notifications: userNotifications });
});

// Додавання сповіщення для конкретного користувача
router.post('/notifications', (req, res) => {
  const { userId, type, time, details } = req.body;
  const notification = notificationStore.addNotification(userId, type, { time, ...details });
  res.status(201).json({ notification });
});


// Експортуємо глобальний роутер
module.exports = router
