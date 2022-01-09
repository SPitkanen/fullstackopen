import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    let component
    let mockVote
    let mockRemove

    beforeEach(() => {
        const blog = {
            title: "Fine Title",
            author: "Good Author",
            url: "www.simpleurl.com",
            votes: 5
        }
        mockVote = jest.fn()
        mockRemove = jest.fn()

        component = render(
            <Blog blog={blog} vote={mockVote} remove={mockRemove} />
        )
    })

    test('renders title as default before clicking view', () => {
        const divToShow = component.container.querySelector('.defaultContent')

        expect(divToShow).not.toHaveStyle('display: none')
        expect(divToShow).toHaveTextContent('Fine Title')
        expect(divToShow).not.toHaveTextContent('Good Author')
    })

    test('after clicking view shows rest', () => {
        const button = component.getByText('View')
        fireEvent.click(button)

        const divToShow = component.container.querySelector('.togglableContent')
        expect(divToShow).not.toHaveStyle('display: none')
        expect(divToShow).toHaveTextContent('www.simpleurl.com')
    })

    test('clicking vote twice calls handler twice', () => {
        const viewButton = component.getByText('View')
        fireEvent.click(viewButton)

        const voteButton = component.getByText('Vote')
        fireEvent.click(voteButton)
        fireEvent.click(voteButton)

        expect(mockVote.mock.calls).toHaveLength(2)
    })
})