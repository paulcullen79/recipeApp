
const messageEl = document.querySelector('.message')
const recipeListEl = document.querySelector('.recipe-list')
const form = document.querySelector('.form')
const input = document.querySelector('.search')

let recipeId = ''


const loadStoredData = async () => {
    let storedData = await JSON.parse(sessionStorage.data)
    renderRecipesList(storedData)  
}

const getRandomRecipes = () => {
    // endpoint call for random recipe list
    messageEl.textContent = 'Loading...'
    
    fetch('/randomRecipes')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return messageEl.textContent = data.error    
            }
            messageEl.textContent = ''

            // save data object to session storage
            sessionStorage.setItem('data', JSON.stringify(data))
            renderRecipesList(data)
          
        })
}

// check for saved data in sessionStorage
if (sessionStorage.data) {
    loadStoredData()
}   // check for stored recipe tile id
    else if (sessionStorage.currentId) {
    document.getElementById(currentId).scrollIntoView()
} 
else {
    getRandomRecipes()
}


// add submit event listener for search button
form.addEventListener('submit', (e) => {
    e.preventDefault()
    messageEl.textContent = 'Loading...'

    // endpoint call for recipe list based on search text
    fetch(`/recipesList?search=${input.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return messageEl.textContent = data.error    
            }
            messageEl.textContent = ''

            // save data object to session storage
            sessionStorage.setItem('data', JSON.stringify(data))
            renderRecipesList(data)
          
        })
}) 


// render recipes data
const renderRecipesList = (data) => {
    console.log(data)
    // clear any existing recipeListEl content
    recipeListEl.textContent = ''

    let results = []
    let baseUri = ''
    let randomResults = false
    const imageSize = '-312x231.'

    if (data.recipes) {
        results = data.recipes
        randomResults = true
    } else {
        results = data.results
        baseUri = data.baseUri
    }
    
    // render { id, title, readyInMinutes, servings, image }
    results.forEach(element => {
        const id = element.id

        // create recipe tile div
        const recipeDivEl = document.createElement('div')
        recipeDivEl.setAttribute('class', 'recipe-div')
        recipeDivEl.setAttribute('id', `recipe_${id}`)
        recipeListEl.appendChild(recipeDivEl)

        // create div for ul
        const infoDivEl = document.createElement('div')
        infoDivEl.setAttribute('class', 'recipe-info')
        recipeDivEl.appendChild(infoDivEl)

        // create ul
        const infoList = document.createElement("ul")
        infoList.setAttribute('class', 'recipe_ul') 
        infoDivEl.appendChild(infoList)
        
        // add click event listener for recipe tile
        recipeDivEl.addEventListener('click', () => {
            recipeId = recipeDivEl.id

            // Save selected recipe id to sessionStorage
            sessionStorage.setItem('currentRecipeId', id)
            // go to recipe details page
            window.location.href = `http://localhost:3000/recipe.html?${id}`
            
        })

        // create recipe infoList items
        // Title
        const titleEl = document.createElement("li")
        titleEl.textContent = 'Title: ' + element.title
        infoList.appendChild(titleEl)

        // Ready in minutes
        const readyInMinsEl = document.createElement("li")
        readyInMinsEl.textContent = 'Ready in: ' + element.readyInMinutes + ' minutes'
        infoList.appendChild(readyInMinsEl)

        //servings
        const servingsEl = document.createElement("li")
        servingsEl.textContent = 'Servings: ' + element.servings
        infoList.appendChild(servingsEl)

        //image
        const recipeImgEl = document.createElement("img")
        recipeImgEl.setAttribute('class', 'recipe-img')

        // no image returned
        if (!element.image) {
            recipeImgEl.src = '../img/LogoMakr_6tXjYM.png'
        } else {
            if (randomResults === true) {
                let imageURL = element.image.replace('-556x370.', imageSize)
                recipeImgEl.src = imageURL
            } else {
                const imageType = element.image.split('.').pop() 
                recipeImgEl.src = baseUri + id + imageSize + imageType
            }
        }

        recipeDivEl.appendChild(recipeImgEl)     
    })
            
    
        
    
    
    
}
