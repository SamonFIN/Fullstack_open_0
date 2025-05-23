const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// 8-16 chars, at least one each: lowercase, uppercase, number and special.
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  response.status(200).json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || !passwordPattern.test(password)) {
    return response.status(400).json({
      error: 'Password must be 8-16 characters long and include at least one uppercase and lowercase letter, one number and one special character.'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
