// Declaro los dos arrays con los que voy a trabajar
let movimientosPortfolio
let resumenPortfolio

// Creo variables para vincular al DOM
let formCripto = document.getElementById("formCripto")
let botonPortfolio = document.getElementById("botonPortfolio")
let divCripto = document.getElementById("divCripto")
let modalContainer = document.getElementById("modalContainer")
let capPortfolio = document.getElementById("capPortfolio")

// Defino la API de donde voy a tomar datos
let monedasURL = `https://api.coingecko.com/api/v3/coins/list?include_platform=false`

// ---------- Funciones

const guardarMovimientos = () => {localStorage.setItem("Movimientos", JSON.stringify(movimientosPortfolio))}
const guardarResumen = () => {localStorage.setItem("Resumen", JSON.stringify(resumenPortfolio))}
const tomarMovimientos = () => movimientosPortfolio = JSON.parse(localStorage.getItem("Movimientos"))
const tomarResumen = () => resumenPortfolio = JSON.parse(localStorage.getItem("Resumen"))

function agregarSiglas(elemento) {
    let optionSiglas = document.createElement('option')
    optionSiglas.setAttribute("value", `${elemento}`)
    document.getElementById("datalistSiglas").append(optionSiglas)
}
function agregarNombre(elemento) {
    let optionNombre = document.createElement('option')
    optionNombre.setAttribute("value", `${elemento}`)
    document.getElementById("datalistNombre").append(optionNombre)
}
function actualizarCapitalizacion(array) {
    let capTotal = (array.reduce((acumulador, elemento) => acumulador + elemento.capitalizacion, 0)).toFixed(2)
    capPortfolio.innerText = `CAPITALIZACIÓN TOTAL = USD ${capTotal}`
}
function mostrarTabla() {
    divCripto.innerHTML = `
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Siglas</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio actual</th>
                    <th scope="col">Capitalización</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaBody">
            </tbody>
        </table>
        `
}
function sumarATabla(array, indice) {
    var tablaBody = document.getElementById("tablaBody")

    tablaBody.innerHTML += `
    <tr class="trResumen" id="fila${indice}">
        <th class="botonNesting${indice} align-middle" scope="row">${array.siglas}</th>
        <td class="botonNesting${indice} align-middle">${array.nombre}</td>
        <td class="botonNesting${indice} align-middle" id="cantidad${indice}">${array.cantidad} ${array.siglas}</td>
        <td class="botonNesting${indice} align-middle" id="precio${indice}"> USD ${array.precio}</td>
        <td class="botonNesting${indice} align-middle" id="capitalizacion${indice}"> USD ${(array.capitalizacion).toFixed(2)}</td>
        <td>
            <button type="button" class="btn btn-success" id="botonCompra${array.siglas}" data-bs-toggle="modal" data-bs-target="#modalCompra${indice}">Cargar compra</button>
            <button type="button" class="btn btn-danger" id="botonVenta${array.siglas}" data-bs-toggle="modal" data-bs-target="#modalVenta${indice}">Cargar venta</button>
            <button type="button" class="btn btn-secondary" id="botonEliminar${indice}">Eliminar</button>
        </td>
    </tr>
    `
}
function crearModales(indice) {
    modalContainer.innerHTML += `
        <div class="modal fade" id="modalCompra${indice}" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalCompraLabel">Compra</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCompra${indice}">
                            <div class="form-group">
                                <label for="cantidadCompra">Cantidad</label>
                                <input type="number" min="0" class="form-control" id="cantidadCompra${indice}" placeholder="Cantidad" step="any" required>
                            </div>
                            <div class="form-group">
                                <label for="precioCompra">Precio</label>
                                <input type="number" min="0" class="form-control" id="precioCompra${indice}" placeholder="Precio" step="any" required>
                            </div>
                            <div class="form-group">
                                <label for="fecha">Fecha</label>
                                <input type="date" class="form-control" id="fechaCompra${indice}">
                            </div>
                            <br>
                            <button type="submit" class="btn btn-primary" id="botonSubmitCompra">Cargar compra</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalVenta${indice}" tabindex="-1" aria-labelledby="modalVentaLabel" aria-hidden="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalVentaLabel">Venta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formVenta${indice}">
                            <div class="form-group">
                                <label for="cantidadVenta">Cantidad</label>
                                <input type="number" min="0" class="form-control" id="cantidadVenta${indice}" placeholder="Cantidad" step="any" required>
                            </div>
                            <div class="form-group">
                                <label for="precioVenta">Precio</label>
                                <input type="number" min="0" class="form-control" id="precioVenta${indice}" placeholder="Precio" step="any" required>
                            </div>
                            <div class="form-group">
                                <label for="fecha">Fecha</label>
                                <input type="date" class="form-control" id="fechaVenta${indice}">
                            </div>
                            <br>
                            <button type="submit" class="btn btn-primary" id="botonSubmitVenta">Cargar venta</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
}
function agregarTablaNesting(array, elemento, indice) {
    let gastoTotal = array.reduce((acumulador, elemento) => acumulador + (elemento.precio * elemento.cantidad), 0)
    let precioPromedio = (gastoTotal / elemento.cantidad).toFixed(8)
    let retornoTotalUSD = ((elemento.cantidad * elemento.precio) - gastoTotal).toFixed(2)
    let retornoTotal = ((retornoTotalUSD / gastoTotal) * 100).toFixed(2)
    $(` <tr class="collapsed" id="nesting${indice}">
            <td colspan="4">
                <table class="table">
                    <thead>
                        <tr>
                            <td scope="col">Fecha</th>
                            <td scope="col">Operación</th>
                            <td scope="col">Cantidad</th>
                            <td scope="col">Precio</th>
                            <td scope="col">Retorno</th>
                            <td scope="col">Retorno USD</th>
                        </tr>
                    </thead>
                    <tbody id="tbody${indice}">
                    </tbody>
                </table>
            </td>
        </tr>
        <tr class="collapsed" id="resumen${indice}">
            <td colspan="4">
                <table class="table table-secondary">
                    <tbody>
                        <tr>
                            <th class="align-middle" id="precioPromedio${indice}" scope="row"><u>PRECIO PROMEDIO DE COMPRA:</u><br> USD ${precioPromedio}</th>
                            <th class="align-middle" id="retornoTotal${indice}" scope="row"><u>RETORNO TOTAL:</u><br> ${retornoTotal} % </th>
                            <th class="align-middle" id="retornoTotalUSD${indice}" scope="row"><u>RETORNO TOTAL:</u><br> USD ${retornoTotalUSD}</th>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    `).insertAfter(`#fila${indice}`)
}
function nestearMovimiento(elemento, indice) {
    let color
    if (elemento.retorno > 0) {
        color = "success"
    }
    else if (elemento.retorno < 0) {
        color = "danger"
    }
    else {
        color = "secondary"
    }
    $(`#tbody${indice}`).append(`
        <tr>
            <td scope="row">${elemento.fecha}</th>
            <td scope="row">${elemento.operacion}</th>
            <td scope="row">${elemento.cantidad} ${elemento.siglas}</th>
            <td scope="row">${elemento.precio} USD</th>
            <td class="text-${color}" scope="row">${elemento.retorno} %</th>
            <td class="text-${color}" scope="row">${elemento.retornoUSD} USD</th>
        </tr>
    `)
}
function actualizarResumen(array, indice) {
    $(`#cantidad${indice}`).text(`${array.cantidad} ${array.siglas}`)
    $(`#precio${indice}`).text(` USD ${array.precio}`)
    $(`#capitalizacion${indice}`).text(` USD ${(array.capitalizacion).toFixed(2)}`)
}
function calcularRetorno (elemento, precioActual) {
    if (elemento.operacion === "compra") {
        elemento.retorno = (((precioActual / elemento.precio) - 1) * 100).toFixed(2)
        elemento.retornoUSD = (((elemento.retorno / 100) * elemento.precio) * elemento.cantidad).toFixed(2)
    }
    else {
        elemento.retorno = ((1 - (precioActual / elemento.precio)) * 100).toFixed(2)
        elemento.retornoUSD = (((elemento.retorno / 100) * elemento.precio) * (-elemento.cantidad)).toFixed(2)
    }
    
}
function actualizarNestingResumen (array, elemento, indice) {
    let gastoTotal = array.reduce((acumulador, elemento) => acumulador + (elemento.precio * elemento.cantidad), 0)
    let precioPromedio = (gastoTotal / elemento.cantidad).toFixed(8)
    let retornoTotalUSD = ((elemento.cantidad * elemento.precio) - gastoTotal).toFixed(2)
    let retornoTotal = ((retornoTotalUSD / gastoTotal) * 100).toFixed(2)
    
    $(`#precioPromedio${indice}`).text(`PRECIO PROMEDIO DE COMPRA: ${precioPromedio}`)
    $(`#retornoTotal${indice}`).text(`RETORNO TOTAL: ${retornoTotal} %`)
    $(`#retornoTotalUSD${indice}`).text(`RETORNO TOTAL: USD ${retornoTotalUSD}`)
}

// Clases
class Movimiento {
    constructor (siglas, nombre, operacion, cantidad, precio, fecha, retorno, retornoUSD) {
        this.siglas = siglas
        this.nombre = nombre
        this.operacion = operacion
        this.cantidad = cantidad
        this.precio = precio
        this.fecha = fecha
        this.retorno = retorno
        this.retornoUSD = retornoUSD
    }
}

class Resumen {
    constructor (siglas, nombre, cantidad, precio, capitalizacion) {
        this.siglas = siglas
        this.nombre = nombre
        this.cantidad = cantidad
        this.precio = precio
        this.capitalizacion = capitalizacion
    }
}



// --------- Script

if (localStorage.getItem("Movimientos") && localStorage.getItem("Resumen")) {
    tomarMovimientos()
    tomarResumen()
} else {
    movimientosPortfolio = []
    resumenPortfolio = []
}

// Agrego lista de siglas y nombres desde API como opciones al formulario 
$.ajax({
    method: "GET",
    url: monedasURL,
    data: "json",
    success: function(data) {
        data.forEach(moneda => {
            agregarSiglas(moneda.symbol)
            agregarNombre(moneda.name)
        })

        // Agrego la lista de monedas al localstorage para luego tomarla de ahí y poder usarla como array por fuera del AJAX
        localStorage.setItem("ListaMonedas", JSON.stringify(data))
    }
})

// Sumo la información del formulario a ambos array
formCripto.addEventListener("submit", (e) => {
    e.preventDefault()

    let siglasMovimiento = document.getElementById("siglas").value
    let nombreMovimiento = document.getElementById("nombre").value
    let cantidadMovimiento =  parseFloat(document.getElementById("cantidad").value)
    let precioMovimiento =  parseFloat(document.getElementById("precio").value)
    let fechaMovimiento = document.getElementById("fecha").value

    movimientosPortfolio.push(new Movimiento(siglasMovimiento, nombreMovimiento, `compra`, cantidadMovimiento, precioMovimiento, fechaMovimiento))
    guardarMovimientos()
    formCripto.reset()

    resumenPortfolio.push(new Resumen(siglasMovimiento, nombreMovimiento, cantidadMovimiento))
    guardarResumen()
})

// Muestro la información del portfolio al hacer click en botonPortfolio
botonPortfolio.addEventListener("click", () => {
    mostrarTabla()
    // Defino variable con la información de las monedas tomada de la API
    const listaMonedas = JSON.parse(localStorage.getItem("ListaMonedas"))

    resumenPortfolio.forEach((cripto, indice) => {
        // Obtengo la información de API de las monedas en mi portfolio
        let infoAPIcripto = listaMonedas.filter(elemento => elemento.name === cripto.nombre)

        // Busco el precio en tiempo real
        $.ajax({
            method: "GET",
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${infoAPIcripto[0].id}&vs_currencies=usd`,
            data: "json",
            async: false,
            success: function(data) {
                let dataArray = Object.entries(data)
                localStorage.setItem(`precio${infoAPIcripto[0].symbol}`, JSON.stringify(dataArray))
                // Defino el precio y la capitalización de la moneda
                cripto.precio = (JSON.parse(localStorage.getItem(`precio${infoAPIcripto[0].symbol}`)))[0][1].usd
                cripto.capitalizacion = cripto.cantidad * cripto.precio
        
                sumarATabla(cripto, indice)
                crearModales(indice)
                // Filtro los movimientos de dicha moneda para agregarlos a la tabla nesteada
                let movimientosFiltrados = movimientosPortfolio.filter(elemento => elemento.nombre === cripto.nombre)
                agregarTablaNesting(movimientosFiltrados, cripto, indice)
                movimientosFiltrados.forEach((movimiento) => {
                    calcularRetorno(movimiento, cripto.precio)
                    nestearMovimiento(movimiento, indice)
                })
                actualizarCapitalizacion(resumenPortfolio)
            }
        })
    })

    //Boton Eliminar
    resumenPortfolio.forEach((cripto, indice) => {
        $(`#botonEliminar${indice}`).click(() => {
            $(`#nesting${indice}`).slideUp("slow")
            $(`#resumen${indice}`).slideUp("slow")
            $(`#fila${indice}`).fadeOut("slow")
            resumenPortfolio = resumenPortfolio.filter(elemento => elemento.nombre != cripto.nombre)
            guardarResumen()
            movimientosPortfolio = movimientosPortfolio.filter(elemento => elemento.nombre != cripto.nombre)
            guardarMovimientos()
            localStorage.removeItem(`precio${cripto.siglas}`)
            actualizarCapitalizacion(resumenPortfolio)
        })
    })
    //Boton compra
    resumenPortfolio.forEach((cripto, indice) => {
        document.getElementById(`formCompra${indice}`).addEventListener("submit", (e) => {
            e.preventDefault()

            let cantidadCompra = parseFloat(document.getElementById(`cantidadCompra${indice}`).value)
            let precioCompra = parseFloat(document.getElementById(`precioCompra${indice}`).value)
            let fechaCompra = document.getElementById(`fechaCompra${indice}`).value

            // Tomo los datos del modal y los sumo al array de movimiento
            movimientosPortfolio.push(new Movimiento(cripto.siglas, cripto.nombre, "compra", cantidadCompra, precioCompra, fechaCompra))
            guardarMovimientos()
            document.getElementById(`formCompra${indice}`).reset()
            $(`#modalCompra${indice}`).modal("toggle")

            //Defino las nuevas propiedades de la moneda para poder actualizar el resumen con los nuevos datos
            cripto.cantidad = cripto.cantidad + cantidadCompra
            let infoAPIcripto = listaMonedas.filter(elemento => elemento.name === cripto.nombre)
            cripto.precio = (JSON.parse(localStorage.getItem(`precio${infoAPIcripto[0].symbol}`)))[0][1].usd
            cripto.capitalizacion = cripto.cantidad * cripto.precio

            guardarResumen()
            actualizarResumen(cripto, indice)
            let ultimoMovimiento = movimientosPortfolio.at(-1)
            calcularRetorno(ultimoMovimiento, cripto.precio)
            nestearMovimiento(ultimoMovimiento, indice)

            let movimientosFiltrados = movimientosPortfolio.filter(elemento => elemento.nombre === cripto.nombre)
            actualizarNestingResumen(movimientosFiltrados, cripto, indice)
            actualizarCapitalizacion(resumenPortfolio)
        })
    })
    //Boton venta
    resumenPortfolio.forEach((cripto, indice) => {
        document.getElementById(`formVenta${indice}`).addEventListener("submit", (e) => {
            e.preventDefault()

            let cantidadVenta = parseFloat(document.getElementById(`cantidadVenta${indice}`).value)
            let precioVenta = parseFloat(document.getElementById(`precioVenta${indice}`).value)
            let fechaVenta = document.getElementById(`fechaVenta${indice}`).value
            
            // Chequeo que la venta no me deje la cantidad total de la moneda en negativo
            cripto.cantidad = cripto.cantidad - cantidadVenta
            if (cripto.cantidad < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Su tenencia en criptomonedas no puede ser negativa!',
                    footer: 'Por favor revise sus operaciones y vuelva a probar'
                })
                document.getElementById(`formVenta${indice}`).reset()
                cripto.cantidad  = cripto.cantidad + cantidadVenta
                guardarMovimientos()
                guardarResumen()

            }
            else {
                // Tomo los datos del modal y los sumo al array de movimiento
                movimientosPortfolio.push(new Movimiento(cripto.siglas, cripto.nombre, "venta", -cantidadVenta, precioVenta, fechaVenta))
                guardarMovimientos()
                document.getElementById(`formVenta${indice}`).reset()
                $(`#modalVenta${indice}`).modal("toggle")

                //Defino las nuevas propiedades de la moneda para poder actualizar el resumen con los nuevos datos
                let infoAPIcripto = listaMonedas.filter(elemento => elemento.name === cripto.nombre)
                cripto.precio = (JSON.parse(localStorage.getItem(`precio${infoAPIcripto[0].symbol}`)))[0][1].usd
                cripto.capitalizacion = cripto.cantidad * cripto.precio

                guardarResumen()
                actualizarResumen(cripto, indice)
                let ultimoMovimiento = movimientosPortfolio.at(-1)
                calcularRetorno(ultimoMovimiento, cripto.precio)
                nestearMovimiento(ultimoMovimiento, indice)

                let movimientosFiltrados = movimientosPortfolio.filter(elemento => elemento.nombre === cripto.nombre)
                actualizarNestingResumen(movimientosFiltrados, cripto, indice)
                actualizarCapitalizacion(resumenPortfolio)
            }
        })
    })
    // Display tabla nesteada
    resumenPortfolio.forEach((sigla, indice) => {
        $(`.botonNesting${indice}`).click(() => {
            $(`#nesting${indice}`).slideToggle("slow")
            $(`#resumen${indice}`).slideToggle("slow")
        })
    })
})
