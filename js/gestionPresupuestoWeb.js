import {
  actualizarPresupuesto,
  mostrarPresupuesto,
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
    addEventListeners() {
        const shadow = this.shadowRoot;

        const botonBorrar = shadow.querySelector('.eliminar-gasto');
        const formeditarGasto = shadow.querySelector(".editar-form");
        const botonCancelar = shadow.querySelector(".cancelar-edicion");

        botonBorrar.addEventListener('click', () => {
            if (confirm("¿Seguro que deseas borrar este gasto?")) {
                borrarGasto(this.gasto.id);
                renderizarGastos();
            }
        });

        const botonEditar = shadow.querySelector('.editar-gasto');

        botonEditar.addEventListener('click', () => {
            formeditarGasto.style.display = formeditarGasto.style.display === 'block' ? 'none' : 'block';
        });
        botonCancelar.addEventListener('click', () => {
            formeditarGasto.style.display = 'none';

        });
        formeditarGasto.onsubmit = (event) => {
            event.preventDefault();
            const nuevaDescripcion = shadow.querySelector(".editar-descripcion").value || this.gasto.descripcion;
            const nuevoValorInput = parseFloat(shadow.querySelector(".editar-valor").value) || this.gasto.valor;
            const nuevaFechaInput = shadow.querySelector(".editar-fecha").value || this.gasto.fecha;
            const nuevasEtiquetasInput = shadow.querySelector(".editar-etiquetas").value ? 
            shadow.querySelector(".editar-etiquetas").value.split(',').map(etiqueta => etiqueta.trim()).filter(etiqueta => etiqueta !== '') : this.gasto.etiquetas;

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
customElements.define('mi-gasto', MiGasto);

function renderizarGastos() {
    const gastosContainer = document.getElementById("gastos-container");
    gastosContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar
    const gastos = listarGastos();
    gastos.forEach(gasto => {
        const gastoElemento = document.createElement('mi-gasto');
        gastoElemento.data = gasto;
        gastosContainer.appendChild(gastoElemento);
    });
}

