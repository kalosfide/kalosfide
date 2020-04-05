export type KfNombreDef = number | (() => number);

export function ValeurNombreDef(nombreDef: KfNombreDef): number {
    if (typeof(nombreDef) === 'number') {
        return nombreDef;
    } else {
        return nombreDef();
    }
}
