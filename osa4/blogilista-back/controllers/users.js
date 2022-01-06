const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.username === null || body.username.length < 3) {
        return response.status(401).json({
            error: 'Username has to be at least three characters long'
        })
    }

    if (body.password === null || body.password.length < 3) {
        return response.status(401).json({
            error: 'Password has to be at least three characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

usersRouter.get('/', async (require, response) => {
    const users = await User
        .find({}).populate('blogs', {url: 1, title: 1, author: 1})
    
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter