
export function estNombre(nombre: number): boolean {
    return nombre !== undefined && nombre !== null && !Number.isNaN(nombre);
}
