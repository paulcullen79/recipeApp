const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const recipeRouter = require('./routers/recipe')
let previousSearch = ''

const { getRandomRecipes, getRecipesList, getRecipeDetails } = require('./utils/spoonacular')

const app = express()
const port = process.env.PORT

// define paths for express config
const publicDirectoryPath = (path.join(__dirname, '../public'))

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(userRouter)
app.use(recipeRouter)

// root - GET random recipes
app.get('/randomRecipes', (req, res) => {
    getRandomRecipes()
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send({
                error: error
            })
        })
})

// GET recipe list based on search query
app.get('/recipesList', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Please provide a search word'
        })
    } 
    console.log(req.query.offset)
    getRecipesList(req.query.search, req.query.offset)
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.send({
                error: 'Something went wrong!'
            })
        })
})


// GET recipe details by id
app.get('/recipeDetails', (req, res) => {
    getRecipeDetails(req.query.id)
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.send({
                error: 'Sorry, something went wrong!'
            })
        })
})


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})