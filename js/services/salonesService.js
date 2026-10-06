const API_URL = "http://localhost:8080/api/salones";

export async function getSalones() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "salones no encontrados"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSalon(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error("Error " + respuesta.status + ": " + (datos.message || "salón no encontrado"));
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
