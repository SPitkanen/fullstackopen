const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

describe('when there is initially user in db', () => {
    jest.setTimeout(30000)
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('salasana', 10)
        const user = new User({username: 'usrname', passwordHash})

        await user.save()
    })

    test('creating user succeeds with new username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'newuser',
            name: 'Some Name',
            password: 'strong'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('user cannot be created with existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'usrname',
            name: 'Some Name',
            password: 'strong'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('creating user is not possible if', () => {
    test('username does not exist', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: '',
            name: 'Some Name',
            password: 'strong'
        }

        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)

        expect(response.body.error).toEqual('Username has to be at least three characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'a',
            name: 'Some Name',
            password: 'strong'
        }

        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)

        expect(response.body.error).toEqual('Username has to be at least three characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password does not exist', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'asodvgh',
            name: 'lohfveflv',
            password: ''
        }

        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)

        expect(response.body.error).toEqual('Password has to be at least three characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'aihv',
            name: 'Some Name',
            password: 'a'
        }

        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)

        expect(response.body.error).toEqual('Password has to be at least three characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})