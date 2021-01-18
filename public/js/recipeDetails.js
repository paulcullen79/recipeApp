import { getDetailsById, formatRecipeData, postToDatabase, renderRecipeDetails } from './utils/recipeDetailFunctions.js'

const recipes = ( async function() {
    // save button 
    const saveEl = document.querySelector('.saveBtn')
    saveEl.addEventListener('click', async () => {
        try { 
            const formattedData =  formatRecipeData(recipeData)
            const response = await postToDatabase('/recipes', formattedData)
            if (response.status === 401) {
                location.href = '/login.html'
            } else {
                alert('Saved successfully!')
            }
        } catch (error) {
            alert(error.message)
        }
    })

    // back button
    const backEl = document.querySelector('.backBtn')
    backEl.addEventListener('click', () => {
        location.href = `/index.html?${sessionStorage.currentRecipeId}`
    })

    // ***** call functions and render recipe details *****
    const recipeId = window.document.location.href.split('?').pop()
    const recipeData = await getDetailsById(recipeId)
    renderRecipeDetails(recipeData)
    
})()


