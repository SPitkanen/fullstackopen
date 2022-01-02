const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list is empty is null', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(null)
    })

    test('when list has one blog equals that amount of likes', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('bigger list counts likes correctly', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })
})

describe('most likes when', () => {
    const blog1 = 
        {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            likes: 5
        }

    const blog2 = 
        {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }

    test('list is empty, null', () => {
        expect(listHelper.favoriteBlog(emptyList)).toEqual(null)
    })

    test('one blog on list is same as blogs likes', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(blog1)
    })

    test('multiple blogs find correct', () => {
        expect(listHelper.favoriteBlog(blogs)).toEqual(blog2)
    })
})

describe('writer with most blogs when', () => {
    const dijkstra = 
        { 
            author: 'Edsger W. Dijkstra', 
            blogs: 1
        }

    const martin = 
        { 
            author: 'Robert C. Martin', 
            blogs: 3
        }
    
    test('list is empty is null', () => {
        expect(listHelper.mostBlogs(emptyList)).toBe(null)
    })

    test('list contains one blog is Dijkstra', () => {
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(dijkstra)
    })

    test('list contains multiple blogs', () => {
        expect(listHelper.mostBlogs(blogs)).toEqual(martin)
    })
})

describe('writer with most combined likes when', () => {
    const dijkstra1 = 
        {
            author: "Edsger W. Dijkstra",
            likes: 5
        } 

    const dijkstra2 = 
        { 
            author: 'Edsger W. Dijkstra', 
            likes: 17
        }

    test('list is empty is null', () => {
        expect(listHelper.mostLikes(emptyList)).toBe(null)
    })

    test('list contains one blog is Dijksra', () => {
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual(dijkstra1)
    })

    test('list containing multiple blogs is Dijksra', () => {
        expect(listHelper.mostLikes(blogs)).toEqual(dijkstra2)
    })
})