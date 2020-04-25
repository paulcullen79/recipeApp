const request = require('request')

const apiKey = 'apiKey=b30065a06ee34a48a22161c14d14e376'

const getRecipesList = (search, callback) => {
    const url = `https://api.spoonacular.com/recipes/search?query=${search}&number=12&${apiKey}`

    request({ url, json: true }, (error, res, body) => {  
        if (error) {
            callback('Something went wrong!', undefined)
        } else if (body.results.length === 0) {
            callback('Invalid search term. Try another search', undefined)
        } else {
            callback(undefined, body)
        }
    })
}



const getRecipeDetails = (id, callback) => {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&${apiKey}`
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('error', undefined)
        } else {
            callback(undefined, body)
        }
    })
}

module.exports = { getRecipesList, getRecipeDetails }

