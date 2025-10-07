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

//CHATGPT
// Código que se ejecuta al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const formularioPresupuesto = document.getElementById('formulario-presupuesto');
    const inputPresupuesto = document.getElementById('presupuesto');
    const valorPresupuesto = document.getElementById('valor-presupuesto');

    const formularioGasto = document.getElementById('formulario-gasto');
    const inputDescripcion = document.getElementById('descripcion');
    const inputValor = document.getElementById('valor');
    const contenedorGastos = document.getElementById('gastos-container');

    // Manejar envío de presupuesto
    formularioPresupuesto.addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevoPresupuesto = parseFloat(inputPresupuesto.value);
        const resultado = actualizarPresupuesto(nuevoPresupuesto);

        if (resultado !== -1) {
            valorPresupuesto.textContent = resultado.toFixed(2);
            inputPresupuesto.value = '';
        } else {
            alert('Por favor, introduce un presupuesto válido y positivo.');
        }
    });

    // Manejar envío de gasto
    formularioGasto.addEventListener('submit', (e) => {
        e.preventDefault();

        const descripcion = inputDescripcion.value.trim();
        const valor = parseFloat(inputValor.value);

        if (descripcion && !isNaN(valor) && valor >= 0) {
            const gasto = new CrearGasto(descripcion, valor);
            mostrarGastoEnDOM(gasto);
            inputDescripcion.value = '';
            inputValor.value = '';
        } else {
            alert('Introduce una descripción y un valor válido para el gasto.');
        }
    });

    // Mostrar gasto en el DOM
    function mostrarGastoEnDOM(gasto) {
        const div = document.createElement('div');
        div.classList.add('gasto');

        div.innerHTML = `
            <div class="gasto-descripcion">${gasto.descripcion}</div>
            <div class="gasto-valor">${gasto.valor.toFixed(2)}</div>
        `;

        contenedorGastos.appendChild(div);
    }
});
