import React, { useState } from 'react'

const Blog = ({
  blog,
  vote,
  remove,
}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible} className="defaultContent">
        <h2>{blog.title}</h2><button id="viewButton" onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <h2>{blog.title}</h2><button id="hideButton" onClick={toggleVisibility}>Hide</button>
        <p>Author: {blog.author}</p>
        <p>Link: {blog.url}</p>
        <p>Votes on this blog: {blog.votes.toString()}</p><button id="voteButton" onClick={() => vote(blog)}>Vote</button>
        <button id="removeButton" onClick={() => remove(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog