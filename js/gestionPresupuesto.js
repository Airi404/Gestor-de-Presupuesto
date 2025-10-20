// Variables globales
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(nuevoPresupuesto) 
{
    if (isNaN(nuevoPresupuesto) || nuevoPresupuesto < 0) // Si no es un número o es negativo, devuelve -1
    {
        return -1;
    }
    presupuesto = nuevoPresupuesto; // Si es válido, actualiza el presupuesto
    return presupuesto;
}

// Función para mostrar el presupuesto actual
function mostrarPresupuesto() 
{
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

// Clase para crear un gasto
class CrearGasto 
{
    constructor(descripcion, valor = 0, fecha = new Date(), ...etiquetas) 
    {
        this.descripcion = typeof descripcion === 'string' ? descripcion : '';
        this.valor = typeof valor === 'number' && valor >= 0 ? valor : 0;
        const parsedFecha = new Date(fecha);
        this.fecha = !isNaN(parsedFecha.getTime()) ? parsedFecha.getTime() : new Date().getTime(); // Si es un numero lo convierte a Date y devuelve la fecha parseada o la fecha actual si no es un número.
        this.etiquetas = Array.isArray(etiquetas) ? etiquetas : etiquetas.length ? etiquetas : []; 
    }

    mostrarGasto() 
    {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    }

    mostrarGastoCompleto() 
    {   
        const fechaFormateada = new Date(this.fecha).toLocaleString(); // Formatea la fecha en el formato local.
        const etiquetasFormateadas = this.etiquetas.map(e => `- ${e}`).join('\n'); // Formatea las etiquetas en una lista de líneas.
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaFormateada}\nEtiquetas:\n${etiquetasFormateadas}\n`;
    }

    actualizarDescripcion(nuevaDescripcion) 
    {
        if (typeof nuevaDescripcion === 'string') 
        {
            this.descripcion = nuevaDescripcion;
        }
    }

    actualizarValor(nuevoValor) 
    {
        if (typeof nuevoValor === 'number' && nuevoValor >= 0) 
        {
            this.valor = nuevoValor;
        }
    }

    actualizarFecha(nuevaFecha) 
    {
        const parsed = new Date(nuevaFecha);
        if (!isNaN(parsed)) 
        {
            this.fecha = parsed.getTime();
        }

        return this.fecha;
    }

    anyadirEtiquetas(...nuevasEtiquetas) {
        nuevasEtiquetas.forEach(etiqueta =>  // recorremos el array de etiquetas y añade las nuevas que no estén ya en el array.
        {
            if (this.etiquetas.lenght <= 0)
            {
                this.etiquetas = [];
            }

            if (!this.etiquetas.includes(etiqueta)) 
            {
                this.etiquetas.push(etiqueta);
            }
            
        });
    }

    borrarEtiquetas(...etiquetasAEliminar) 
    {
            this.etiquetas = this.etiquetas.filter(e => !etiquetasAEliminar.includes(e)); // Filtra los elementos que no están en el array de etiquetasAEliminar.
    }
    obtenerPeriodoAgrupacion(periodo)
    {
        const anyo = this.fecha.getFullYear();
        const mes = String(this.fecha.getMonth() + 1).padStart(2, '0'); // Añade un cero a la izquierda del número si es menor de 10 y al mes se le añade 1 porque enero es 0.
        const dia = String(this.fecha.getDate()).padStart(2, '0');

        if (periodo === "mes") 
        {
            return `${anyo}-${mes}`;
            
        } else if (periodo === "anyo") 
        {
            return `${anyo}`;

        }else if (periodo === "dia") 
        {

            return `${anyo}-${mes}-${dia}`;

        }
        else 
        {
            return "Período no válido";
        }
    }        
}

// Función para listar todos los gastos
function listarGastos() 
{
    return [...gastos];
}

// Función para añadir un gasto
function anyadirGasto(gasto) 
{
    if (gasto instanceof CrearGasto) 
    {
        gasto.id = idGasto++;
        gastos.push(gasto);
        return gasto;
    }
    return null;
}

// Función para borrar un gasto por ID
function borrarGasto(id) 
{
    const index = gastos.findIndex(gasto1 => gasto1.id === id);
    if (index !== -1) 
    {
        gastos.splice(index, 1); // Borra el gasto de la lista
        return "El gasto ha sido borrado";
    }
    return "No se ha encontrado el gasto";
}

// Función para calcular el total de gastos
function calcularTotalGastos()
{
    return gastos.reduce((total, gasto) => total + gasto.valor, 0); //calcula el total de gastos con reduce
}

// Función para calcular el balance restante
function calcularBalance() 
{
    return presupuesto - calcularTotalGastos();
}
function filtrarGastos(filtros)
{

    if (!filtros || Object.keys(filtros).length === 0) //Si no hay filtros devuelve todos los gastos
    {
        return [...gastos];
    }
    
    return gastos.filter(gasto => 
    {
        let cumple = true; //Variable para controlar si el gasto cumple con los filtros

        if (filtros.fechaDesde) 
        {
            cumple = cumple && new Date(gasto.fecha) >= new Date(filtros.fechaDesde);
        }
        if (filtros.fechaHasta) 
        {
            cumple = cumple && new Date(gasto.fecha) <= new Date(filtros.fechaHasta);
        }
        if (filtros.valorMaximo !== undefined) 
        {
            cumple = cumple && gasto.valor <= filtros.valorMaximo;
        }
        if (filtros.valorMinimo !== undefined) 
        {
            cumple = cumple && gasto.valor >= filtros.valorMinimo;
        }
        if (filtros.descripcionContiene) 
        {
            cumple = cumple && gasto.descripcion.toLowerCase().includes(filtros.descripcionContiene.toLowerCase());
        }
        if (filtros.etiquetasTiene) 
        {
            cumple = cumple && gasto.etiquetas.some(etiqueta => filtros.etiquetasTiene.includes(etiqueta)); // some devuelve true si al menos un elemento del array cumple la condición.
        }

        return cumple;
        
    }); 
}

function agruparGastos(periodo = "mes", etiquetas = [], fechaDesde, fechaHasta)
{
  const filtros = {};
  if (etiquetas.length > 0) filtros.etiquetasTiene = etiquetas;
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;

  const gastosFiltrados = filtrarGastos(filtros);

  return gastosFiltrados.reduce((acc, gasto) => { // Agrupa los gastos por periodo y calcula el total de cada grupo.
    const clave = gasto.obtenerPeriodoAgrupacion(periodo);
    acc[clave] = (acc[clave] || 0) + gasto.valor;
    return acc; // Devuelve el acumulador con la clave y el total.
  }, {});
}

// Exportación de funciones
export 
{
    anyadirGasto,
    borrarGasto,
    listarGastos,
    calcularTotalGastos,
    calcularBalance,
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
    filtrarGastos,
    agruparGastos

}