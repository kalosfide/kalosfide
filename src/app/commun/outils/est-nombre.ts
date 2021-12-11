/**
 * Retourne une valeur Boolean indiquant si le nombre a une valeur ou s'il est undefined, null ou Nan.
 * @param nombre - valeur numérique
 */
export function estNombre(nombre: number): boolean {
    return nombre !== undefined && nombre !== null && !Number.isNaN(nombre);
}
