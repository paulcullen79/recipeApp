const mongoose = require('mongoose')
const validator = require('validator')

const recipeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    // cookingTimeMinutes: {
    //     type: Number,
    //     required: true
    // },
    // servings: {
    //     type: Number,
    //     required: true
    // },
    // diets: {
    //     vegetarian: {
    //         type: Boolean
    //     }
    // },
    // summary: {
    //     type: String,
    //     required: true
    // },
    // instructions: {
    //     type: String
    // },
    // ingredients: {
    //     type: Array,
    //     required: true
    // },
    image: {
        type: String
    }
}, {
    timestamps: true
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe