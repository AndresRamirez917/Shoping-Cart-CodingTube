//generacion de promesa para obtener los datos de la api con fetch
/* fetch("https://api.escuelajs.co/api/v1/products").then(res => res.json()).then(data => console.log(data)) */

/* generacion de la promesa para obtener los mismos ddtos de la api pero usando async/await */

let res = await fetch("https://api.escuelajs.co/api/v1/products");
let data = await res.json(); // con el .json() muestro el contenido de la api

// ----GENERACIÓN DE VARIABLES----

//array para almacenar los productos elegidos de la lista de productos
let shoppingCartArray = [];
//valor total de la compra
let total = 0;
let productContainer = document.querySelector(".shop-items");
let totalElement = document.querySelector(".cart-total-title");
// declaro una variable que almacenará de los 200 productos, solo uso los 4 primeros del array
//al declarar productsArray de esta manera ya estoy creando el array, sin necesidad
//de hacerlo explicitamente como productsArray = []
let productsArray = data.slice(0, 4);
console.log(productsArray);

// recorremos el array para obtener 1 por 1 los 4 objetos del array
productsArray.forEach((product) => {
  // una vez obtenidos los dibujamos en la página
  //cuando se trabaja con elementos de una BD, se debe obtener el id de cada elemento para su uso, como en este ejemplo
  productContainer.innerHTML += `<div class="shop-item" id="${product.id}">
    <span class="shop-item-title">${product.title}</span>
    <img class="shop-item-image" src="${product.images}">
    <div class="shop-item-details">
        <span class="shop-item-price">$${product.price}</span>
        <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
    </div>
</div>`;
});

// de esta manera se crea un nodelist con todos los botones add de a la página
let addBtns = document.querySelectorAll(".shop-item-button");

// por buenas prácticas actualizo el nodelist a un array con el operador spread
addBtns = [...addBtns];
let cartContainer = document.querySelector(".cart-items");
addBtns.forEach((btn) => {
  //con el parametro event puedo buscar el Parent del objeto para buscar su id(efectos de este ejercicio)
  btn.addEventListener("click", (event) => {
    // ----AGREGAR PRODUCTOS AL CARRO----

    // BUSCO PRODUCTOS POR EL ID
    //con el parámetro event que se pasó como segundo parámetro y a través de los métodos que este tiene
    //busco el id del nodo con la ruta mostrada abajo (traversing the DOM)
    let actualId = parseInt(event.target.parentNode.parentNode.id);
    console.log(actualId);

    // ENCONTRAR EL OBJETO ACTUAL CON EL ID
    //obtengo el producto con su id, nombre, imagen y precio
    let actualProduct = productsArray.find((item) => item.id == actualId);
    if (actualProduct.quantity === undefined) {
      //pregunto si es la primera vez que le estoy agregando la propiedad quantity
      //le creo una nueva propiedad al objeto(que no existia) para hacer operaciones con ella
      actualProduct.quantity = 1;
    }

    // PREGUNTO SI EL PRODUCTO EXISTE EN EL CARRITO
    let existe = false;
    shoppingCartArray.forEach((product) => {
      if (actualId == product.id) {
        existe = true;
      }
    });
    if (existe) {
      // si la propiedad quantity ya existe, no la creo de nuevo sino que agrego uno al número que trae
      actualProduct.quantity++;
    } else {
      // AGREGO PRODUCTOS AL CARRITO
      shoppingCartArray.push(actualProduct);
      console.log(shoppingCartArray);
    }
    // llamo a la función drawItems con la que dibujo los productos en el carrito
    drawItems();

    // llamo la funcion get total para que vaya actualizando el total por cada producto agregado al carro
    getTotal();

    //llamo a la función que usa el input para agregar o dismninuir la cantidad de productos
    updateNumberOfItems();

    //llamo a la función que elimina artículos del carrito
    deleteItems();
  });
});

// ----FUNCIÓN PARA CALCULAR EL TOTAL DE LA COMPRA EN EL CARRITO
function getTotal() {
  let sumTotal;
  //el primer parámetro es la operacion suma y el segundo es el "avatar" del objeto para obtener sus propiedades y poder
  //hacer operaciones con ellas
  let total = shoppingCartArray.reduce((sum, item) => {
    sumTotal = sum + item.quantity * item.price;
    return sumTotal;
  }, 0); //el cero es el valor con que empieza la variable y se pone por documentación de reduce
  totalElement.innerText = `$${total}`;
}

// ----FUNCIÓN PARA DIBUJAR LOS PRODUCTOS EN EL CARRITO
function drawItems() {
  cartContainer.innerHTML = "";
  shoppingCartArray.forEach((product) => {
    // al dar click dibujo el producto en el carrito, debo dibujar los productos dentro de un forEach
    //para que los productos se muestren uno debajo del otro y no se sobreescriban
    //hacer prueba de este código sin este forEach para comprobar comportamiento erróneo que tenía
    cartContainer.innerHTML += `<div class="cart-row">
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${product.images}" width="100" height="100">
            <span class="cart-item-title">${product.title}</span>
        </div>
        <span class="cart-price cart-column">$${product.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" min="1" type="number" value="${product.quantity}">
            <button class="btn btn-danger" type="button">REMOVE</button>
    
        </div>
    </div>`;
  });
}

// ----FUNCIÓN PARA ACTUALIZAR PRODUCTOS CON EL INPUT DEL CARRITO----
function updateNumberOfItems() {
  let inputNumber = document.querySelectorAll(".cart-quantity-input");
  //convierto el nodelist a array
  inputNumber = [...inputNumber];
  //forEach para escuchar los eventos de todos los input del carrito
  inputNumber.forEach((input) => {
    input.addEventListener("click", event => {
      console.log("click");
      let actualInputTitle = event.target.parentElement.parentElement.childNodes[1].innerText
      //convierto a número el value para realizar las cálculos
      let actualProductQuanity = parseInt(event.target.value);
      console.log(actualInputTitle)
      let actualInputObject = shoppingCartArray.find((product) => product.title == actualInputTitle);
      console.log(actualInputObject)
      actualInputObject.quantity=actualProductQuanity
        //llamo a la función para actualizar el total
        getTotal();
      
    });
  });
}

function deleteItems(){
    let btnDelete = document.querySelectorAll(".btn-danger");
    btnDelete = [...btnDelete];
    btnDelete.forEach((btn)=>{
        btn.addEventListener("click", event =>{
            console.log("click")
            let actualInputTitle = event.target.parentElement.parentElement.childNodes[1].innerText
            let actualInputObject = shoppingCartArray.find((product) => product.title == actualInputTitle);
            //prueba de eliminar con splice hecha por mi
            //shoppingCartArray.splice(btn.title == actualInputTitle)
           /* con .filter filtro todos los objetos menos el que estoy pasando, es una forma de eliminar del array
           debo de actualizar el objeto inicial por eso lo igualo a si mismo (shoppingCartArray) aunque ya este declarado
           desde el inicio del código */ 
            shoppingCartArray = shoppingCartArray.filter(product => product != actualInputObject)
           drawItems(); 
           getTotal();
           updateNumberOfItems();
        })
    })
}