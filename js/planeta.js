import { PlanetaBase } from './planetaBase.js';

class Planeta extends PlanetaBase {
  constructor(id, nombre, tamanio, masa,tipo, distancia, vida, anillo, composicion) {
    super(id, nombre, tamanio, masa, tipo);
    this.tipo = tipo;
    this.distancia =  distancia;
    this.vida = vida;
    this.anillo = anillo;
    this.composicion = composicion;
  }

  verify() {

    const tamanioCheck = this.checkTamanio();
    if (!tamanioCheck.success) {
      return tamanioCheck;
    }

    const distanciaCheck = this.checkDistancia();
    if (!distanciaCheck.success) {
      return distanciaCheck;
    }
    return { success: true, rta: null };
  }

  checkTitulo() {
    return { success: true, rta: null };
  }

  checkTamanio() {
    if (this.tamanio < 0) {
      return { success: false, rta: 'ingrese numeros mayor a cero tamaño', campo: 'tamanio'};
    }
    else {
      return { success: true, rta: null};
    }
  }

  checkDistancia() {
    if (this.distancia < 0) {
      return { success: false, rta: 'ingrese numeros mayor a cero distancia', campo: 'distancia'};
    }
    else {
      return { success: true, rta: null};
    }
  }
}

export { Planeta };