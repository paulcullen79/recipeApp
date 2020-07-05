// const recipeRouter = require('../../src/routers/recipe')
// const userRouter = require('../../src/routers/user')
// const express = require('express')
// require('../../src/db/mongoose')

// app.use(express.json())
// app.use(userRouter)
// app.use(recipeRouter)

const imageEl = document.querySelector('.image')
const titleEl = document.querySelector('.header h1')
const summaryHeadEl = document.querySelector('.summary h3')
const summaryEl = document.querySelector('.summary p')
const instructHeadEl = document.querySelector('.instructions h3')
const instructionsListEl = document.querySelector('.instructions ol')
const ingredientsHeadEl = document.querySelector('.ingredients h3')
const ingredientsListEl = document.querySelector('.ingredients ul')
const cookTimeEl = document.querySelector('li.fa-stopwatch')
const servingsEl = document.querySelector('li.fa-utensils')
const recipeInfoEl = document.querySelector('.info-types')
const backEl = document.querySelector('.backBtn')
const saveEl = document.querySelector('.saveBtn')
let recipeData

const recipeId = window.document.location.href.split('?').pop()
fetch(`/recipeDetails?id=${recipeId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                const title = document.querySelector('h1')
                return title.textContent = data.error
            }
            recipeData = data
            renderRecipeDetails(data)
            console.log(data)
            console.log(recipeData)
        })

// render recipe details 
const renderRecipeDetails = (data) => {
    imageEl.setAttribute('src', data.image)

    titleEl.textContent = data.title
    cookTimeEl.textContent = `${data.readyInMinutes} mins`
    servingsEl.textContent = `Serves ${data.servings}`

    if (data.summary) {
        summaryHeadEl.textContent = 'Summary'
        const strippedString = data.summary.replace(/(<([^>]+)>)/ig,"");
        summaryEl.textContent = strippedString
    }
    
    if (data.instructions) {
        instructHeadEl.textContent = 'Instructions'
        // instructionsListEl.textContent = data.instructions.replace('Instructions', '')
        data.analyzedInstructions[0].steps.forEach((element) => {
            const instructionsItemEl = document.createElement('li')
            instructionsItemEl.setAttribute('class', 'instructions-item')
            instructionsItemEl.textContent = element.step
            instructionsListEl.appendChild(instructionsItemEl)
        })
    } else {instructHeadEl.textContent = 'Sorry, no instructions available.'

    }
    
    // render ingredients list
    if (data.extendedIngredients) {
        ingredientsHeadEl.textContent = 'Ingredients'
        data.extendedIngredients.forEach((element) => {
            const ingredientsItemEl = document.createElement('li')
            ingredientsItemEl.setAttribute('class', 'ingredients-item')
            let metaInfo = ''
            if (element.metaInformation) {
                let revMeta = element.metaInformation.reverse()
                metaInfo = revMeta.join()  
            }
            ingredientsItemEl.textContent = `${element.originalName} (${element.measures.us.amount} ${element.measures.us.unitShort})`
            ingredientsListEl.appendChild(ingredientsItemEl)
        })
    }
    
    // render recipe info icons
    // const infoTypes = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'veryHealthy']
    for (var element in data) {
        if (data[element] === true) {
            const infoEl = document.createElement('li')
            infoEl.setAttribute('class', 'info-type')
            infoEl.setAttribute('class', 'fas fa-check-circle')
            infoEl.textContent = element
            recipeInfoEl.appendChild(infoEl)
        }      
    }
}

// nav buttons
backEl.addEventListener('click', () => {
    sessionStorage.removeItem('currentRecipeId')
    location.href = 'http://localhost:3000/index.html' 
})

// 
async function saveData(url, data) {
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return response.json(); // parses JSON response into native JavaScript objects
}
  
//add event listener for save button 
saveEl.addEventListener('click', async () => {
    try {
        recipeData.image = recipeData.image.replace('556x370', '312x231')
        const response =  await saveData('http://localhost:3000/recipes', { 
            title: recipeData.title, 
            readyInMinutes: recipeData.readyInMinutes,
            servings: recipeData.servings,
            summary: recipeData.summary,
            analyzedInstructions: recipeData.analyzedInstructions,
            extendedIngredients: recipeData.extendedIngredients,
            image: recipeData.image
        })
        if (response.status === 401) {
            location.href = 'http://localhost:3000/login.html'
        } else {
            alert('Saved successfully!')
        }
    } catch (error) {
        alert(error.message)
    }
})


