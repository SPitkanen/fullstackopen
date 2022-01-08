const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})

  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.get('/:id', async (request, response) => {
  const Blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      votes: 0,
      user: user._id,
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
})
  
  blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const userid = request.user.id

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === userid.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({error: 'Invalid user'})
    }
  })
  
  blogRouter.put('/:id', userExtractor, async (request, response) => {
    const body = request.body
  
    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      votes: body.votes,
    }
    
    responseBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(responseBlog.toJSON())
  })
  
  module.exports = blogRouter