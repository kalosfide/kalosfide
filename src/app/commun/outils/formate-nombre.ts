export function formateNombre(valeur: any,
    nbChiffresAvant: number, nbChiffresAprès: number, avecSigne?: '<' | '<=' | '>' | '>='
): number {
    if (valeur === undefined || valeur === null) {
        return valeur;
    }
    const nombre = Number.parseFloat(valeur);
    if (Number.isNaN(nombre)) {
        return NaN;
    }
    if (nombre === 0) {
        return avecSigne === '<' || avecSigne === '>' ? NaN : 0;
    }
    let absolu: number;
    if (nombre < 0) {
        if (avecSigne === '>' || avecSigne === '>=') {
            return NaN;
        }
        absolu = -nombre;
    } else {
        if (avecSigne === '<' || avecSigne === '<=') {
            return NaN;
        }
        absolu = nombre;
    }
    const entière = Math.floor(absolu);
    if (entière.toString().length > nbChiffresAvant) {
        return NaN;
    }
    const décimale = nombre - entière;
    if (décimale === 0) {
        return nombre;
    }
    if (nbChiffresAprès === 0) {
        return NaN;
    }
    let texte = décimale.toString();
    const début = texte.charAt(0) === '0' ? 2 : 1;
    texte = texte.slice(début);
    if (texte.length > nbChiffresAprès) {
        return NaN;
    }
    return nombre;
}
