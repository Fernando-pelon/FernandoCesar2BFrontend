const API_URL = "http://localhost:8080/api/eventos";

export async function getEventos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "eventos no encontrados"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getEvento(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "evento no encontrado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createEvento(evento) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evento)
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "evento no creado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateEvento(id, evento) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evento)
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "evento no actualizado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteEvento(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "evento no eliminado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
