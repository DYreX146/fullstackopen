const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({}).populate('blogs', { url: 1, title: 1, author: 1 })

    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!password) {
      response.status(400).send({ error: 'password required' })
    } else if (password.length < 3) {
      response.status(400).send({ error: 'password must be at least 3 characters long' })
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
      blogs: []
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter