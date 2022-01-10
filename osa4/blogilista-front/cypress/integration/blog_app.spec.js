describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'root',
            username: 'Superuser',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('login page is shown as default', function () {
        cy.contains('Blog List')
        cy.contains('Login')
    })

    describe('login', function () {
        it('succesfull with correct credentials', function () {
            cy.get('#username').type('Superuser')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()

            cy.contains('root logged in')
        })

        it('fails with incorrect password', function () {
            cy.get('#username').type('Superuser')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.error').should('contain', 'Failed to login')
        })
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'Superuser', password: 'salainen' })
            /*cy.get('#username').type('Superuser')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()*/
        })

        it('a blog can be created', function () {
            cy.contains('New Blog').click()
            cy.get('#title').type('This is a new blog')
            cy.get('#author').type('Some Author')
            cy.get('#url').type('www.url.com')
            cy.get('#add').click()
            cy.contains('This is a new blog')
        })

        describe('and blogs exist', function () {
            beforeEach(function () {
                cy.createBlog({ title: 'first blog', author: 'first author', url: 'www.first.com' })
                cy.createBlog({ title: 'second blog', author: 'second author', url: 'www.second.com' })
                cy.createBlog({ title: 'last blog', author: 'last author', url: 'www.last.com' })

                cy.contains('second blog').parent().find('#viewButton').as('viewButton')
                cy.get('@viewButton').click()
            })

            it('a blog can be voted', function () {
                cy.contains('Author: second author').parent().find('#voteButton').as('voteButton')
                cy.get('@voteButton').click()
                cy.contains('Votes on this blog: 1')
            })

            it('a blog can be removed', function() {
                cy.contains('Author: second author').parent().find('#removeButton').as('removeButton')
                cy.get('@removeButton').click()
                cy.on('window:confirm', () => true)
                cy.contains('second blog').should('not.exist')
            })

            it.only('blogs are ordered by likes', function() {
                cy.contains('Author: second author').parent().find('#voteButton').as('voteButton')
                cy.get('@voteButton').click()
                cy.contains('Author: second author').parent().find('#hideButton').as('hideButton')
                cy.get('@hideButton').click()
                cy.contains('second blog')
            })
        })
    })
})