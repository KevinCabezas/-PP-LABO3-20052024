import { Planeta } from "./planeta.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage-async.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const KEY_STORAGE = "planetas";
const items = [];
let idObjeto = 0;

const formulario = document.getElementById("form-item");

const nombre = formulario.querySelector("#nombre");
const tamanio = formulario.querySelector("#tamanio");
const masa = formulario.querySelector("#masa");
const tipo = formulario.querySelector("#tipo");
const distancia = formulario.querySelector("#distancia");
const vida = formulario.querySelector("#vida");
const anillo = formulario.querySelector("#anillo");
const composicion = formulario.querySelector("#composicion");

document.addEventListener("DOMContentLoaded", onInit); 

function onInit() {
  loadItems();
  
  escuchandoFormulario();
  escuchandoBtnDeleteAll();
  botonCancelarPrincipal();
  botonModificar();
  botonEliminar();
}

async function loadItems() {
  let str = await leer(KEY_STORAGE);
  const objetos = jsonToObject(str) || [];

  objetos.forEach(obj => {
    const model = new Planeta(
      obj.id,
      obj.nombre,
      obj.tamanio,
      obj.masa,
      obj.tipo,
      obj.distancia,
      obj.vida,
      obj.anillo,
      obj.composicion,
    );

    items.push(model);
  });
  rellenarTabla();

}


function rellenarTabla() {
  const tabla = document.getElementById("table-items");
  let tbody = tabla.getElementsByTagName('tbody')[0];

  tbody.innerHTML = '';

  const celdas = ["id", "nombre", "tamanio", "masa", "tipo", "distancia", "vida", "anillo", "composicion"];

  items.forEach((item, indice) => {
    let nuevaFila = document.createElement("tr");
    nuevaFila.id = `row-${indice}`;
    celdas.forEach((celda) => {
      let nuevaCelda = document.createElement("td");
      nuevaCelda.textContent = item[celda];

      nuevaFila.appendChild(nuevaCelda);
    });
   
    tbody.appendChild(nuevaFila);

  });

  tbody.addEventListener('click', function (event) {
    const fila = event.target.closest('tr');
    if (fila) {
      bucarObjetoClickFila(fila);
    }
  });
}


function escuchandoFormulario() {
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let vidaCheck = vida.checked ? "tiene" : "no tiene";
    let anilloCheck = anillo.checked ? "tiene" : "no tiene";

    let id = asignarId();
    const model = new Planeta(
      id,
      nombre.value,
      tamanio.value,
      masa.value,
      tipo.value,
      distancia.value,
      vidaCheck,
      anilloCheck,
      composicion.value
    );
    
    const respuesta = model.verify();
    
    if (respuesta.success) {
      items.push(model);
      actualizarListaObjetos();
      actualizarFormulario();
    }
    else {
      alert(respuesta.rta);
      if (respuesta.campo === 'distancia') {
        distancia.value = '';
      } else if (respuesta.campo === 'tamanio') {
        tamanio.value = '';
      }
    }
  });
}

function actulizarId() {
  items.forEach((ite, indice) => {
    ite.id = indice + 1;
  });
}

function asignarId() {
  let ultimoId;
  if (items.length === 0) {
    ultimoId = 1;
  } else {
    ultimoId = items.length + 1;
  }
  return "00" + ultimoId;
}

function actualizarFormulario() {
  formulario.reset();
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
    else {
      alert("yes")

    }
  });
}

function bucarObjetoClickFila(fila) {

  const datos = Array.from(fila.cells).map(cell => cell.innerText);
  nombre.value = datos[1];
  tamanio.value = datos[2];
  masa.value = datos[3];
  tipo.value = datos[4];
  distancia.value = datos[5];
  vida.checked = datos[6] === "tiene";
  anillo.checked = datos[7] === "tiene";
  composicion.value = datos[8];
  idObjeto = datos[0];
  mostrarEditar('flex');
  mostrarBotonesForm('none');
}


function eliminarObjetoDeLista() {
  let objeto = items.find(ite => ite.id == idObjeto);
  
  if (objeto) {
    const rta = confirm('Sea eliminar el elemento: ' + idObjeto);
    if (rta) {
      mostrarBotonesForm('flex');
      if (items.length === 1) {
        items.splice(0, 1);
        limpiar(KEY_STORAGE);
      }
      items.splice(idObjeto-1, 1);
      actulizarId();
      actualizarListaObjetos();
    }
    else {
      mostrarBotonesForm('flex');
    }
  }
  else {
    alert("Haga click sobre la fila deseada")
  }
}


function modificarObjeto() {
  let objeto = items.find(ite => ite.id == idObjeto);
  
  if (!objeto) {
    alert("Haga click sobre la fila deseada");
    return;
  }

  if (!validarCamposVacios()) {
    alert("no se puede modificar con campos vacios");
    return;
  }

  if (!confirm('Se modificara el elemento: ' + idObjeto)) {
    actualizarFormulario();
    inicializarIdSeleccionado();

    return;
  }
  
  let vidaCheck = vida.checked ? "tiene" : "no tiene";
  let anilloCheck = anillo.checked ? "tiene" : "no tiene";
  
  actualizarObjeto(objeto, vidaCheck, anilloCheck);
  actualizarListaObjetos();
  actualizarFormulario();
  inicializarIdSeleccionado();
  mostrarBotonesForm('flex');
}

function actualizarObjeto(objeto, vidaCheck, anilloCheck) {
  objeto.nombre = nombre.value;
  objeto.tamanio = tamanio.value;
  objeto.masa = masa.value;
  objeto.tipo = tipo.value;
  objeto.distancia = distancia.value;
  objeto.vida = vidaCheck;
  objeto.anillo = anilloCheck;
  objeto.composicion = composicion.value;
}


function validarCamposVacios() {
  if(!nombre.value || !tamanio.value || !masa.value || !distancia.value || !composicion.value) {
    return false;
  }
  else {
    return true;
  }
}

async function actualizarListaObjetos() {
  const str = objectToJson(items);
  mostrarSpinner();
  await escribir(KEY_STORAGE, str);
  ocultarSpinner();
  rellenarTabla();
  mostrarBotonesForm('flex');
  mostrarEditar('none');
}

function botonCancelarPrincipal() {
  const btn = document.getElementById("buton-cancel");
  btn.addEventListener("click", () => {
    actualizarFormulario();
  });
}

function botonModificar() {
  const btn = document.getElementById("btn-modificar");
  btn.addEventListener("click", () => {
    modificarObjeto();
  });

}

function botonEliminar() {
  const btn = document.getElementById("btn-eliminar");
  btn.addEventListener("click", () => {
    eliminarObjetoDeLista();
    actualizarFormulario();
    inicializarIdSeleccionado();
  });

}

function mostrarEditar(style) {
  const editar = document.getElementById('editar');
  editar.style.display = style;
}

function inicializarIdSeleccionado() {
  idObjeto = 0;
  mostrarBotonesForm('flex');

}

function mostrarBotonesForm(style) {
  const btn = document.getElementById('btn-principal');
  btn.style.display = style;
}