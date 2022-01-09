import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm />', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const titleInput = component.container.querySelector('.title')
    const authorInput = component.container.querySelector('.author')
    const urlInput = component.container.querySelector('.url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
        target: { value: 'New Title' }
    })
    fireEvent.change(authorInput, {
        target: { value: 'New Author' }
    })
    fireEvent.change(urlInput, {
        target: { value: 'New Url' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls[0][0].title).toBe('New Title')
})