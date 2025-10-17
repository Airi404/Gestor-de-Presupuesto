// Variables globales
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(nuevoPresupuesto) {
    if (isNaN(nuevoPresupuesto) || nuevoPresupuesto < 0) {
        return -1;
    }
    presupuesto = nuevoPresupuesto;
    return presupuesto;
}

// Función para mostrar el presupuesto actual
function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

// Clase para crear un gasto
class CrearGasto {
    constructor(descripcion, valor = 0, fecha = new Date(), ...etiquetas) {
        this.descripcion = typeof descripcion === 'string' ? descripcion : '';
        this.valor = typeof valor === 'number' && valor >= 0 ? valor : 0;
        const parsedFecha = new Date(fecha);
        this.fecha = !isNaN(parsedFecha) ? parsedFecha : new Date();
        this.etiquetas = Array.isArray(etiquetas) ? etiquetas : etiquetas.length ? etiquetas : [];
    }

    mostrarGasto() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    }

    mostrarGastoCompleto() {
        const fechaFormateada = this.fecha.toLocaleString();
        const etiquetasFormateadas = this.etiquetas.map(e => `- ${e}`).join('\n');
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaFormateada}\nEtiquetas:\n${etiquetasFormateadas}\n`;
    }

    actualizarDescripcion(nuevaDescripcion) {
        if (typeof nuevaDescripcion === 'string') {
            this.descripcion = nuevaDescripcion;
        }
    }

    actualizarValor(nuevoValor) {
        if (typeof nuevoValor === 'number' && nuevoValor >= 0) {
            this.valor = nuevoValor;
        }
    }

    actualizarFecha(nuevaFecha) {
        const parsed = new Date(nuevaFecha);
        if (!isNaN(parsed)) {
            this.fecha = parsed;
        }
        return this.fecha;
    }

    anyadirEtiquetas(...nuevasEtiquetas) {
        nuevasEtiquetas.forEach(etiqueta => {
            if (this.etiquetas.lenght <= 0){
                this.etiquetas = [];
            }
            if (!this.etiquetas.includes(etiqueta)) {
                this.etiquetas.push(etiqueta);
            }
        });
    }

    borrarEtiquetas(...etiquetasAEliminar) {
            this.etiquetas = this.etiquetas.filter(e => !etiquetasAEliminar.includes(e));
    }
}

// Función para listar todos los gastos
function listarGastos() {
    return [...gastos];
}

// Función para añadir un gasto
function anyadirGasto(gasto) {
    if (gasto instanceof CrearGasto) {
        gasto.id = idGasto++;
        gastos.push(gasto);
        return gasto;
    }
    return null;
}

// Función para borrar un gasto por ID
function borrarGasto(id) {
    const index = gastos.findIndex(gasto1 => gasto1.id === id);
    if (index !== -1) {
        gastos.splice(index, 1);
        return "El gasto ha sido borrado";
    }
    return "No se ha encontrado el gasto";
}

// Función para calcular el total de gastos
function calcularTotalGastos() {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

// Función para calcular el balance restante
function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

// Exportación de funciones
export {
    anyadirGasto,
    borrarGasto,
    listarGastos,
    calcularTotalGastos,
    calcularBalance,
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
}