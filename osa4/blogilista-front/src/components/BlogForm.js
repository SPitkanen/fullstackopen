import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [author, setAuthor] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')

    const handleAuthorChange = (event) => {
        console.log(event.target.value)
        setAuthor(event.target.value)
    }

    const handleTitleChange = (event) => {
        console.log(event.target.value)
        setTitle(event.target.value)
    }

    const handleUrlChange = (event) => {
        console.log(event.target.value)
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
        })

        setAuthor('')
        setTitle('')
        setUrl('')
    }

    return (
        <div>
            <h2>Add new blog</h2>
            <form onSubmit={addBlog}>
                <div>Title <input id="title" className="title" value={title} onChange={handleTitleChange} /></div>
                <div>Author <input id="author" className="author" value={author} onChange={handleAuthorChange} /></div>
                <div>Url <input id="url" className="url" value={url} onChange={handleUrlChange} /></div>
                <div>
                    <button id="add" type="Submit">Add</button>
                </div>
            </form>
        </div>
    )
}

export default BlogForm