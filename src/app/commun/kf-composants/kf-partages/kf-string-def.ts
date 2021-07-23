export type KfStringDef = string | (() => string);

export function ValeurStringDef(stringDef: KfStringDef): string {
    if (typeof(stringDef) === 'string') {
        return stringDef;
    } else {
        return stringDef();
    }
}

export type KfStringDefDe<T> = string | ((t: T) => string);

export function ValeurStringDefDe<T>(stringDef: KfStringDefDe<T>, t: T): string {
    if (typeof(stringDef) === 'string') {
        return stringDef;
    } else {
        return stringDef(t);
    }
}
