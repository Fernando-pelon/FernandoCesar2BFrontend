import { getEventos, getEvento, createEvento, updateEvento, deleteEvento } from "../services/eventosService.js";
import { getClientes } from "../services/clientesService.js";
import { getSalones } from "../services/salonesService.js";

const formEvento = document.getElementById("formEvento");
const id_evento = document.getElementById("id_evento");
const cliente_evento = document.getElementById("cliente_evento");
const salon_evento = document.getElementById("salon_evento");
const txtnombre_evento = document.getElementById("txtnombre_evento");
const txtfecha_evento = document.getElementById("txtfecha_evento");
const txtcantidad_personas = document.getElementById("txtcantidad_personas");
const txtcantidad_horas = document.getElementById("txtcantidad_horas");
const estado_evento = document.getElementById("estado_evento");
const grupo_estado = document.getElementById("grupo_estado");
const tablaEventos = document.getElementById("tablaEventos");
const alertContainer = document.getElementById("alertContainer");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

// Listas para llenar los select y para mostrar los nombres en la tabla
let clientes = [];
let salones = [];

function mostrarAlerta(mensaje, tipo) {
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

function nombreCliente(id) {
    for (const c of clientes) {
        if (c.id_cliente == id) {
            return c.nombre_cliente + " " + c.apellido_cliente;
        }
    }
    return id;
}

function nombreSalon(id) {
    for (const s of salones) {
        if (s.id_salon == id) {
            return s.nombre_salon;
        }
    }
    return id;
}

async function cargarListas() {
    try {
        const respuestaClientes = await getClientes();
        const respuestaSalones = await getSalones();
        clientes = respuestaClientes.data;
        salones = respuestaSalones.data;

        cliente_evento.innerHTML = '<option value="">Seleccione un cliente</option>';
        clientes.forEach(c => {
            cliente_evento.innerHTML += `<option value="${c.id_cliente}">${c.nombre_cliente} ${c.apellido_cliente}</option>`;
        });

        salon_evento.innerHTML = '<option value="">Seleccione un salón</option>';
        salones.forEach(s => {
            salon_evento.innerHTML += `<option value="${s.id_salon}">${s.nombre_salon}</option>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

async function mostrarEventos() {
    try {
        const respuesta = await getEventos();
        const eventos = respuesta.data;
        tablaEventos.innerHTML = "";

        if (eventos.length == 0) {
            tablaEventos.innerHTML = '<tr><td colspan="10" class="text-center">No hay eventos registrados</td></tr>';
            return;
        }

        eventos.forEach(e => {
            tablaEventos.innerHTML += `
                <tr>
                    <td>${e.id_evento}</td>
                    <td>${nombreCliente(e.id_cliente_evento)}</td>
                    <td>${nombreSalon(e.id_salon_evento)}</td>
                    <td>${e.nombre_evento}</td>
                    <td>${String(e.fecha_evento).substring(0, 10)}</td>
                    <td>${e.cantidad_personas_evento}</td>
                    <td>${e.cantidad_horas_evento || "-"}</td>
                    <td>$${Number(e.total_pago_evento).toFixed(2)}</td>
                    <td>${e.estado_evento}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="colocarDatosFormulario(${e.id_evento})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarEventos(${e.id_evento})">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// Devuelve el mensaje de error, o "" si todo está bien
function validarFormulario() {
    if (cliente_evento.value == "") {
        return "Seleccione un cliente";
    }
    if (salon_evento.value == "") {
        return "Seleccione un salón";
    }
    if (txtnombre_evento.value.trim() == "") {
        return "Ingrese el nombre del evento";
    }
    if (txtfecha_evento.value == "") {
        return "Seleccione la fecha del evento";
    }
    if (txtcantidad_personas.value <= 0 || txtcantidad_personas.value % 1 != 0) {
        return "La cantidad de personas debe ser un número entero mayor a 0";
    }
    if (txtcantidad_horas.value <= 0 || txtcantidad_horas.value % 1 != 0) {
        return "La cantidad de horas debe ser un número entero mayor a 0";
    }
    return "";
}

// Los nombres de los campos son los del EventoRequestDTO del backend
function armarEvento() {
    const evento = {
        id_cliente_evento: Number(cliente_evento.value),
        id_salon_evento: Number(salon_evento.value),
        nombre_evento: txtnombre_evento.value.trim(),
        fecha_evento: txtfecha_evento.value,
        cantidad_personas_evento: Number(txtcantidad_personas.value),
        cantidad_horas_evento: Number(txtcantidad_horas.value)
    };
    // Al crear, el backend pone el estado inicial. Al editar se manda el estado elegido
    if (id_evento.value != "") {
        evento.estado_evento = estado_evento.value;
    }
    return evento;
}

async function crearEventos() {
    try {
        const respuesta = await createEvento(armarEvento());
        mostrarAlerta(respuesta.message || "Evento registrado correctamente", "success");
        limpiarFormulario();
        await mostrarEventos();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

async function editarEventos() {
    try {
        const respuesta = await updateEvento(id_evento.value, armarEvento());
        mostrarAlerta(respuesta.message || "Evento actualizado correctamente", "success");
        limpiarFormulario();
        await mostrarEventos();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

async function eliminarEventos(id) {
    if (!confirm("¿Seguro que desea eliminar este evento?")) {
        return;
    }
    try {
        const respuesta = await deleteEvento(id);
        mostrarAlerta(respuesta.message || "Evento eliminado correctamente", "success");
        await mostrarEventos();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// Carga un evento en el formulario para editarlo
async function colocarDatosFormulario(id) {
    try {
        const respuesta = await getEvento(id);
        const evento = respuesta.data;
        id_evento.value = evento.id_evento;
        cliente_evento.value = evento.id_cliente_evento;
        salon_evento.value = evento.id_salon_evento;
        txtnombre_evento.value = evento.nombre_evento;
        txtfecha_evento.value = String(evento.fecha_evento).substring(0, 10);
        txtcantidad_personas.value = evento.cantidad_personas_evento;
        txtcantidad_horas.value = evento.cantidad_horas_evento;
        estado_evento.value = evento.estado_evento.toUpperCase();

        grupo_estado.classList.remove("d-none");
        btnGuardar.textContent = "Actualizar";
        btnCancelar.classList.remove("d-none");
        window.scrollTo(0, 0);
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

function limpiarFormulario() {
    formEvento.reset();
    id_evento.value = "";
    grupo_estado.classList.add("d-none");
    btnGuardar.textContent = "Guardar";
    btnCancelar.classList.add("d-none");
}

formEvento.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensaje = validarFormulario();
    if (mensaje != "") {
        mostrarAlerta(mensaje, "warning");
        return;
    }
    if (id_evento.value == "") {
        await crearEventos();
    } else {
        await editarEventos();
    }
});

btnCancelar.addEventListener("click", limpiarFormulario);

window.colocarDatosFormulario = colocarDatosFormulario;
window.eliminarEventos = eliminarEventos;

async function iniciar() {
    await cargarListas();
    await mostrarEventos();
}
iniciar();
