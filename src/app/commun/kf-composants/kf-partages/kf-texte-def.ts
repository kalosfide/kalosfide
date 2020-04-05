export type KfTexteDef = string | (() => string);

export function ValeurTexteDef(texteDef: KfTexteDef): string {
    if (typeof(texteDef) === 'string') {
        return texteDef;
    } else {
        return texteDef();
    }
}
