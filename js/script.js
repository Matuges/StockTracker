document.querySelector('.input').addEventListener("click", newProduct)


// CRIA O PRODUTO JOGA NO ARRAY E SALVA O ARRAY NO LOCALSTORAGE
function newProduct() {
    let name = document.querySelector('#product-name').value
    let brand = document.querySelector('#product-brand').value
    let price = document.querySelector('#product-price').value 

    const newProductObject = {
        id: productIdCouter,
        name: name,
        brand: brand,
        price: price
    }

    document.querySelector('#product-name').value = ''
    document.querySelector('#product-brand').value = ''
    document.querySelector('#product-price').value = ''
    

    productsData.push(newProductObject)
    saveProductsToLocalStorage()
    renderProductElement(newProductObject)

    productIdCouter ++
    
}   

// MOSTRA NA TELA
function renderProductElement(product) {
    const div = document.createElement("div")
    div.className = "product-container"
    div.id = `${product.id}`

    div.innerHTML = `
        <button class="remove" onclick="del()">X</button>
        <div class="name">${product.name}</div>
        <div class="brand">${product.brand}</div>
        <div class="price">${product.price}</div>
    `
    document.querySelector(".products").appendChild(div)
}

// FUNÇÃO PARA SALVAR NO LOCAL STORAGE
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(productsData))
}

// CARREGA O LOCALSTORAGE
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products')
    if(storedProducts) {
        productsData = JSON.parse(storedProducts)

       if (productsData.length > 0) {
        const maxId = Math.max(...productsData.map(product => product.id)) //retorna um novo array somente com os ids e pega o id maximo
        productIdCouter = maxId + 1
       }

       productsData.forEach(product => {
        renderProductElement(product)
       })
    }
}



function del() {
    

    const button = event.target
    const parent = button.parentElement
    const idToRemove = parseInt(parent.id)
    parent.remove()

    productsData = productsData.filter(product => product.id !== idToRemove)
    saveProductsToLocalStorage()
}



window.addEventListener('load', loadProductsFromLocalStorage)