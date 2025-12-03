const fruitForm = document.querySelector("#inputSection form")
const fruitList = document.querySelector("#fruitSection ul")
const fruitNutrition = document.querySelector("#nutritionSection p")
const createForm = document.querySelector("#create-form")

let cal = 0

fruitForm.addEventListener("submit", extractFruit)

createForm.addEventListener("submit", createNewFruit)

function extractFruit(e) {
  e.preventDefault()
  fetchFruitData(e.target.fruitInput.value)
  e.target.fruitInput.value = ""
}

async function createNewFruit(e) {
  e.preventDefault()
  const data = { name: e.target.newFruitInput.value }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
  const response = await fetch("https://klein-fruity-api.onrender.com/fruits", options)
  let messageStatus = document.querySelector("#message")
  e.target.newFruitInput.value = ""
  if (response.status === 201) {
    messageStatus.textContent = "Fruit successfully created."
    setTimeout(() => {
      messageStatus.textContent = ""
    }, 4000)
  } else {
    messageStatus.textContent = "This fruit already exists. Please try again!"
    setTimeout(() => {
      messageStatus.textContent = ""
    }, 4000)
  }
}

async function fetchFruitData(fruit) {
  try {
    const respData = await fetch(`https://klein-fruity-api.onrender.com/fruits/${fruit}`)

    if (respData.ok) {
      const data = await respData.json()
      addFruit(data)
    } else {
      throw "Something has gone wrong with the API requests"
    }
  } catch (e) {
    console.log(e)
  }
}

function addFruit(fruit) {
  const li = document.createElement("li")
  li.classList.add("fruits")
  li.textContent = fruit.name

  li.addEventListener(
    "click",
    (e) => {
      cal -= fruit.nutritions.calories
      e.target.remove()
      fruitNutrition.textContent = "Total Calories: " + cal
    },
    { once: true }
  )
  fruitList.appendChild(li)

  cal += fruit.nutritions.calories
  fruitNutrition.textContent = "Total Calories: " + cal
}
