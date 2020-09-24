const mongoose = require('mongoose')
const validator = require('validator')

const recipeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    readyInMinutes: {
        type: Number
    },
    servings: {
        type: Number
    },
    summary: {
        type: String
    },
    analyzedInstructions: {
        type: Array
    },
    extendedIngredients: {
        type: Array
    },
    image: {
        type: String
    }
}, {
    timestamps: true
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe