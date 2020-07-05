const request = require('request')
var rp = require('request-promise');

const apiKey = 'apiKey=b30065a06ee34a48a22161c14d14e376'

const getRandomRecipes = () => {
    const url = `https://api.spoonacular.com/recipes/random?number=12&${apiKey}`
     return rp({ url, json: true })
}

const getRecipesList = (search, offset) => {
    const url = `https://api.spoonacular.com/recipes/search?query=${search}&offset=${offset}&number=12&${apiKey}`
    return rp({ url, json: true })
}

const getRecipeDetails = (id, callback) => {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&${apiKey}`
     return rp({ url, json: true })
}

module.exports = { getRandomRecipes, getRecipesList, getRecipeDetails }

