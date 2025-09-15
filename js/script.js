document.querySelector('.input').addEventListener("click", newProduct)


// CRIA O PRODUTO JOGA NO ARRAY E SALVA O ARRAY NO LOCALSTORAGE
function newProduct() {
    
    let name = document.querySelector('#product-name').value
    let brand = document.querySelector('#product-brand').value
    let price = document.querySelector('#product-price').value 

    if (name && brand && price){

    

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
    } else window.alert("Preencha todos os campos antes de adicionar!")
}   

// MOSTRA NA TELA
function renderProductElement(product) {
    const div = document.createElement("div")
    div.className = "product-container"
    div.id = `${product.id}`

    div.innerHTML = `
        <div class = "product-actions"> 
        <button class = "edit" onclick="editProduct(${product.id})">Editar</button>
        <button class="remove" onclick="del(${product.id})">X</button>
        </div>
        <div class="name"> NOME DO PRODUTO: ${product.name}</div>
        <div class="brand">MARCA DO PRODUTO: ${product.brand}</div>
        <div class="price">PREÇO DO PRODUTO: R$${product.price}</div>
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



function del(productId) {
    if (window.confirm("Tem certeza que deseja remover este produto?")){
    
    const productElement = document.getElementById(productId)
    
    
    const idToRemove = parseInt(productId)
    productElement.remove()

    productsData = productsData.filter(product => product.id !== idToRemove)
    saveProductsToLocalStorage()
    }
}

function editProduct (productId) {
    const productToEdit = productsData.find(product => product.id === productId)

    const productElement = document.getElementById(productId)

    productElement.innerHTML =
    `
        <div class = "product-actions"> 
        <button class = "save" onclick="saveEditedProduct(${productId})">Salvar</button>
        <button class="remove" onclick="del(${productId})">X</button>
        </div>
        <input type="text" class="edit-name" value="${productToEdit.name}">
        <input type="text" class="edit-brand" value="${productToEdit.brand}">
        <input type="number" class="edit-price" value="${productToEdit.price}">
    `
}

function saveEditedProduct (productId) {
    const productElement = document.getElementById(productId)

    const newName = productElement.querySelector(".edit-name").value
    const newBrand = productElement.querySelector(".edit-brand").value
    const newPrice = productElement.querySelector(".edit-price").value

    const productToUpdate = productsData.find(product => product.id === productId)
    productToUpdate.name = newName
    productToUpdate.brand = newBrand
    productToUpdate.price = newPrice

    saveProductsToLocalStorage()

    productElement.innerHTML =
    `
        <div class="product-actions">
            <button class="edit" onclick="editProduct(${productId})">Editar</button>
            <button class="remove" onclick="del(${productId})">X</button>
        </div>
        <div class="name">NOME DO PRODUTO: ${productToUpdate.name}</div>
        <div class="brand">MARCA DO PRODUTO: ${productToUpdate.brand}</div>
        <div class="price">PREÇO DO PRODUTO: R$${productToUpdate.price}</div>
    `;
}


document.querySelector(".filterButton").addEventListener("click", filter)

function filter() {
    let query = document.querySelector(".filterQuery").value
    const list = document.querySelector(".products")
    if (query) {

    list.innerHTML = ""
    const filteredProducts = productsData.filter(product => {
        return product.name.toLowerCase().indexOf(query.toLowerCase()) > -1
    })

     filteredProducts.forEach(product => {
        renderProductElement(product)
       })
    } else {
        list.innerHTML = ""
        loadProductsFromLocalStorage()
        console.log("resetou")
    }
}

document.querySelector(".sort").addEventListener("click", sort)

function sort () {
    const sortOption = document.querySelector('input[name="sorting"]:checked')

    if (sortOption) {
            const id = sortOption.id
            if (id === "alfa") {
                productsData.sort((a, b) => a.name.localeCompare(b.name))
                console.log("ordem alfa")
            } else if (id === "price-ac") {
                productsData.sort((a, b) => a.price - b.price)
            } else if (id === "price-dc"){
                productsData.sort((a, b) => b.price - a.price)
        }
        const element = document.querySelector(".products")
        element.innerHTML = ""

        productsData.forEach(product => {
            renderProductElement(product)
        })
    } else {
        window.alert ("você não selecionou nenhuma opção")
    }
}


window.addEventListener('load', loadProductsFromLocalStorage)