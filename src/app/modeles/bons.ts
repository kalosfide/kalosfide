export interface IBon {
    uid: string;
    rno: number;
    no: number;
    date?: Date;
}

export function TexteDateBon(bon: IBon): string {
    return bon.date
        ? bon.date.toLocaleDateString('fr-FR') + ' ' + bon.date.toLocaleTimeString('fr-FR')
        : '';
}
