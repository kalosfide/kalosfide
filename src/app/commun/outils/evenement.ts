export class Evénement<T> {
    private abonnés: ((détail: T) => void)[] = [];
    private désactivations = 0;

    Abonne(abonné: (détail: T) => void) {
        this.abonnés.push(abonné);
    }
    Désabonne(abonné: (détail: T) => void) {
        this.abonnés = this.abonnés.filter(a => a !== abonné);
    }
    Désactive() { this.désactivations++; }
    Active() {
        if (this.désactivations > 0) { this.désactivations--; }
    }
    Publie(détail: T) {
        if (this.désactivations === 0) { this.abonnés.forEach(abonné => abonné(détail)); }
    }
}

export class Signal {
    private abonnés: (() => void)[] = [];
    private désactivations = 0;

    Abonne(abonné: () => void) {
        this.abonnés.push(abonné);
    }
    Désabonne(abonné: () => void) {
        this.abonnés = this.abonnés.filter(a => a !== abonné);
    }

    Désactive() { this.désactivations++; }
    Active() {
        if (this.désactivations > 0) { this.désactivations--; }
    }
    Publie() {
        if (this.désactivations === 0) { this.abonnés.forEach(abonné => abonné()); }
    }
}
