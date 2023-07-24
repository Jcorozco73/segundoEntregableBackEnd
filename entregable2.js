
const fs = require('fs');

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
  }

  async save(objeto) {
    try {
      const contenido = await this.getAllObjects();
      const nuevoId = contenido.length > 0 ? contenido[contenido.length - 1].id  : 0;
      const newId = nuevoId + 1
      const newObjeto = { id: newId, ...objeto }
      contenido.push(newObjeto);

      await this.saveObjects(objeto)
      return nuevoId;
    } catch (error) {
      console.error('Error al guardar el objeto:', error);
    }
  }

  async getById(id) {
    try {
      const contenido = await this.getAllObjects();
      const objeto = contenido.find((elemento) => elemento.id === id);
      return objeto || null;
    } catch (error) {
      console.error('Error al obtener el objeto por id:');
    }
  }

  async getAll() {
    try {
      const contenido = await this.getAllObjects();
      return contenido;
    } catch (error) {
      console.error('Error al obtener todos los objetos:');
      
    }
  }

  async deleteById(id) {
    try {
      const contenido = await this.getAllObjects();
      contenido = contenido.filter((elemento) => elemento.id !== id);
        await this.saveObjects(contenido)
    } catch (error) {
      console.error('Error al eliminar el objeto por id:');
    }
  }

  async deleteAll() {
    try {
      await this.saveObjects ([]);
    } catch (error) {
      console.error('Error al eliminar todos los objetos:', error);
    }
  }
  async getAllObjects() {
    try {
      const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
      return data ? JSON.parse(data) : []
    } catch(error) {
     return []
  
    }
  }

  async saveObjects(contenido) {
    try {
      await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(contenido, null, 2))
    }catch(error) {
      throw Error("No se pudo guardar en archivo")
    }
  }
}
 

// Ejemplo de uso
//const producto2 = { nombre: 'Producto 2', precio: 200 };

const main = async () => {
  const contenedor = new Contenedor('productos.txt');
  
  const producto1 = { id: 1, nombre: 'Producto 1', precio: 100 };

  const idProducto1 = await contenedor.save(producto1);
  
  console.log('Objeto guardado con id:',(idProducto1));

  //const idProducto2 = await contenedor.save(producto2);

  //console.log('Objeto guardado con id:',(idProducto2));

  //console.log(await contenedor.getById(idProducto2));

   //console.log(await contenedor.getAll());

  

 const allObjects = await contenedor.getAll()
  console.log('Objetos guardados', allObjects)

   await contenedor.deleteById(1)
  console.log('producto borrado')

  const obj = await contenedor.getById(1)
  console.log('objeto obtenido', obj) 

} 
main().catch((error) => console.error(error))
