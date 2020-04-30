const path = require('path')
const express = require('express')
const { getRandomRecipes, getRecipesList, getRecipeDetails } = require('./utils/spoonacular')



const app = express()
const port = process.env.PORT || 3000

// define paths for express config
const publicDirectoryPath = (path.join(__dirname, '../public'))

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

// root - get random recipes
app.get('/randomRecipes', (req, res) => {
    getRandomRecipes((error, data) => {
        if (error) {
            return res.send({
                error: error
            }) 
        } 
        res.send(data)
    })
})

// Get recipe list based on search query
app.get('/recipesList', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Please provide a search word'
        })
    }     
    getRecipesList(req.query.search, (error, data) => {
        if (error) {
            return res.send({
                error: error
            }) 
        } 
        res.send(data)
    })
})


// Get recipe details
app.get('/recipeDetails', (req, res) => { 
    getRecipeDetails(req.query.id, (error, data) => {
        if (error) {
            return res.send({
                error: error
            }) 
        } 
        res.send(data)
    })
})


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})