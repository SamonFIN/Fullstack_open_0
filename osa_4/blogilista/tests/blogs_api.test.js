const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')

const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are initial users in db', () => {
  beforeEach(async () => {
    await helper.setupInitialUsersAndTokens()
  })

  test('getting users succeeds', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('getting a user by ID succeeds', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToView = usersAtStart[0]

    const response = await api
      .get(`/api/users/${userToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, userToView.username)
    assert.strictEqual(response.body.id, userToView.id)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Hhopo',
      name: 'Hesssu Hopo',
      password: 'Valid123!',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: helper.initialUsers[0].username,
      name: 'rytky',
      password: 'Salainen123!',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Shorty',
      password: 'Valid123!'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if name is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Al',
      password: 'Valid123!'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is weak or missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWeak = {
      username: 'newuser',
      name: 'Weakpass',
      password: 'weak'
    }

    const resultWeak = await api
      .post('/api/users')
      .send(newUserWeak)
      .expect(400)

    assert(resultWeak.body.error.includes('Password must be'))

    const newUserNone = {
      username: 'newuser',
      name: 'Weakpass'
    }

    const resultNone = await api
      .post('/api/users')
      .send(newUserNone)
      .expect(400)

    assert(resultNone.body.error.includes('Password must be'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe('Login to user', () => {
    test('succeeds with valid credentials', async () => {
      const loginData = {
        username: helper.initialUsers[0].username,
        password: helper.initialUsers[0].password
      }

      const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.ok(response.body.token)
      assert.strictEqual(response.body.username, loginData.username)
      assert.strictEqual(response.body.name, 'admin')
    })

    test('fails with invalid username', async () => {
      const loginData = {
        username: 'wronguser',
        password: helper.initialUsers[0].password
      }

      const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(response.body.error.includes('invalid username or password'))
    })

    test('fails with invalid password', async () => {
      const loginData = {
        username: helper.initialUsers[0].username,
        password: 'wrongpassword'
      }

      const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(response.body.error.includes('invalid username or password'))
    })

    test('fails with missing username or password', async () => {
      await api.post('/api/login').send({ password: helper.initialUsers[0].password }).expect(401)
      await api.post('/api/login').send({ username: helper.initialUsers[0].username }).expect(401)
      await api.post('/api/login').send({}).expect(401)
    })

  })
})


describe('When there are some inital blogs and users', () => {
  let token
  beforeEach(async () => {
    const { savedUsers, tokens } = await helper.setupInitialUsersAndTokens()
    token = tokens[0]

    await helper.setupInitialBlogs(savedUsers)
  })

  describe('with valid token', () => {

    test('blogs are returned as JSON', async () => {
      await api
        .get('/api/blogs')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api
        .get('/api/blogs')
        .auth(token, { type: 'bearer' })
        .expect(200)
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog posts have an id field (not an _id)', async () => {
      const response = await api
        .get('/api/blogs')
        .auth(token, { type: 'bearer' })
      response.body.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
      })
    })

    test('getting a blog by ID succeeds', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, blogToView.title)
      assert.strictEqual(response.body.id, blogToView.id)
    })

    describe('adding a new blog', () => {
      test('succeeds with valid info', async () => {
        await api
          .post('/api/blogs')
          .auth(token, { type: 'bearer' })
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
          .auth(token, { type: 'bearer' })
          .send(helper.invalidBlogNoTitle)
          .expect(400)

        await api
          .post('/api/blogs')
          .auth(token, { type: 'bearer' })
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
          .auth(token, { type: 'bearer' })
          .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      })

      test('fails with code 404 if blog with id is not found', async () => {
        const id = await helper.nonExistingId()

        await api
          .delete(`/api/blogs/${id}`)
          .auth(token, { type: 'bearer' })
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
          .auth(token, { type: 'bearer' })
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
          .auth(token, { type: 'bearer' })
          .send(updatedData)
          .expect(404)
      })
    })
  })

  describe('With invalid token', () => {
    const invalidToken = 'Bearer invalid.token.here'
    const newBlog = {
      title: 'Invalid Token Blog',
      author: 'Bad Auth',
      url: 'http://badtoken.com',
      likes: 2
    }

    test('blog operations fail if missing or invalid token', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToAlter = blogsAtStart[0]

      await api.get('/api/blogs').auth(invalidToken, { type: 'bearer' }).expect(401)
      await api.get(`/api/blogs/${blogToAlter.id}`).auth(invalidToken, { type: 'bearer' }).expect(401)

      await api.post('/api/blogs').send(newBlog).expect(401)
      await api.post('/api/blogs').auth(invalidToken, { type: 'bearer' }).send(newBlog).expect(401)

      await api.delete(`/api/blogs/${blogToAlter.id}`).set('Authorization', invalidToken).expect(401)

      const updatedData = {
        title: blogToAlter.title + ' (edited)',
        author: blogToAlter.author,
        url: blogToAlter.url,
        likes: blogToAlter.likes + 1
      }

      await api.put(`/api/blogs/${blogToAlter.id}`).set('Authorization', invalidToken).send(updatedData).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

  })

})


after(async () => {
  await mongoose.connection.close()
})