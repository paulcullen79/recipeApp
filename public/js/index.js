import { Recipes } from './utils/recipesModule.js'


(async function () {
    let recipes = new Recipes
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
        recipes.renderRecipesList(storedData) 
        document.getElementById('recipe_' + sessionStorage.currentRecipeId).scrollIntoView()

        sessionStorage.removeItem('data')
        sessionStorage.removeItem('currentRecipeId')
        nextEl.style.display = 'inline-block' 
    } else {
        try { 
            messageEl.innerHTML = 'Loading...'
            // get random selection of recipes and render
            const data = await recipes.getRandomRecipes()
            const formattedData = recipes.formatResults(data)
            
    
            if (formattedData.error) {
                messageEl.innerHTML = formattedData.error    
            } else {
                messageEl.innerHTML = 'Here is a random selection of recipes.<br>Please enter a search term.'
                recipes.renderRecipesList(formattedData)
                nextEl.style.display = 'inline-block' 
            }
            
        } catch(error){
            messageEl.innerHTML = error 
        }
        
    }


    // event listener for next button
    nextEl.addEventListener('click', async () => {
        if (recipes.currentSearch === 'userSearch' && recipes.totalResults >= recipes.offset + 12) {
            backEl.style.display = 'inline-block'
            recipes.offset = recipes.offset + 12
            try {
                messageEl.innerHTML = 'Loading...'
                const data = await recipes.searchForRecipes(recipes.searchText, recipes.offset)
                if (data.error) {
                     throw data.error    
                } else if (recipes.totalResults - recipes.offset < 12) {
                    throw 'Out of recipes for this search'  
                } else {
                    messageEl.innerHTML = ''
                    recipes.renderRecipesList(recipes.formatResults(data))
                    window.scrollTo(0,0)
                }         
            } catch(error) {
                messageEl.innerHTML = error
            }
            
        } else {
            try {
                messageEl.innerHTML = 'Loading...'
                backEl.style.display = 'none'
                const data = await recipes.getRandomRecipes()
                if (data.error) {
                    throw data.error    
               } else {
                   messageEl.innerHTML = 'More random recipes. Please enter a search term.'
                   recipes.renderRecipesList(recipes.formatResults(data))
                   window.scrollTo(0,0)
               }   
            } catch(error) {
                messageEl.innerHTML = error
            }
            
        }  
    })
    
    // add event listener for my recipes button
    myRecipesEl.addEventListener('click', () => {
        recipes.getMyRecipes()
            .then((data) => {
                recipes.renderRecipesList(data)
                myRecipesTag.classList.add('currentPage')
                homeTag.classList.remove('currentPage')
                
                nextEl.style.display = 'none'
                messageEl.innerHTML = 'Saved recipes.'
            })

            
    })
    
    // event listener for logout button
    logoutEl.addEventListener('click', () => {
        fetch('/users/logout', {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            }
        })
        sessionStorage.removeItem('accessToken', 'data')
    })
     
    // event listener for search button
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault()
            messageEl.innerHTML = 'Loading...'
            
            recipes.currentSearch = 'userSearch'
            recipes.searchText = input.value 
            
            let data = await recipes.searchForRecipes(input.value, recipes.offset)
            recipes.totalResults = data.totalResults
            if (data.error) {
                throw data.error    
            } else if (data.results.length === 0) {
               throw 'Invalid search term'  
            } else {
               messageEl.innerHTML = ''
               const fmd = recipes.formatResults(data)
               recipes.renderRecipesList(fmd)
               nextEl.style.display = 'inline-block'
            }
            
        } catch(error) {
            messageEl.innerHTML = error  
        }
        
    }) 
    
    // event listener for back button
    backEl.addEventListener('click', async () => {
        try {
            if (recipes.offset > 0) {
                recipes.offset = recipes.offset - 12
                if (recipes.offset === 0) {
                    backEl.style.display = 'none'
                }
                const data = await recipes.searchForRecipes(recipes.searchText, recipes.offset)
                recipes.renderRecipesList(recipes.formatResults(data))
                window.scrollTo(0,0)
            } 
        } catch(error) {
            messageEl.innerHTML = data.error   
        }
        
    })

    
})()





