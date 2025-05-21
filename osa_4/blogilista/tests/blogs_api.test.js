const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')


const api = supertest(app)

describe('When there are some inital blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog posts have an id field (not an _id)', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('adding a new blog', () => {
    test('succeeds with valid info', async () => {
      await api
        .post('/api/blogs')
        .send(helper.validBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes(helper.validBlog.title))
    })

    test('fails with code 400 if no title or URL', async () => {
      await api
        .post('/api/blogs')
        .send(helper.invalidBlogNoTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(helper.invalidBlogNoUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with code 204 if blog with id is found', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

    test('fails with code 404 if blog with id is not found', async () => {
      const id = await helper.nonExistingId

      await api
        .delete(`/api/blogs/${id}`)
        .expect(404)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if blog exists', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        title: 'Updated Title',
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, updatedData.title)
      assert.strictEqual(response.body.likes, updatedData.likes)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.title, updatedData.title)
      assert.strictEqual(updatedBlog.likes, updatedData.likes)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()

      const updatedData = {
        title: 'Hessuilu',
        author: 'Hessu Hopo',
        url: 'http://blog.hopo.com/hiiri/2000/01/01/mikki.html',
        likes: 77,
      }

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(updatedData)
        .expect(404)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})