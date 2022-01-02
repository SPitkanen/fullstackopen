var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? null
        : blogs.map(blog => blog.likes).reduce((prev, next) => prev + next)
}

const favoriteBlog = (blogs) => {
    const mostVotedBlog = (blogs) => {
        return blogs.length === 0
        ? 0
        : blogs.reduce((mostVotedBlog, blog) => (mostVotedBlog.likes > blog.likes) ? mostVotedBlog : blog)
    }
    const blog = mostVotedBlog(blogs)
    return blog === 0
        ? null
        : (({title, author, likes}) => ({title, author, likes}))(blog)
    
}

const mostBlogs = (blogs) => {
    const author = (blogs) => {
        const authors = blogs.map(blog => blog.author)
        const authorTuple = _(authors)
            .countBy()
            .entries()
            .maxBy(_.last)

        return  { author: authorTuple[0], blogs: authorTuple[1] }
    }

    return blogs.length === 0
        ? null
        : author(blogs)

    
}

const mostLikes = (blogs) => {
    const author = (blogs) => {
        const authors = _(blogs)
            .groupBy('author')
            .map((obj, key) => ({
                'author': key,
                'likes': _.sumBy(obj, 'likes')
            }))
            .value()

        const authorTuple = _.maxBy(authors, 'likes')

        return { author: authorTuple.author, likes: authorTuple.likes }
    }

    return blogs.length === 0
        ? null
        : author(blogs)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}