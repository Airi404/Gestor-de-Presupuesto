import {
  actualizarPresupuesto,
  CrearGasto,
  anyadirGasto,
  listarGastos,
  borrarGasto
} from './gestionPresupuesto.js';

document.getElementById("formulario-presupuesto").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    let presupuestoInput = document.getElementById("presupuesto").value;
    let resultado = actualizarPresupuesto(Number(presupuestoInput));

    if (resultado === -1) {
        alert("Inserte un presupuesto válido (número positivo).");
    }
    else {
        document.getElementById("valor-presupuesto").textContent = resultado;  

    }
});

document.getElementById("formulario-gasto").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    let descripcionInput = document.getElementById("descripcion").value;
    let valorInput = document.getElementById("valor").value;
    let valorInputnum = parseFloat(valorInput.replace(',', '.'));
    let fechaInput = document.getElementById("fecha").value;

    let etiquetasInput = document.getElementById("etiquetas").value.split(',').map(etiqueta => etiqueta.trim()).filter(etiqueta => etiqueta !== '');
    
    if (isNaN(valorInputnum) || valorInputnum < 0) {
        alert("Inserte un valor de gasto válido (número positivo).");
        return;
    }

    if (etiquetasInput.length === 0) {
        etiquetasInput = [];
        alert("No se han añadido etiquetas al gasto.");
    }

    let gasto = new CrearGasto(descripcionInput, Number(valorInputnum), fechaInput, etiquetasInput);
    anyadirGasto(gasto);

    document.getElementById("lista-gastos").style.display = "block"; // Muestra la sección de gastos

    renderizarGastos();
});

// Definición del Web Component para mostrar un gasto
class MiGasto extends HTMLElement  { 
    constructor() {
        super();
        const template = document.getElementById('plantilla-gasto').content.cloneNode(true);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template);
    }  
    //Establece los datos del gasto y renderiza el componente
    set data(gasto) {
        this.gasto = gasto;

        this.render();

        this.addEventListeners();
    }
    
    render() {
        const shadow = this.shadowRoot;

        shadow.querySelector('.gasto-descripcion').textContent = this.gasto.descripcion;
        shadow.querySelector('.gasto-valor').textContent = this.gasto.valor.toFixed(2);
        shadow.querySelector('.gasto-fecha').textContent = new Date(this.gasto.fecha).toLocaleDateString();
        shadow.querySelector('.gasto-etiquetas').textContent = this.gasto.etiquetas.join(', '); 
    }

    // Añade los event listeners para los botones de editar y borrar
    addEventListeners() {
        const shadow = this.shadowRoot;

        const botonBorrar = shadow.querySelector('.eliminar-gasto');
        const formeditarGasto = shadow.querySelector(".editar-form");
        const botonCancelar = shadow.querySelector(".cancelar-edicion");
        const botonEditar = shadow.querySelector('.editar-gasto');


        // Evento para borrar el gasto
        botonBorrar.addEventListener('click', () => {
            if (confirm("¿Seguro que deseas borrar este gasto?")) {
                borrarGasto(this.gasto.id);
                renderizarGastos();
            }
        });

        // Evento para mostrar/ocultar el formulario de edición
        botonEditar.addEventListener('click', () => {
            formeditarGasto.style.display = formeditarGasto.style.display === 'block' ? 'none' : 'block';
        });
        
        // Evento para cancelar la edición
        botonCancelar.addEventListener('click', () => {
            formeditarGasto.style.display = 'none';
        });

        // Evento para guardar los cambios de la edición
        formeditarGasto.onsubmit = (event) => {
            event.preventDefault();

            const nuevaDescripcion = shadow.querySelector(".editar-descripcion").value || this.gasto.descripcion;
            const nuevoValorInput = parseFloat(shadow.querySelector(".editar-valor").value) || this.gasto.valor;
            const nuevaFechaInput = shadow.querySelector(".editar-fecha").value || this.gasto.fecha;
            const nuevasEtiquetasInput = shadow.querySelector(".editar-etiquetas").value ? 
            shadow.querySelector(".editar-etiquetas").value.split(',').map(etiqueta => etiqueta.trim()).filter(etiqueta => etiqueta !== '') : this.gasto.etiquetas;
            
            // Actualiza los datos del gasto
            Object.assign(this.gasto, {
                descripcion: nuevaDescripcion,
                valor: nuevoValorInput,
                fecha: nuevaFechaInput,
                etiquetas: nuevasEtiquetasInput
            });

            renderizarGastos();

        };
    }

}
// Define el elemento personalizado
customElements.define('mi-gasto', MiGasto);

// Función para renderizar la lista de gastos en el contenedor
function renderizarGastos() {
    const gastosContainer = document.getElementById("gastos-container");
    gastosContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar

    const gastos = listarGastos();

    // Crea y añade un componente MiGasto para cada gasto
    gastos.forEach(gasto => {
        const gastoElemento = document.createElement('mi-gasto');
        gastoElemento.data = gasto;
        gastosContainer.appendChild(gastoElemento);
    });
}

