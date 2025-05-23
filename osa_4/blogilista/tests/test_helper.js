const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'admin',
    password: 'Sekret123!'
  },
  {
    username: 'testuser1',
    name: 'Test User 1',
    password: '!Password1',
  },
  {
    username: 'testuser2',
    name: 'Test User 2',
    password: '!Password2',
  }
]

const validBlog = {
  _id: '5a422ba71b54a676234d17fc',
  title: 'Hessuilu',
  author: 'Hessu Hopo',
  url: 'http://blog.hopo.com/hiiri/2000/01/01/mikki.html',
  likes: 77,
  __v: 0
}

const invalidBlogNoTitle = {
  author: 'Hessu Hopo',
  url: 'http://blog.hopo.com/hiiri/2000/01/01/mikki.html',
  likes: 77,
}

const invalidBlogNoUrl = {
  title: 'No URL',
  author: 'Hessu Hopo',
  likes: 77,
}

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 5
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 3,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 7
  }
]

const setupInitialUsersAndTokens = async () => {
  await User.deleteMany({})

  let users = []

  for (let user of initialUsers) {
    let passwordHash = await bcrypt.hash(user.password, 10)
    let newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash
    })
    users.push(newUser)
  }
  const savedUsers = await User.insertMany(users)

  const tokens = savedUsers.map(user => {
    const userForToken = { username: user.username, id: user._id }
    return jwt.sign(userForToken, process.env.SECRET)
  })

  return { savedUsers, tokens }
}

const setupInitialBlogs = async (users) => {
  await Blog.deleteMany({})

  const user = users[0] // Assign all initial blogs to the first user

  const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: user._id }))

  const savedBlogs = await Blog.insertMany(blogsWithUser)

  user.blogs = savedBlogs.map(b => b._id)
  await user.save()
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'to be removed',
    author: 'test',
    url: 'http://blog.test.com/test/2000/01/01/test.html',
    likes: 7
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  validBlog,
  invalidBlogNoTitle,
  invalidBlogNoUrl,
  initialBlogs,
  setupInitialUsersAndTokens,
  setupInitialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}