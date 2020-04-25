
const recipeListTag = document.querySelector('.recipe-list')
const form = document.querySelector('.form')
const input = document.querySelector('.search')

let recipeId = ''

// Get saved data from sessionStorage
const loadStorageData = async () => {
    let storedData = await JSON.parse(sessionStorage.data)
    if (storedData) {
        console.log(storedData)
        renderRecipeList(storedData)
    }
    if (sessionStorage.currentId) {
        document.getElementById(currentId).scrollIntoView()
    }
}
loadStorageData()




form.addEventListener('submit', (e) => {
    e.preventDefault()
    recipeListTag.textContent = 'Loading...'
    fetch(`/recipesList?search=${input.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return recipeListTag.textContent = data.error    
            }
            recipeListTag.textContent = ''
            sessionStorage.setItem('data', JSON.stringify(data))
            renderRecipeList(data)
            // console.log(data)
        })
}) 

// 90x90
// 240x150
// 312x150
// 312x231
// 480x360
// 556x370
// 636x393


// render data
const renderRecipeList = (data) => {
    // render { id, title, readyInMinutes, servings, image }
    const baseUri = data.baseUri
    const imageSize = '-312x231.'
    data.results.forEach(element => {

        const id = element.id

        // create recipe tile div
        const recipeDivEl = document.createElement('div')
        recipeDivEl.setAttribute('class', 'recipe-div')
        recipeDivEl.setAttribute('id', `recipe_${id}`)
        recipeListTag.appendChild(recipeDivEl)

        // create div for ul
        const infoDivEl = document.createElement('div')
        infoDivEl.setAttribute('class', 'recipe-info')
        recipeDivEl.appendChild(infoDivEl)

        // create ul
        const infoList = document.createElement("ul")
        infoList.setAttribute('class', 'recipe_ul') 
        infoDivEl.appendChild(infoList)

        recipeDivEl.addEventListener('click', () => {
            recipeId = recipeDivEl.id
            // Save data to sessionStorage
            sessionStorage.setItem('currentRecipeId', id)
            window.location.href = `http://localhost:3000/recipe.html?${id}`
            
        })

        // create infoList items
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
        if (element.image) {
            const recipeImgEl = document.createElement("img")
            recipeImgEl.setAttribute('class', 'recipe-img')
            const imageType = element.image.split('.').pop() 
            recipeImgEl.src = baseUri + id + imageSize + imageType
            recipeDivEl.appendChild(recipeImgEl)
        }
        

    })
}
