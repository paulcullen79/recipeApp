const express = require('express')
const Recipe = require('../models/recipe')
const router = new express.Router()
const auth = require('../../middleware/auth')

// CREATE recipe
router.post('/recipes', auth, async (req, res) => {
    const recipe = new Recipe({
        ...req.body,
        owner: req.user._id
    })
    try {
        await recipe.save()
        res.status(201).send(recipe)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

// GET user recipes
router.get('/recipes', auth, async (req, res) => {
    
    try {
        
        // const recipes = await Recipe.find({ owner: req.user._id })
        await req.user.populate('recipes').execPopulate()
        res.send(req.user.recipes)
    } catch(error) {
        res.status(500).send(error.message)
    }
})

// DELETE recipe by id
router.delete('/recipes/:id', auth, async (req, res) => { 
    try {
        const recipe = await Recipe.findOneAndDelete({ owner: req.user._id, _id: req.params.id })
        if (!recipe) {
            return res.status(404).send()
        }
        res.send(recipe)
    } catch(error) {
        res.status(500).send()
    }
})

module.exports = router