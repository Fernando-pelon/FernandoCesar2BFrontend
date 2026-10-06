import { getClientes, getCliente, createCliente, updateCliente, deleteCliente } from "../services/clientesService.js";

const formCliente = document.getElementById("formCliente");
const id_cliente = document.getElementById("id_cliente");
const txtnombre_cliente = document.getElementById("txtnombre_cliente");
const txtapellido_cliente = document.getElementById("txtapellido_cliente");
const txttelefono_cliente = document.getElementById("txttelefono_cliente");
const txtemail_cliente = document.getElementById("txtemail_cliente");
const txtdireccion_cliente = document.getElementById("txtdireccion_cliente");
const tablaClientes = document.getElementById("tablaClientes");
const alertContainer = document.getElementById("alertContainer");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

function mostrarAlerta(mensaje, tipo) {
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

async function mostrarClientes() {
    try {
        const respuesta = await getClientes();
        const clientes = respuesta.data;
        tablaClientes.innerHTML = "";

        if (clientes.length == 0) {
            tablaClientes.innerHTML = '<tr><td colspan="7" class="text-center">No hay clientes registrados</td></tr>';
            return;
        }

        clientes.forEach(c => {
            tablaClientes.innerHTML += `
                <tr>
                    <td>${c.id_cliente}</td>
                    <td>${c.nombre_cliente}</td>
                    <td>${c.apellido_cliente}</td>
                    <td>${c.telefono_cliente}</td>
                    <td>${c.email_cliente}</td>
                    <td>${c.direccion_cliente || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="colocarDatosFormulario(${c.id_cliente})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarClientes(${c.id_cliente})">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// Devuelve el mensaje de error, o "" si todo está bien
function validarFormulario() {
    if (txtnombre_cliente.value.trim() == "") {
        return "Ingrese el nombre del cliente";
    }
    if (txtapellido_cliente.value.trim() == "") {
        return "Ingrese el apellido del cliente";
    }
    if (txttelefono_cliente.value.trim() == "") {
        return "Ingrese el teléfono del cliente";
    }
    if (txtemail_cliente.value.trim() == "") {
        return "Ingrese el email del cliente";
    }
    if (!txtemail_cliente.value.includes("@") || !txtemail_cliente.value.includes(".")) {
        return "El email no tiene un formato válido";
    }
    return "";
}

// Los nombres de los campos son los del ClienteRequestDTO del backend
function armarCliente() {
    return {
        nombre_cliente: txtnombre_cliente.value.trim(),
        apellido_cliente: txtapellido_cliente.value.trim(),
        telefono_cliente: txttelefono_cliente.value.trim(),
        email_cliente: txtemail_cliente.value.trim(),
        direccion_cliente: txtdireccion_cliente.value.trim()
    };
}

async function crearClientes() {
    try {
        const respuesta = await createCliente(armarCliente());
        mostrarAlerta(respuesta.message || "Cliente registrado correctamente", "success");
        limpiarFormulario();
        await mostrarClientes();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

async function editarClientes() {
    try {
        const respuesta = await updateCliente(id_cliente.value, armarCliente());
        mostrarAlerta(respuesta.message || "Cliente actualizado correctamente", "success");
        limpiarFormulario();
        await mostrarClientes();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

async function eliminarClientes(id) {
    if (!confirm("¿Seguro que desea eliminar este cliente?")) {
        return;
    }
    try {
        const respuesta = await deleteCliente(id);
        mostrarAlerta(respuesta.message || "Cliente eliminado correctamente", "success");
        await mostrarClientes();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// Carga un cliente en el formulario para editarlo
async function colocarDatosFormulario(id) {
    try {
        const respuesta = await getCliente(id);
        const cliente = respuesta.data;
        id_cliente.value = cliente.id_cliente;
        txtnombre_cliente.value = cliente.nombre_cliente;
        txtapellido_cliente.value = cliente.apellido_cliente;
        txttelefono_cliente.value = cliente.telefono_cliente;
        txtemail_cliente.value = cliente.email_cliente;
        txtdireccion_cliente.value = cliente.direccion_cliente || "";

        btnGuardar.textContent = "Actualizar";
        btnCancelar.classList.remove("d-none");
        window.scrollTo(0, 0);
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

function limpiarFormulario() {
    formCliente.reset();
    id_cliente.value = "";
    btnGuardar.textContent = "Guardar";
    btnCancelar.classList.add("d-none");
}

formCliente.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensaje = validarFormulario();
    if (mensaje != "") {
        mostrarAlerta(mensaje, "warning");
        return;
    }
    if (id_cliente.value == "") {
        await crearClientes();
    } else {
        await editarClientes();
    }
});

btnCancelar.addEventListener("click", limpiarFormulario);

window.colocarDatosFormulario = colocarDatosFormulario;
window.eliminarClientes = eliminarClientes;

mostrarClientes();
