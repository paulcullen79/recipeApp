const imageEl = document.querySelector('.image')
const titleEl = document.querySelector('.header h1')
const summaryHeadEl = document.querySelector('.summary h3')
const summaryEl = document.querySelector('.summary p')
const instructHeadEl = document.querySelector('.instructions h3')
const instructionsEl = document.querySelector('.instructions p')
const ingredientsHeadEl = document.querySelector('.ingredients h3')
const ingredientsListEl = document.querySelector('.ingredients ul')
const cookTimeEl = document.querySelector('li.fa-stopwatch')
const servingsEl = document.querySelector('li.fa-utensils')
const recipeInfoEl = document.querySelector('.info-types')
const backEl = document.getElementById('backBtn')
const saveEl = document.getElementById('saveBtn')


const recipeId = window.document.location.href.split('?').pop()

fetch(`/recipeDetails?id=${recipeId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                const title = document.querySelector('h1')
                title.textContent = data.error
            }
            renderRecipeDetails(data)
            console.log(data)
        })

// render recipe details 
const renderRecipeDetails = (data) => {
    imageEl.setAttribute('src', data.image)

    titleEl.textContent = data.title
    cookTimeEl.textContent = `${data.readyInMinutes} mins`
    servingsEl.textContent = `Serves ${data.servings}`

    summaryHeadEl.textContent = 'Summary'
    const summary = data.summary.split('<a')
    summaryEl.innerHTML = summary[0]

    instructHeadEl.textContent = 'Instructions'
    instructionsEl.textContent = data.instructions.replace('Instructions', '')


    // render ingredients list
    ingredientsHeadEl.textContent = 'Ingredients'
    data.extendedIngredients.forEach((element) => {
        const ingredientsItemEl = document.createElement('li')
        ingredientsItemEl.setAttribute('class', 'ingredients-item')
        ingredientsItemEl.textContent = element.name
        ingredientsListEl.appendChild(ingredientsItemEl)
    })

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
    window.history.back()
})


