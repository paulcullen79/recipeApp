

const loginEl = document.querySelector('.login')
const logoutEl = document.querySelector('.logout')
const myRecipesEl = document.querySelector('.myRecipes')

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