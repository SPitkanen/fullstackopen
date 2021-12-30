import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'

const AddBlog = (props) => {
  return (
    <div>
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
      {blogs.map(blog => <Blog key={blog.id} blog={blog} vote={vote} remove={remove}/>)}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService
      .getAll()
        .then(initialBlogs => {
          setBlogs(initialBlogs)
        })
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
      })
      .catch(error => {
        console.log(error.response.data)
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

  return (
    <div>
      <h1>Blog List</h1>
      <h2>Add new blog</h2>
      <AddBlog 
        addBlog={addBlog} 
        title={newTitle}
        author={newAuthor}
        url={newUrl}
        handleTitleChange={handleTitleChange} 
        handleAuthorChange={handleAuthorChange} 
        handleUrlChange={handleUrlChange}
      />
      <h2>Blogs</h2>
      <ShowBlogs blogs={blogs} vote={handleVoteChange} remove={removeBlog}/>
    </div>
  )
}

export default App