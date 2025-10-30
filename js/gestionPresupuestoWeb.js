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
function renderizarGastos() {
    const listaGastos = document.getElementById("lista-gastos");
    listaGastos.innerHTML = ""; // Limpia la lista antes de renderizar

    const gastos = listarGastos();
    gastos.forEach((gasto, index) => {
    const div = document.createElement("div");
    
    const fechaFormateada = new Date(gasto.fecha).toLocaleDateString();
    div.innerHTML = `<p>Descripción: ${gasto.descripcion} - Valor: ${gasto.valor.toFixed(2)} - Fecha: ${fechaFormateada} - Etiquetas: ${gasto.etiquetas.join(', ')}</p>
    <button data-id="${gasto.id}">Borrar</button>`;

    div.querySelector("button").addEventListener("click", () => {
    if (confirm("¿Seguro que deseas borrar este gasto?")) {
    borrarGasto(gasto.id);
    renderizarGastos();
            }
        });

    listaGastos.appendChild(div);

    });
}

