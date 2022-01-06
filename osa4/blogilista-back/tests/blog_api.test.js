const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

jest.setTimeout(30000)
beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({username: 'usrname', passwordHash})

    await user.save()

    const loginCreditentials = {
        username: 'usrname',
        password: 'salasana'
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginCreditentials)

    token = loginResponse.body.token

    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${token}`)
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs have id', async () => {
    const blogs = await helper.blogsInDb()
    
    expect(blogs[0].id).toBeDefined()
})

test('valid blogs can be added', async () => {
    const initialBlogs = await helper.blogsInDb()
    const newBlog = {
        title: 'new blog',
        author: 'me',
        url: 'wwww.fso.fi',
        votes: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    const newBlogList = await helper.blogsInDb()

    expect(newBlogList.length).toBe(initialBlogs.length + 1)
})

test('when adding new blog, default votes is 0', async () => {
    const newBlog = {
        title: 'new blog',
        author: 'me',
        url: 'wwww.fso.fi',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    const newBlogList = await helper.blogsInDb()
    const addedBlog = newBlogList[newBlogList.length - 1]

    expect(addedBlog.title).toBe('new blog')
    expect(addedBlog.votes).toBe(0)
})
describe('blog cannot be added without', () => {
    test('title', async () => {
        const newBlog = {
            author: 'me',
            url: 'wwww.fso.fi',
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })

    test('author', async () => {
        const newBlog = {
            title: 'new blog',
            url: 'wwww.fso.fi',
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })

    test('url', async () => {
        const newBlog = {
            title: 'new blog',
            author: 'me',
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })
})

describe('removing blog', () => {
    test('succeeds with correct id', async () => {
        const initialBlogs = await helper.blogsInDb()
        const firstBlog = initialBlogs[0]
        
        await api
            .delete(`/api/blogs/${firstBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    
        const newBlogList = await helper.blogsInDb()
    
        expect(newBlogList.length).toBe(initialBlogs.length - 1)
    })

    test('returns 400 with invalid id', async () => {
        const initialBlogs = await helper.blogsInDb()
        const firstBlog = initialBlogs[0]
    
        await api
            .delete(`/api/blogs/${firstBlog.id}dgsn`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    
        const newBlogList = await helper.blogsInDb()
    
        expect(newBlogList.length).toBe(initialBlogs.length)
    })
})

describe('updating votes', () => {
    test('succeeds with correct id', async () => {
        const initialBlogs = await helper.blogsInDb()
        const firstBlog = initialBlogs[0]
        
        const updatedBlog = {
            title: firstBlog.title,
            author: firstBlog.author,
            url: firstBlog.url,
            votes: firstBlog.votes + 1,
        }
        await api
            .put(`/api/blogs/${firstBlog.id}`)
            .send(updatedBlog)
            .set('Authorization', `Bearer ${token}`)

        const updatedBlogs = await helper.blogsInDb()
        const updatedFirstBlog = updatedBlogs[0]

        expect(updatedFirstBlog.votes).toBe(firstBlog.votes + 1)
    })

    test('returns 400 with incorrect id', async () => {
        const initialBlogs = await helper.blogsInDb()
        const firstBlog = initialBlogs[0]
        
        const updatedBlog = {
            title: firstBlog.title,
            author: firstBlog.author,
            url: firstBlog.url,
            votes: firstBlog.votes + 1,
        }
        await api
            .put(`/api/blogs/${firstBlog.id}sfgv`)
            .send(updatedBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        const updatedBlogs = await helper.blogsInDb()
        const updatedFirstBlog = updatedBlogs[0]

        expect(updatedFirstBlog.votes).toBe(firstBlog.votes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})