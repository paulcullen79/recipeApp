

const recipeListEl = document.querySelector('.recipe-list')
// const form = document.querySelector('.form')
// const input = document.querySelector('.search')

const getRandomRecipes = async () => { 
    return await fetch('/randomRecipes')
        .then(response => response.json())
        .then(results => {
            return results    
        })
}

const searchForRecipes = async (search, number) => {
    // endpoint call for recipe list based on search text
    return await fetch(`/recipesList?search=${search}&offset=${number}`)
        .then(response => response.json())
        .then(data => {  
            return data    
        })
}

// get users saved recipes
const getSavedRecipes = async () => {
    let savedRecipes = await fetch('/recipes', {
        method: 'GET', 
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        }
    })
    return savedRecipes.json()
}

// render recipe data as tiles
const renderRecipesList = (data) => {
    // clear any existing recipeListEl content
    recipeListEl.textContent = ''
    console.log(data)
    let results = []
    let baseUri = ''
    let randomResults = false
    let savedResults = false
    const imageSize = '-312x231.'

    // if rendering data in saved format
    if (data.savedResults) {
        results = data.savedResults
        savedResults = true
    } else if (data.recipes) {      // if rendering data in random recipe format
        results = data.recipes
        randomResults = true
    } else {                        // if rendering data in search results format 
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
            let recipeId = recipeDivEl.id

            // if recipe already saved, mark as saved in session storage
            if (savedResults) {
                sessionStorage.setItem('savedRecipe', true)
            }

            // Save data object and selected recipe id to sessionStorage
            sessionStorage.setItem('currentRecipeId', id)
            sessionStorage.setItem('data', JSON.stringify(data))
            
            
            // go to recipe details page
            window.location.href = `recipeDetails.html?${id}`
            
        })

        // create recipe infoList items
        // Title
        const titleEl = document.createElement("li")
        // titleEl.textContent = 'Title: ' + element.title
        titleEl.textContent = element.title
        infoList.appendChild(titleEl)

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
            } else if (savedResults === true) {
                recipeImgEl.src = element.image
            } else {
                // get image type
                const imageType = element.image.split('.').pop() 
                recipeImgEl.src = baseUri + id + imageSize + imageType
            }
        }

        recipeDivEl.appendChild(recipeImgEl) 
        
        // create remove button
        if (savedResults) {
            const removeBtnEl = document.createElement('button')
            removeBtnEl.setAttribute('class', 'button')
            removeBtnEl.setAttribute('class', 'remove-btn')
            removeBtnEl.style.display = 'block'
            removeBtnEl.innerText = 'Remove'
            recipeDivEl.appendChild(removeBtnEl)
        }
    })  
    
}


export { getRandomRecipes, searchForRecipes, getSavedRecipes, renderRecipesList }