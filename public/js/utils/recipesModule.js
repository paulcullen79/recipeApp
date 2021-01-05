

class Recipes {
    constructor() {
        this.totalRecipes = 0,
        this.offset = 0,
        this.currentSearch = '',
        this.searchText = '',
        this.getRandomRecipes = async function() {
            const response = await fetch('/randomRecipes')
            const results = await response.json()
            return results
        },
        this.searchForRecipes = async function(searchWord, offsetNumber) {
            // endpoint call for recipe list based on search text
            return await fetch(`/recipesList?search=${searchWord}&offset=${offsetNumber}`)
                .then(response => response.json())
                .then(data => {  
                    return data    
                })
        },
        this.getMyRecipes = async function() {
            const savedRecipes = await fetch('/recipes', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                }
            })
            return savedRecipes.json()
        },
        this.deleteRecipe = async function(id) {
            const response = await fetch(`/recipes/${id}`, {
                method: 'DELETE', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                }
            })
            return response
        },
        this.formatResults = function(data) {
            let objArray = []
            let formattedResults = []
            let imageUrl = false
            let imageType
            const baseUri = 'https://spoonacular.com/recipeImages/'
            const imageSize = '-312x231'

            
            
            if (data.recipes) {
                objArray = data.recipes
                imageUrl = true
            } else if (data.results) {
                objArray = data.results
            }
            objArray.forEach((element) => {
                let image = ''
                if (imageUrl) {
                    image = element.image
                } else {
                    if (element.image) {
                        imageType = element.image.split('.').pop()
                        image = baseUri + element.id + imageSize + '.' + imageType
                    }
                    
                }
                const data = {
                    id: element.id,
                    title: element.title,
                    image: image         
                }
                formattedResults.push(data)
            })
            return formattedResults
        },
        this.renderRecipesList = function(data) {
            const recipeListEl = document.querySelector('.recipe-list')
            
            // clear any existing recipeListEl content
            recipeListEl.textContent = ''
            
            // render { id, title, readyInMinutes, servings, image }
            data.forEach(element => {
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
                    const imageSize = '-312x231.'
                    recipeImgEl.src = element.image.replace('-556x370.', imageSize)
                }
        
                recipeDivEl.appendChild(recipeImgEl) 
                
                // create remove button
                if (element.saved) {
                    const removeBtnEl = document.createElement('button')
                    removeBtnEl.setAttribute('class', 'button')
                    removeBtnEl.setAttribute('class', 'remove-btn')
                    removeBtnEl.style.display = 'block'
                    removeBtnEl.innerText = 'Remove'
                    recipeDivEl.appendChild(removeBtnEl)
                    // event listener for remove button
                    removeBtnEl.addEventListener('click', async () => {
                        event.stopPropagation()
                        try {
                            const response = await this.deleteRecipe(element._id)
                            if (response.status === 200) {
                                alert('Recipe has been deleted')
                                const data = await this.getMyRecipes()
                                this.renderRecipesList(data)
                            }
                        } catch(error) {
                            alert('Something went wrong!')

                        }
                    })
                }
            })  
            
        }
    }
}

export { Recipes }