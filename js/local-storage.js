// local-storage.js

// Función para leer del localStorage
//parse para que lo vuelva a un object
export function leer(clave) {
  //localStorage.getItem => trae la key del local-S.
  return JSON.parse(localStorage.getItem(clave));
}

// Función para escribir en el localStorage
//calve: strin
//valor: objeto
export function escribir(clave, valor) {
  //setItem => Guardar un valor en el local
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function limpiar(clave) {
  localStorage.removeItem(clave);
}

// Función para convertir de JSON string a objeto
export function jsonToObject(jsonString) {
  return JSON.parse(jsonString);
}

// Función para convertir de objeto a JSON string
export function objectToJson(objeto) {
  return JSON.stringify(objeto);
}