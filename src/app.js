const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { getRecipesList, getRecipeDetails } = require('./utils/spoonacular')



const app = express()
const port = process.env.PORT || 3000

// define paths for express config
const publicDirectoryPath = (path.join(__dirname, '../public'))
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

// // root
// app.get('', (req, res) => {
//     res.render('index')
// })


// Get recipe list
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