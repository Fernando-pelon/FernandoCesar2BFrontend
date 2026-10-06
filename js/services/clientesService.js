const API_URL = "http://localhost:8080/api/clientes";

export async function getClientes() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "clientes no encontrados"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCliente(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "cliente no encontrado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createCliente(cliente) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "cliente no creado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateCliente(id, cliente) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "cliente no actualizado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteCliente(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "cliente no eliminado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
