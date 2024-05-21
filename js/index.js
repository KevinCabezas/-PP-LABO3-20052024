import { Planeta } from "./planeta.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage-async.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const KEY_STORAGE = "planetas";
const items = []; // array vacio
const formulario = document.getElementById("form-item");
document.addEventListener("DOMContentLoaded", onInit); // importante no poner parentesis, es un callback

function onInit() {
  loadItems();
  
  eventoClickEliminarModificar();
  escuchandoFormulario();
  escuchandoBtnDeleteAll();
  botonBuscarObjetoLista();
  botonCancelarSecundario();
  botonCancelarPrincipal();
  // bucarObjetoClickFila();
}

async function loadItems() {
  // mostrarSpinner()
  let str = await leer(KEY_STORAGE);
  // ocultarSpinner()
  const objetos = jsonToObject(str) || [];

  objetos.forEach(obj => {
    const model = new Planeta(
      obj.id,
      obj.nombre,
      obj.tamanio,
      obj.masa,
      obj.tipo,
      obj.dimension,
      obj.vida,
      obj.anillo,
      obj.composicion,
    );

    items.push(model);
  });
  rellenarTabla();

}

/**
 * Quiero que obtenga el elemento del DOM table
 * luego quiero agregarle las filas que sean necesarias
 * se agregaran dependiendo de la cantidad de items que poseo
 */
function rellenarTabla() {
  const tabla = document.getElementById("table-items");
  let tbody = tabla.getElementsByTagName('tbody')[0];

  tbody.innerHTML = ''; // Me aseguro que esté vacio, hago referencia al agregar otro

  const celdas = ["id", "nombre", "tamanio", "masa", "tipo", "dimension", "vida", "anillo", "composicion"];

  items.forEach((item, indice) => {
    let nuevaFila = document.createElement("tr");
    nuevaFila.id = `row-${indice}`;
    celdas.forEach((celda) => {
      let nuevaCelda = document.createElement("td");
      nuevaCelda.textContent = item[celda];

      nuevaFila.appendChild(nuevaCelda);
    });
    // obtener el numero de fila donde se le hizo click
    nuevaFila.addEventListener('click', function () {
      bucarObjetoClickFila();
    });

    // Agregar la fila al tbody
    tbody.appendChild(nuevaFila);
  });
}


function escuchandoFormulario() {
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let vida = formulario.querySelector("#vida").value;
    if (vida) {
      vida = "tiene";
    } else {
      vida = "no tine";
    }
    
    let anillo = formulario.querySelector("#vida").value;
    if (anillo) {
      anillo = "tiene";
    } else {
      anillo = "no tine";
    }

    let id = asignarId();
    const model = new Planeta(
      id,
      formulario.querySelector("#nombre").value,
      formulario.querySelector("#tamanio").value,
      formulario.querySelector("#masa").value,
      formulario.querySelector("#tipo").value,
      formulario.querySelector("#dimension").value,
      anillo,
      vida,
      // formulario.querySelector("#vida").value,
      // formulario.querySelector("#anillo").value,
      formulario.querySelector("#composicion").value
    );
    
    const respuesta = model.verify();
    
    if (respuesta.success) {
      items.push(model);
      actualizarListaObjetos();
      actualizarFormulario();
    }
    else {
      alert(respuesta.rta);
    }
  });
}

//Manejo  de ID
function actulizarId() {
  items.forEach((ite, indice) => {
    ite.id = indice + 1;
    // actualizarListaObjetos();
  });
}

function asignarId() {
  let ultimoId;
  if (items.length === 0) {
    ultimoId = 1;
  } else {
    ultimoId = items.length + 1;
  }
  return ultimoId;
}

//Borra el texto del input
function actualizarFormulario() {
  formulario.reset();
  let input = document.getElementById('buscar');
  input.value = "";
}

async function escuchandoBtnDeleteAll() {
  const btn = document.getElementById("btn-delete-all");

  btn.addEventListener("click", (e) => {

    const rta = confirm('Desea eliminar todos los Items?');

    if (rta) {
      actualizarListaObjetos();
      items.splice(0, items.length);
      limpiar(KEY_STORAGE);
      loadItems();
    }
  });
}

function bucarObjetoClickFila() {
  let filas = document.getElementsByTagName('tr');
  let filaClick = 0;
  for (let i = 1; i < filas.length; i++) {
    filas[i].addEventListener('click', function (event) {
      visibilidadBotonesPrincipales("none")
      mostrarBotonesSecundarios();
      filaClick = this.id;
      let fila = filas[i];
      console.log(filaClick);
      let datos = [];
      for (let i = 0; i < fila.cells.length; i++) {
        datos.push(fila.cells[i].innerText);
      }
      console.log(datos);
      document.getElementById("buscar").value = datos[0];
      document.getElementById("nombre").value = datos[1];
      document.getElementById("tamanio").value = datos[2];
      document.getElementById("masa").value = datos[3];
      document.getElementById('tipo').selectElement.value = tipodatos[4];
      document.getElementById("dimension").value = datos[5];
      document.querySelector('label[for="vida"]').htmlFor = datos[6];
      document.querySelector('label[for="anillo"]').htmlFor = datos[7];
      document.getElementById("composicion").value = datos[8];
    });
  }
}

//Rellena el form para modificar o eliminar un objeto buscado
//por "ID"
function rellenarFormModificacion() {
  let match = buscarObjetoEnLista();
  let filas = document.getElementsByTagName('tr');
  let fila = filas[match]
  let datos = [];
  for (let i = 0; i < fila.cells.length; i++) {
    datos.push(fila.cells[i].innerText);
  }
  console.log(datos);
  document.getElementById("buscar").value = datos[0];
  // document.getElementById("titulo").value = datos[1];
  // document.getElementById(datos[2]).checked = true;
  // document.getElementById("descripcion").value = datos[3];
  // document.getElementById("precio").value = datos[4];
  // document.getElementById("puertas").value = datos[5];
  // document.getElementById("kms").value = datos[6];
  // document.getElementById("potencia").value = datos[7];

  document.getElementById("nombre").value = datos[1];
  document.getElementById("tamanio").value = datos[2];
  document.getElementById("masa").value = datos[3];
  document.getElementById('tipo').selectElement.value = tipodatos[4];
  document.getElementById("dimension").value = datos[5];
  document.querySelector('label[for="vida"]').htmlFor = datos[6];
  document.querySelector('label[for="anillo"]').htmlFor = datos[7];
  document.getElementById("composicion").value = datos[8];
}

//Modificar o eliminar despues de buscar el objeto de la lista
//por ID
function eventoClickEliminarModificar() {
  //Manejo de eliminar obj - btn eliminar
  document.getElementById("btn-eliminar").addEventListener("click", () => {
    const inputBuscar = document.getElementById("buscar");
    if (!inputBuscar.checkValidity()) {
        inputBuscar.reportValidity();
    } else {
        eliminarObjetoDeLista();
        esconderBotonesSecundarios();
        visibilidadBotonesPrincipales("flex");
      }
    
  });
  //Manejo de modificacion obj - btn modificar
  document.getElementById("btn-modificar").addEventListener("click", () => {
    const inputBuscar = document.getElementById("buscar");
    if (!inputBuscar.checkValidity()) {
        inputBuscar.reportValidity();
    } else {
        modificarObjeto();
        esconderBotonesSecundarios();
        visibilidadBotonesPrincipales("flex");

      }
    
  });
}


//busca al objeto segun  su id 
//id obtenido del form buscar
function buscarObjetoEnLista() {
  const id = document.querySelector("#buscar").value;
  console.log(id);
  let match = -1;
  items.forEach(ite => {
    if (ite.id == id) {
      console.log(ite.id);
      match = ite.id;
    }
  });
  return match;
}


//Busca el objeto de la lista para ser modificado o eliminado
function botonBuscarObjetoLista() {
  document.getElementById("btn-buscar").addEventListener("click", () => {
    const inputBuscar = document.getElementById("buscar");
    let match = buscarObjetoEnLista();
    if (!inputBuscar.checkValidity()) {
        inputBuscar.reportValidity();
    } else {
        if (match !== -1) {
          visibilidadBotonesPrincipales("none")
          mostrarBotonesSecundarios();
          rellenarFormModificacion();
        } 
        else {
          alert("Elemento no encontrado");
        }
        
      }
    
  });
}

//Una vez encontrado el obj este lo elimina
function eliminarObjetoDeLista() {
  let match = buscarObjetoEnLista();
  const rta = confirm('Desea eliminar ID: ' + match);
  if (rta) {
    console.log(match);
    if (items.length === 1) {
      items.splice(0, 1);
      limpiar(KEY_STORAGE);
    }
    items.splice(match-1, 1);
    console.log(match);
    actulizarId();
    actualizarListaObjetos();
  }
}


//Modifica los valores del objeto seleccionado con valores ingresados atrvez de input
//obtiene el id del  objeto atravez de "modificarObjeto()", para modificarlo
function modificarObjeto() {
  let match = buscarObjetoEnLista();
  let objeto = items.find(ite => ite.id === match);
  if (objeto) {
    objeto.titulo = document.querySelector("#nombre").value;
    objeto.titulo = document.querySelector("#tamanio").value;
    // objeto.titulo = document.querySelector("#venta").value;
    objeto.descripcion = document.querySelector("#masa").value;
    objeto.precio = document.querySelector("#tipo").value;
    objeto.puertas = document.querySelector("#dimension").value;
    objeto.kms = document.querySelector("#vida").value;
    objeto.potencia = document.querySelector("#anillo").value;
    objeto.potencia = document.querySelector("#composicion").value;
    actualizarListaObjetos();
  }
  else{
    console.log("no valor")
  }
}

//Actualiza la lista y lo vuelve a escribir en el local-storage
async function actualizarListaObjetos() {
  const str = objectToJson(items);
  mostrarSpinner();
  await escribir(KEY_STORAGE, str);
  ocultarSpinner();
  rellenarTabla();
}

function botonCancelarSecundario() {
  document.getElementById("btn-cancelar").addEventListener("click", () => {
    esconderBotonesSecundarios();
    visibilidadBotonesPrincipales("flex");
  });
}

//Esconde los botones de modificar eliminar y canselar
function esconderBotonesSecundarios() {
    const botonEliminar = document.getElementById('btn-eliminar');
    const botonModificar = document.getElementById('btn-modificar');
    const botonCancelar = document.getElementById('btn-cancelar');
    botonEliminar.style.display = 'none';
    botonModificar.style.display = 'none';
    botonCancelar.style.display = 'none';
    actualizarFormulario();
}

//muestra los botones de eliminar-modificar-cancelar
//se debe pasar a al evento click del btn de cancelar-modificar-celiminar
function mostrarBotonesSecundarios() {
  const botonEliminar = document.getElementById('btn-eliminar');
  const botonModificar = document.getElementById('btn-modificar');
  const botonCancelar = document.getElementById('btn-cancelar');
  botonEliminar.style.display = 'flex';
  botonModificar.style.display = 'flex';
  botonCancelar.style.display = 'flex';
}

//segun el paramertro flex o none esta funcion 
//muestra o seconde los botones guardar-cancelar
function visibilidadBotonesPrincipales(style) {
  const botonGuardar = document.getElementById('buton-guardar');
  const botonCancelar = document.getElementById('buton-cancelar');
  botonGuardar.style.display = style;
  botonCancelar.style.display = style;

}

//limpia el texto del form al cancelar
function botonCancelarPrincipal() {
  document.getElementById("buton-cancelar").addEventListener("click", () => {
    actualizarFormulario();
  });
}
