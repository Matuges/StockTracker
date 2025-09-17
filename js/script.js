document.querySelector('.input').addEventListener("click", newProduct)


// CRIA O PRODUTO JOGA NO ARRAY E SALVA O ARRAY NO LOCALSTORAGE
function newProduct() {
    
    let name = document.querySelector('#product-name').value
    let brand = document.querySelector('#product-brand').value
    let price = document.querySelector('#product-price').value 
    let stock = 0
    if (name && brand && price){

    const newProductObject = {
        id: productIdCouter,
        name: name,
        brand: brand,
        price: price,
        stock: stock
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
    div.draggable = true

    div.innerHTML = `
        <div class = "product-actions"> 
        <button class = "edit" onclick="editProduct(${product.id})">Editar</button>
        <div class = "stock-control"> 
            <button class= "plus-stock" onclick="plusStock(${product.id})">+</button>
            <button class= "subtraction-stock" onclick="subtractStock(${product.id})">-</button>
        </div>
        <button class="remove push" onclick="del(${product.id})">X</button>

        </div>
        <div class="name"> NOME DO PRODUTO: ${product.name}</div>
        <div class="brand">MARCA DO PRODUTO: ${product.brand}</div>
        <div class="price">PREÇO DO PRODUTO: R$${product.price}</div>
        <div class="stock">ESTOQUE: ${product.stock}</div>
    `
    document.querySelector(".products").appendChild(div)

    addDragAndDropListeners(div)
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

        <button class="remove push" onclick="del(${productId})">X</button>
        </div>
        <input type="text" class="edit-name" value="${productToEdit.name}">
        <input type="text" class="edit-brand" value="${productToEdit.brand}">
        <input type="number" class="edit-price" value="${productToEdit.price}">
        <input type="number" class="edit-stock" value="${productToEdit.stock}">
    `
}

function saveEditedProduct (productId) {
    const productElement = document.getElementById(productId)

    const newName = productElement.querySelector(".edit-name").value
    const newBrand = productElement.querySelector(".edit-brand").value
    const newPrice = productElement.querySelector(".edit-price").value
    const newStock = productElement.querySelector(".edit-stock").value

    const productToUpdate = productsData.find(product => product.id === productId)
    productToUpdate.name = newName
    productToUpdate.brand = newBrand
    productToUpdate.price = newPrice
    productToUpdate.stock = newStock

    saveProductsToLocalStorage()

    productElement.innerHTML =
    `
        <div class="product-actions">
            <button class="edit" onclick="editProduct(${productId})">Editar</button>

        <div class = "stock-control"> 
            <button class= "plus-stock" onclick="plusStock(${productId})">+</button>
            <button class= "subtraction-stock" onclick="subtractStock(${productId})">-</button>
        </div>
        <button class="remove push" onclick="del(${productId})">X</button>
        </div>
        <div class="name">NOME DO PRODUTO: ${productToUpdate.name}</div>
        <div class="brand">MARCA DO PRODUTO: ${productToUpdate.brand}</div>
        <div class="price">PREÇO DO PRODUTO: R$${productToUpdate.price}</div>
        <div class="stock">ESTOQUE: ${productToUpdate.stock}</div>
    `;
}


document.querySelector(".filterButton").addEventListener("click", filter)

function filter() {
    let query = document.querySelector(".filterQuery").value
    const list = document.querySelector(".products")
    const filterOption = document.querySelector('input[name="filter"]:checked')
    if (filterOption) {
        const id = filterOption.id
        if (query && (id === "name")) {

        list.innerHTML = ""
        const filteredProducts = productsData.filter(product => {
            return product.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        })

        filteredProducts.forEach(product => {
            renderProductElement(product)
        })
        } else if (query && (id === "brand")){
            list.innerHTML = ""
        const filteredProducts = productsData.filter(product => {
            return product.brand.toLowerCase().indexOf(query.toLowerCase()) > -1
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

let draggedProductId = null;

function addDragAndDropListeners(element) {
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('drop', handleDragDrop)
    element.addEventListener('dragend', handleDragEnd)
}

function handleDragStart(e) {
    draggedProductId = e.target.id

    e.target.classList.add("dragging")
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', e.target.id)
}

function handleDragOver(e) {
    e.preventDefault()

    if (e.target.closest('.product-container')) {
        e.target.closest('.product-container').classList.add("drag-over")
    }
}

function handleDragLeave (e) {

     if (e.target.closest('.product-container')) {
        e.target.closest('.product-container').classList.remove("drag-over")
    }
}

function handleDragDrop (e) {
    e.preventDefault()

     if (e.target.closest('.product-container')) {
        e.target.closest('.product-container').classList.remove("drag-over")
    }

    const targetElement = e.target.closest('.product-container')
    if (!targetElement || targetElement.id === draggedProductId){
        console.log ("teste")
        return
    }

    const droppedOnProductId = targetElement.id

    const draggedProductIndex = productsData.findIndex(p => p.id === draggedProductId)
    const droppedOnProductIndex = productsData.findIndex(p => p.id === droppedOnProductId)

    const [draggedProduct] = productsData.splice(draggedProductIndex, 1)
    productsData.splice(droppedOnProductIndex, 0, draggedProduct)
    document.querySelector(".products").innerHTML = "";
    productsData.forEach(product => renderProductElement(product))
    saveProductsToLocalStorage();
    console.log ("dragconfirm")

}

function handleDragEnd(e) {
    e.target.classList.remove("dragging")
    draggedProductId = null
}


// STOCK CONTROL

function plusStock (productId) {
    const productToAdd = productsData.find(product => product.id === productId)
    const element = document.getElementById(`${productId}`)
    const stockElement = element.querySelector(".stock")

    productToAdd.stock ++
    stockElement.innerHTML = `ESTOQUE: ${productToAdd.stock}`
    saveProductsToLocalStorage()
    
}

function subtractStock (productId) {
    const productToAdd = productsData.find(product => product.id === productId)
    const element = document.getElementById(`${productId}`)
    const stockElement = element.querySelector(".stock")

    productToAdd.stock --
    stockElement.innerHTML = `ESTOQUE: ${productToAdd.stock}`
    saveProductsToLocalStorage()
    
}

window.addEventListener('load', loadProductsFromLocalStorage) 