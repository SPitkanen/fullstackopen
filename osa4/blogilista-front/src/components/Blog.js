import React, {useState} from 'react'

const Blog = ({
    blog, 
    vote, 
    remove,
}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {display: visible ? 'none' : ''}
  const showWhenVisible = {display: visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <h2>{blog.title}</h2><button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible}>
        <h2>{blog.title}</h2><button onClick={toggleVisibility}>Hide</button>
        <ul>
          <li>Author: {blog.author}</li>
          <li>Link: {blog.url}</li>
          <li>Votes on this blog: {blog.votes}<button onClick={() => vote(blog)}>Vote</button></li>
        </ul>
        <button onClick={() => remove(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog