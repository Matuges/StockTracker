document.querySelector('.input').addEventListener("click", newProduct)

function newProduct() {
    let name = document.querySelector('#product-name').value
    let brand = document.querySelector('#product-brand').value
    let price = document.querySelector('#product-price').value

    const product = new Product(name, brand, price)
    console.log(product.name, product.brand, product.price)
}   

