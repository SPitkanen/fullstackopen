import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const AddBlog = (props) => {
  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={props.addBlog}>
        <div>Title <input value={props.title} onChange={props.handleTitleChange}/></div>
        <div>Author <input value={props.author} onChange={props.handleAuthorChange}/></div>
        <div>Url <input value={props.url} onChange={props.handleUrlChange}/></div>
        <div>
          <button type="Submit">Add</button>
        </div>
      </form>
    </div>
  )
}

const Login = (props) => {
  return (
    <div>
      <form onSubmit={props.handleLogin}>
        <div>
          Username: 
            <input
            type="text"
            value={props.username}
            name="Username"
            onChange={props.handleUsernameChange}
            />
        </div>
        <div>
          Password: 
            <input
            type="password"
            value={props.password}
            name="Password"
            onChange={props.handlePasswordChange}
            />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

const Blog = ({blog, vote, remove}) => {
  return (
    <div>
      <h3>{blog.title}</h3>
      <ul>
        <li>Author: {blog.author}</li>
        <li>Link: {blog.url}</li>
        <li>Votes on this blog: {blog.votes}<button onClick={() => vote(blog)}>Vote</button></li>
      </ul>
      <button onClick={() => remove(blog)}>Remove</button>
    </div>
  )
}

const ShowBlogs = ({blogs, vote, remove}) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} vote={vote} remove={remove}/>)}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)

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

  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setNewUrl(event.target.value)
  }

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

  const addBlog = (event) => {
    event.preventDefault()
    const blog = {
      author: newAuthor,
      title: newTitle,
      url: newUrl,
      votes: 0,
    }

    blogService
      .create(blog)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        createMessage(`New Blog ${blog.title} added!`)
      })
      .catch(error => {
        console.log(error.response.data)
        createMessage(`Failed to add new blog`)
      })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const removeBlog = (blog) => {
    const id = blog.id
    console.log(id)
    blogService
      .remove(blog.id)
      .then(() => true)
      .catch(error => {
        console.log(error.response.data)
      })
    setBlogs(blogs.filter(blog => blog.id !== id))
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
    <Login 
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
      <AddBlog 
        addBlog={addBlog} 
        title={newTitle}
        author={newAuthor}
        url={newUrl}
        handleTitleChange={handleTitleChange} 
        handleAuthorChange={handleAuthorChange} 
        handleUrlChange={handleUrlChange}
      />
      <ShowBlogs blogs={blogs} vote={handleVoteChange} remove={removeBlog}/>
    </div>
  )

  return (
    <div>
      <h1>Blog List</h1>

      <Notification message={message} />

      {user ===  null ?
        loginForm() :
        showLoggenInPage()
      }
    </div>
  )
}

export default App