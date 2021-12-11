export class AdminBilan {
    utilisateur: {
        nb: number,
        connections: number,
        deconnections: number
    };
    site: {
        nb: {[key: string]: number}
    }
}