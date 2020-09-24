const messageEl = document.querySelector('.message')
const recipeListEl = document.querySelector('.recipe-list')
const form = document.querySelector('.form')
const input = document.querySelector('.search')
const loginEl = document.querySelector('.login')
const logoutEl = document.querySelector('.logout')
const savedRecipesEl = document.querySelector('.savedRecipes')
const nextEl = document.querySelector('.next')
const backEl = document.querySelector('.back')

let totalResults = 0
let recipeId = ''
let currentSearch = 'random'
let offset = 0
let searchText = ''

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
    .then(() => {
        // scroll to current recipe
        if (sessionStorage.currentRecipeId) {
            document.getElementById('recipe_' + sessionStorage.currentRecipeId).scrollIntoView()
        }  
    })
   
}   
else {
    getRandomRecipes()
}

// check if user is logged in (has accessToken saved)
if (sessionStorage.accessToken) { 
    logoutEl.style.display = 'block'
    loginEl.style.display = 'none'
    savedRecipesEl.style.display = 'block'

} else {
    logoutEl.style.display = 'none'
    loginEl.style.display = 'block'
    savedRecipesEl.style.display = 'none'

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

// add event listener for saved recipes button
savedRecipesEl.addEventListener('click', () => {
    getSavedRecipes()
        .then((data) => {
            renderRecipesList({ savedResults: data })
        })
})

// add event listener for logout
logoutEl.addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        }
    })
    .then(() => {
        sessionStorage.removeItem('accessToken', 'data')
        location = 'http://localhost:3000/index.html'
    })
})

const searchForRecipes = (search, number) => {
    // endpoint call for recipe list based on search text
    console.log(number)
    fetch(`/recipesList?search=${search}&offset=${number}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return messageEl.textContent = data.error    
            } else if (data.results.length === 0) {
                return messageEl.textContent = 'Invalid search term'  
            }
            messageEl.textContent = ''

            // save data object to session storage
            sessionStorage.setItem('data', JSON.stringify(data))
            totalResults = data.totalResults
            renderRecipesList(data)
          
        })
}

// add submit event listener for search button
form.addEventListener('submit', (e) => {
    e.preventDefault()
    messageEl.textContent = 'Loading...'
    currentSearch = 'userSearch'
    searchText = input.value 
    searchForRecipes(input.value, offset)
}) 

// event listener for next button
nextEl.addEventListener('click', () => {
    if (currentSearch === 'userSearch' && totalResults >= offset + 12) {
        backEl.style.display = 'inline-block'
        offset = offset + 12
        searchForRecipes(searchText, offset)
    } else {
        backEl.style.display = 'none'
        getRandomRecipes()
    }  
})

// event listener for back button
backEl.addEventListener('click', () => {
    if (offset > 0) {
        offset = offset - 12
        if (offset === 0) {
            backEl.style.display = 'none'
        }
        searchForRecipes(searchText, offset)
    } 
})

// render recipes data
const renderRecipesList = (data) => {
    console.log(data)
    // clear any existing recipeListEl content
    recipeListEl.textContent = ''

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
            recipeId = recipeDivEl.id

            // if recipe already saved, mark as saved in session storage
            if (savedResults) {
                sessionStorage.setItem('savedRecipe', true)
            }

            // Save selected recipe id to sessionStorage
            sessionStorage.setItem('currentRecipeId', id)
            
            // go to recipe details page
            window.location.href = `recipe.html?${id}`
            
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
