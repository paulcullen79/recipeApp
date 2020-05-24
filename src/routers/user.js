
const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../../middleware/auth')

// CREATE user
router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// LOGIN user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// LOGOUT user session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// LOGOUT all user sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// GET user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// GET user by id
router.get('/users/:id', auth, (req, res) => {
    User.findById(req.params.id).then((user) => {
        res.send(user)
    }).catch((error) => {
        res.status(404).send(error.message)
    })
})

// UPDATE profile
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        console.log(isValidUpdate)
        return res.status(400).send('Error: Invalid updates')
    }
    
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send('Error: Update failed')
    }
})

// DELETE profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error.message)
    }   
})


module.exports = router