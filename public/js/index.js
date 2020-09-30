import { getRandomRecipes, searchForRecipes, getSavedRecipes, renderRecipesList } from './utils/recipeApiFucntions.js'

(async function app() {
    // DOM queries
    const messageEl = document.querySelector('.message')
    const form = document.querySelector('.form')
    const input = document.querySelector('.search')

    const loginEl = document.querySelector('.login')
    const logoutEl = document.querySelector('.logout')
    const myRecipesEl = document.querySelector('.myRecipes')
    const nextEl = document.querySelector('.next')
    nextEl.style.display = 'none'
    const backEl = document.querySelector('.back')
    backEl.style.display = 'none'

    let totalResults = 0
    let currentSearch = 'random'
    let offset = 0
    let searchText = ''
    
    // check if user is logged in (has accessToken saved)
    // DOM config
    if (sessionStorage.accessToken) { 
        logoutEl.style.display = 'block'
        loginEl.style.display = 'none'
        myRecipesEl.style.display = 'block'
    } else {
        logoutEl.style.display = 'none'
        loginEl.style.display = 'block'
        myRecipesEl.style.display = 'none'
    
    }
    
    // check for saved data in sessionStorage and render
    
    if (sessionStorage.data ) {
        const storedData = await JSON.parse(sessionStorage.data)
        renderRecipesList(storedData) 
        document.getElementById('recipe_' + sessionStorage.currentRecipeId).scrollIntoView()

        sessionStorage.removeItem('data')
        sessionStorage.removeItem('currentRecipeId')
        nextEl.style.display = 'inline-block' 
    } else {
        try { 
            messageEl.textContent = 'Loading...'
            // get random selection of recipes and render
            const data = await getRandomRecipes()
            console.log(data)
            if (data.error) {
                messageEl.textContent = data.error    
            } else {
                messageEl.textContent = 'A random selection. Please enter a search term.'
                renderRecipesList(data)
                nextEl.style.display = 'inline-block' 
            }
            
        } catch(error){
            messageEl.textContent = error 
        }
        
    }


    // event listener for next button
    nextEl.addEventListener('click', async () => {
        if (currentSearch === 'userSearch' && totalResults >= offset + 12) {
            backEl.style.display = 'inline-block'
            offset = offset + 12
            try {
                messageEl.textContent = 'Loading...'
                const data = await searchForRecipes(searchText, offset)
                if (data.error) {
                     throw data.error    
                } else if (totalResults - offset < 12) {
                    throw 'Out of recipes for this search'  
                } else {
                    messageEl.textContent = ''
                    renderRecipesList(data)
                }         
            } catch(error) {
                messageEl.textContent = error
            }
            
        } else {
            try {
                messageEl.textContent = 'Loading...'
                backEl.style.display = 'none'
                const data = await getRandomRecipes()
                if (data.error) {
                    throw data.error    
               } else {
                   messageEl.textContent = 'A random selection. Please enter a search term.'
                   renderRecipesList(data)
               }   
            } catch(error) {
                messageEl.textContent = error
            }
            
        }  
    })
    
    // add event listener for my recipes button
    myRecipesEl.addEventListener('click', () => {
        getMyRecipes()
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
     
    // event listener for search button
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault()
            messageEl.textContent = 'Loading...'
            
            currentSearch = 'userSearch'
            searchText = input.value 
            
            let data = await searchForRecipes(input.value, offset)
            totalResults = data.totalResults
            if (data.error) {
                throw data.error    
            } else if (data.results.length === 0) {
               throw 'Invalid search term'  
            } else {
               messageEl.textContent = ''
               renderRecipesList(data)
               nextEl.style.display = 'inline-block'
            }    
        } catch(error) {
            messageEl.textContent = error  
        }
        
    }) 
    
    
    
    // event listener for back button
    backEl.addEventListener('click', async () => {
        try {
            if (offset > 0) {
                offset = offset - 12
                if (offset === 0) {
                    backEl.style.display = 'none'
                }
                const data = await searchForRecipes(searchText, offset)
                renderRecipesList(data)
            } 
        } catch(error) {
            messageEl.textContent = data.error   
        }
        
    })
})()





