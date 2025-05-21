const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const saveBlog = await blog.save()
  response.status(201).json(saveBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndDelete(id)
  if (result) {
    response.status(204).end()
  }
  else {
    response.status(404).json({ error: `Blog with id (${id}) not found` })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if(updatedBlog) {
    response.status(200).json(updatedBlog.toJSON())
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter