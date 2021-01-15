import { Recipes } from './utils/recipesModule.js'


(async function () {
    let recipes = new Recipes
    // DOM queries
    const logoutEl = document.querySelector('.logout')
    const myRecipesEl = document.querySelector('.myRecipes')
    const messageEl = document.querySelector('.message')
    
    
    recipes.getMyRecipes()
        .then((data) => {
            recipes.renderRecipesList(data)
            messageEl.innerHTML = 'Your saved recipes.'
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
        .then(() => {
            sessionStorage.removeItem('accessToken', 'data')
            location = '/index.html'
        })
    })
     
    
    
    
    

    
})()