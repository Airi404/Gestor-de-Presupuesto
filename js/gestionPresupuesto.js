let presupuesto = 0;

function actualizarPresupuesto(nuevoPresupuesto) {
    if (isNaN(nuevoPresupuesto)) {
        return -1;
    }
    if (nuevoPresupuesto < 0) {
        return -1;
    }

    presupuesto = nuevoPresupuesto;
    return presupuesto;
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

class CrearGasto {
    constructor(descripcion, valor) {
        this.descripcion = typeof descripcion === 'string' ? descripcion : '';
        this.valor = typeof valor === 'number' && valor >= 0 ? valor : 0;
    }

    mostrarGasto() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
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
}


// Exportación de funciones
export {
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto
};
