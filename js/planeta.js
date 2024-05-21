class Planeta {
  constructor(id, nombre, tamanio, masa,tipo, dimension, vida, anillo, composicion) {
    this.id = id;
    this.nombre = nombre;
    this.tamanio = tamanio;
    this.masa = masa;
    this.tipo = tipo;
    this.dimension =  dimension;
    this.vida = vida;
    this.anillo = anillo;
    this.composicion = composicion;
  }

  verify() {
    return this.checkTitulo();
  }

  checkTitulo() {
    return { success: true, rta: null };
  }
}

export { Planeta };