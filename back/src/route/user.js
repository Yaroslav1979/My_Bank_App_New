// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')

router.post('/user-create', function (req, res) {
  try {
    const {email, password} = req.body

    if (!email || !password) {
      return res.status(400).json({
        message:
        'Потрібно ввести email та пароль для створення аккаунту користувача'
      })
    }
    let user = null

    console.log ()
  }
  catch (e) {
    return res.status(400).json({
      message:
      'Не вдалося створити аккаунту користувача'
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
