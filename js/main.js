
//correcto
//función init que reconozca parámetros, para mostrar el carro o los productos
// función consulta que consultará en función de lo que se quiera hacer
// el producto tendrá como keys: brand, title imagen y price
class Producto {
    constructor(brand, title, image, price, id, rating,) {
        this.marca = brand;
        this.titulo = title;
        this.imagen = image;
        this.precio = price;
        this.iden = id;
        this.rating = rating;
    }
}

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const grid = document.querySelector('.gridcontainer')
const fragment = document.createDocumentFragment();
let pedido;


document.body.addEventListener('click', (ev) => {
    if (ev.target.matches('.añadir')) {
        añadir(ev.target.id)
    }

    if (ev.target.matches('.eliminar')) {
        eliminarDePedido(ev.target.id)
    }

    if (ev.target.matches('.irTabla')) {
        mandarDatos();
    }

    if (ev.target.matches('.eliminar2')) {
        eliminarDeCompra(ev.target.id);
    }

    if (ev.target.matches('.eliminarTodo')) {
        vaciarCarrito();
    }

    if (ev.target.matches('.icono-carrito')) {
        cosi();
    }
})

const vaciarCarrito = () => {
    pedido = {};
    localStorage.clear();
    carrito = [];
    pintarCarritoPeq();

}

const mandarDatos = () => {
    let url = '';
    const pedido = obtenerPedido()
    for (let key in pedido) {
        url += pedido[key][0].iden + '=' + pedido[key][1] + '&'
    }
    location.href = `./compra.html?${url}`;

}

const consulta = async (id) => {
    let url;
    if (id) {
        url = `https://dummyjson.com/products/${id}`
    } else {
        url = 'https://dummyjson.com/products/'
    }
    try {
        let request = await fetch(url);

        if (request) {
            let peticion = await request.json()
            return peticion

        } else {
            throw ({
                ok: false,
                mensaje: 'fallo  en el servidor'
            })
        }

    } catch (error) {
        return error
    }
}

const añadir = async (id) => {
    const peticion = await consulta(id);
    const rating = redondearRating(peticion.rating)
    let producto = new Producto(peticion.brand, peticion.title, peticion.images[0], peticion.price, peticion.id, rating);
    console.log(carrito)
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito))
    pedido = obtenerPedido();
    console.log(pedido)
    pintarCarritoPeq()

}

const eliminarDeCarrito = (id) => {
    let contador = 1;
    carrito.forEach((item, ind) => {
        if (item.iden == id && contador <= 1) {
            carrito.splice(ind, 1)
            contador++
        }
    })
    localStorage.setItem('carrito', JSON.stringify(carrito))
    console.log(carrito)
}

const eliminarDePedido = (id) => {
    const pedido = obtenerPedido();
    console.log(id)
    for (let key in pedido) {
        console.log(pedido[key][0].iden)
        if (pedido[key][0].iden == id && pedido[key][1] == 1) {
            delete pedido[key]
        } else if (pedido[key][0].iden == id && pedido[key][1] != 1) {
            pedido[key][1]--;
        }
    }
    eliminarDeCarrito(id);
    pintarCarritoPeq();
    console.log(pedido)

}

const eliminarDeCompra = (id) => {

    for (let key in pedido) {
        console.log(pedido[key][0].id)
        if (pedido[key][0].id == id && pedido[key][1] == 1) {
            delete pedido[key]
        } else if (pedido[key][0].id == id && pedido[key][1] != 1) {
            pedido[key][1]--;
        }
    }
    pintarCarrito('arg')
}

const pintarTabla = () => {
    carritoContador = {

    }
    carrito.forEach((item) => {
        if (carritoContador.includes(item)) {
            carritocontador.item++;
        } else {
            carrito.item = item
        }
    })
    console.log(carritoContador)
}

const pintarIndex = async () => {
    const peticion = await consulta()
    console.log(peticion.products)

    peticion.products.forEach((item) => {
        const contProducto = document.createElement('DIV');
        const contImagen = document.createElement('DIV');
        const contStars = document.createElement('DIV');
        const divInfo = document.createElement('DIV');
        const divButton = document.createElement('DIV');
        const button = document.createElement('BUTTON')
        const img = document.createElement('IMG');
        contProducto.classList.add('contproducto');
        contStars.classList.add('estrellitas');
        contImagen.classList.add('contimagen');
        divButton.classList.add('button');
        divInfo.classList.add('button')
        button.classList.add('añadir');
        button.setAttribute('id', item.id)
        button.textContent = 'Añadir producto';
        divInfo.innerHTML = `<u>${item.title}</u><br><u>Precio:</u> ${item.price} €`
        img.setAttribute('src', item.images[0]);
        img.setAttribute('class', 'imagen');
        img.setAttribute('id', item.id);
        contImagen.append(img)
        contStars.append(pintarEstrellitas(item.rating))
        divButton.append(button)
        contProducto.append(contImagen, contStars, divButton, divInfo)
        fragment.append(contProducto)
    })
    grid.append(fragment);
}

const pintarEstrellitas = (rating) => {
    const fragment2 = document.createDocumentFragment();
    const rat = redondearRating(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= rat) {
            const divEst = document.createElement('DIV');
            const img = document.createElement('IMG');
            divEst.classList.add('estrellita');
            img.classList.add('imagenestrella')
            img.setAttribute('src', 'fotos/star1.png');
            divEst.append(img)
            fragment2.append(divEst)

        } else {
            const divEst = document.createElement('DIV');
            const img = document.createElement('IMG');
            divEst.classList.add('estrellita');
            img.classList.add('imagenestrella')
            img.setAttribute('src', 'fotos/star2.png');
            divEst.append(img)
            fragment2.append(divEst)
        }
    }
    return fragment2
}

const redondearRating = (rating) => {
    const numSet = rating.toString()
    const cifra = numSet.charAt(2)
    const cifraInt = parseInt(cifra)
    if (cifraInt > 5) {
        return Math.ceil(rating)
    } else {
        return Math.floor(rating)
    }
}

const obtenerPedido = () => {
    let Pedido = {};

    carrito.forEach((item) => {
        if (Object.keys(Pedido).includes(item.titulo)) {
            Pedido[item.titulo][1]++;
        }
        else {
            let arrayProducto = [item, 1];
            Pedido[item.titulo] = arrayProducto

        }
    })

    return Pedido
}

const pintarCarrito = async (arg) => {
    const vaciar = document.querySelector('#vaciar');
    const button = document.createElement('BUTTON')
    button.classList.add('eliminarTodo')
    button.textContent = 'Vaciar carrito'
    vaciar.innerHTML = '';
    vaciar.append(button)
    if (!arg) {
        console.log('entra por aqui')
        pedido = await obtenerPedidoUrl()
        const tabla = document.querySelector('#cuerpoTabla');
        const total = document.querySelector('#total')
        tabla.innerHTML = '';
        total.textContent = 'TOTAL: 0 €'
        console.log(pedido)

        for (let key in pedido) {
            const tr = document.createElement('TR');
            const button = document.createElement('BUTTON')
            const tdI = document.createElement('TD');
            const img = document.createElement('IMG');
            const tdN = document.createElement('TD');
            const tdP = document.createElement('TD');
            const tdC = document.createElement('TD');
            const tdS = document.createElement('TD');
            img.setAttribute('src', pedido[key][0].images[0]);
            img.setAttribute('class', 'imagentabla');
            button.textContent = 'eliminar';
            button.classList.add('eliminar2');
            button.setAttribute('id', pedido[key][0].id)
            tdN.textContent = pedido[key][0].title
            tdP.textContent = pedido[key][0].price + ' €'
            tdC.textContent = pedido[key][1];
            tdS.textContent = pedido[key][0].price * pedido[key][1] + ' €';
            tdC.append(button)
            tdI.append(img);
            tr.append(tdI, tdN, tdP, tdC, tdS);
            tabla.append(tr);
            total.textContent = 'TOTAL: ' + definirTotal(pedido) + ' €'
        }
    } else {
        const tabla = document.querySelector('#cuerpoTabla');
        const total = document.querySelector('#total')
        tabla.innerHTML = '';
        total.textContent = 'TOTAL: 0 €'
        console.log(pedido)

        for (let key in pedido) {
            const tr = document.createElement('TR');
            const button = document.createElement('BUTTON')
            const tdI = document.createElement('TD');
            const img = document.createElement('IMG');
            const tdN = document.createElement('TD');
            const tdP = document.createElement('TD');
            const tdC = document.createElement('TD');
            const tdS = document.createElement('TD');
            img.setAttribute('src', pedido[key][0].images[0]);
            img.setAttribute('class', 'imagentabla');
            button.textContent = 'eliminar';
            button.classList.add('eliminar2');
            button.setAttribute('id', pedido[key][0].id)
            tdN.textContent = pedido[key][0].title
            tdP.textContent = pedido[key][0].price + ' €'
            tdC.textContent = pedido[key][1];
            tdS.textContent = pedido[key][0].price * pedido[key][1] + ' €';
            tdC.append(button)
            tdI.append(img);
            tr.append(tdI, tdN, tdP, tdC, tdS);
            tabla.append(tr);
            total.textContent = 'TOTAL: ' + definirTotal(pedido) + ' €'
        }
    }
}

const definirTotal = (pedido) => {
    if (!pedido) {
        console.log('por aqui paso?')
        const pedido = obtenerPedido();
        console.log(pedido)
        let total = 0;
        for (let key in pedido) {
            if (pedido[key][1] == 1) {
                total += pedido[key][0].price
            } else {
                total += pedido[key][0].price * pedido[key][1]
            }
        }
        return total;

    } else if (pedido) {
        console.log('paso por aqui?')
        let total = 0;
        for (let key in pedido) {
            if (pedido[key][1] == 1) {
                console.log(pedido[key][1])
                total += pedido[key][0].price
            } else {
                console.log(pedido[key][1])
                total += pedido[key][0].price * pedido[key][1]
            }
        }
        return total;
    } else {
        console.log('??')

        let total = 0;
        for (let key in pedido) {
            if (pedido[key][1] == 1) {
                console.log(pedido[key][0])

                total += pedido[key][0].precio
            } else {
                console.log(pedido[key][0])

                total += pedido[key][0].precio * pedido[key][1]
            }
        }
    }
}

const obtenerPedidoUrl = async () => {
    const params = new URLSearchParams(window.location.search);
    let pedido = {}

    for (const [key, value] of params) {
        let peticion = await consulta(key)
        let arrayProducto = [peticion, value]
        pedido[peticion.title] = arrayProducto
    }
    return pedido
}

const cosi = () => {
    const carro = document.querySelector('.carro');
    carro.classList.toggle('hidden');
    pintarCarritoPeq();
}

const pintarCarritoPeq = () => {
    const pedido = obtenerPedido();
    const button = document.createElement('BUTTON');
    const tabla = document.querySelector('#cuerpoTabla');
    const total = document.querySelector('#total');
    const vaciar = document.querySelector('#vaciar');
    vaciar.innerHTML = '';
    button.classList.add('eliminarTodo')
    button.textContent = 'Vaciar carrito'
    tabla.innerHTML = '';
    total.textContent = 'TOTAL: 0 €';
    vaciar.append(button);

    for (let key in pedido) {
        const tr = document.createElement('TR');
        const button = document.createElement('BUTTON');
        const button2 = document.createElement('BUTTON')
        const tdI = document.createElement('TD');
        const img = document.createElement('IMG');
        const tdN = document.createElement('TD');
        const tdP = document.createElement('TD');
        const tdC = document.createElement('TD');
        const tdS = document.createElement('TD');
        img.setAttribute('src', pedido[key][0].imagen);
        img.setAttribute('class', 'imagentabla');
        button2.classList.add('añadir')
        button2.textContent = '+'
        button.textContent = '-';
        button.classList.add('eliminar');
        button.setAttribute('id', pedido[key][0].iden)
        button2.setAttribute('id', pedido[key][0].iden)
        tdN.textContent = pedido[key][0].titulo
        tdP.textContent = pedido[key][0].precio + ' €'
        tdC.textContent = pedido[key][1];
        tdS.textContent = pedido[key][0].precio * pedido[key][1] + ' €';
        tdC.append(button)
        tdC.append(button2)
        tdI.append(img);
        tr.append(tdI, tdN, tdP, tdC, tdS);
        tabla.append(tr);
        total.textContent = 'TOTAL: ' + definirTotal2(pedido) + ' €'
    }

}



const definirTotal2 = (pedido) => {
    let total = 0;
    for (let key in pedido) {
        if (pedido[key][1] == 1) {
            console.log(pedido[key][0])

            total += pedido[key][0].precio
        } else {
            console.log(pedido[key][0])

            total += pedido[key][0].precio * pedido[key][1]
        }
    }
    console.log(total)
    return total;
}

const init = async () => {

    if (!window.location.search) {
        pintarIndex();
    } else {
        pedido = await obtenerPedidoUrl()
        console.log(pedido)
        pintarCarrito();
    }
}
init();
