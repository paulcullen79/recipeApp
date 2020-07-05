

const signupEl = document.querySelector('.signupBtn')
const loginEl = document.querySelector('.loginBtn')
const nameEl = document.querySelector('.name')
const emailEl = document.querySelector('.email')
const passwordEl = document.querySelector('.password')
const inputDiv = document.querySelector('.inputDiv')
const submitEl = document.querySelector('.submitBtn')
const cancelEl = document.querySelector('.cancelBtn')
const backEl = document.querySelector('.backBtn')


let signupSelected = false

// create new user
async function createUser(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// create new user
async function loginUser(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json() // parses JSON response into native JavaScript objects
}

// add event listener to signup button
signupEl.addEventListener('click', (e) => {
    e.preventDefault()
    signupSelected = true
    nameEl.style.display = 'block'
    emailEl.style.display = 'block'
    passwordEl.style.display = 'block'
    submitEl.style.display = 'inline-block'
    cancelEl.style.display = 'inline-block'
    loginEl.style.display = 'none'
    signupEl.style.display = 'none'
    backEl.style.display = 'none'
})

// add event listener to login button
loginEl.addEventListener('click', (e) => {
    e.preventDefault()
    emailEl.style.display = 'block'
    passwordEl.style.display = 'block'
    submitEl.style.display = 'inline-block'
    cancelEl.style.display = 'inline-block'
    loginEl.style.display = 'none'
    signupEl.style.display = 'none'
    backEl.style.display = 'none'
})

// add event listener to back button
backEl.addEventListener('click', () => {
    if (!sessionStorage.currentRecipeId) {
        location.href = 'http://localhost:3000/index.html'
    } else {
        location.href = `http://localhost:3000/recipe.html?${sessionStorage.currentRecipeId}`
    }   
})

// add event listener to cancel button
cancelEl.addEventListener('click', () => {
    location.href = 'http://localhost:3000/login.html'
})

// add event listener to submit button
submitEl.addEventListener('click', async (e) => {
    e.preventDefault()
    // submit signup data
    if (signupSelected === true) {
        const response = await createUser('http://localhost:3000/users', {
            name: nameEl.value,
            email: emailEl.value,
            password: passwordEl.value
        })
        if (!response.user) {
            alert('Error: Failed to register')
        } else {
            sessionStorage.setItem('accessToken', response.token)

            alert(`Welcome ${response.user.name}! Thank you for registering`)
            window.history.back()
        }
    // submit login data    
    } else {
        const response = await loginUser('http://localhost:3000/users/login', {
            email: emailEl.value,
            password: passwordEl.value
        })
        if (!response.user) {
            alert('Error: Failed to login')
        } else {
            sessionStorage.setItem('accessToken', response.token)
            alert(`Welcome back`)
            window.history.back()
        }
    }
})