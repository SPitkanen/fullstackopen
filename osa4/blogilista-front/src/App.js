import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

const ShowBlogs = ({ blogs, vote, remove }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.sort((a, b) => b.votes - a.votes).map(blog => <Blog key={blog.id} blog={blog} vote={vote} remove={remove} />)}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  const [username, setNewUsername] = useState('')
  const [password, setNewPassword] = useState('')
  const [user, setNewUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setNewUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsernameChange = (event) => {
    console.log(event.target.value)
    setNewUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    console.log(event.target.value)
    setNewPassword(event.target.value)
  }

  const createMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleVoteChange = (blog) => {
    const votes = blog.votes + 1
    console.log(votes)
    const id = blog.id
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      votes: votes,
    }

    blogService
      .update(id, newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        createMessage(`New Blog ${returnedBlog.title} added!`)
      })
      .catch(error => {
        console.log(error.response.data)
        createMessage('Failed to add new blog')
      })
  }

  const removeBlog = (blog) => {
    const id = blog.id
    console.log(id)
    if (window.confirm(`Remove blog ${blog.title}`)) {
      blogService
        .remove(blog.id)
        .then(() => true)
        .catch(error => {
          console.log(error.response.data)
        })
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setNewUser(user)
      setNewUsername('')
      setNewPassword('')
      createMessage('Login succesfull!')
    } catch (exception) {
      console.log(exception)
      createMessage('Failed to login')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    blogService.setToken(null)
    window.localStorage.clear()
    setNewUser(null)
    createMessage('You have logged out')
  }

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      username={username}
      password={password}
      handleUsernameChange={handleUsernameChange}
      handlePasswordChange={handlePasswordChange}
    />
  )

  const showLoggenInPage = () => (
    <div>
      <p>{user.name} logged in</p><button onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <ShowBlogs blogs={blogs} vote={handleVoteChange} remove={removeBlog} />
    </div>
  )

  return (
    <div>
      <h1>Blog List</h1>

      <Notification message={message} />

      {user === null ?
        loginForm() :
        showLoggenInPage()
      }
    </div>
  )
}

export default App