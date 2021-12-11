export class Routeur {
    private parent: Routeur;
    private segments: string[];

    public get urlBase(): string {
        return this.parent ? this.parent.url(...this.segments) : ''
    }

    protected constructor(parent: Routeur, ...segments: string[]) {
        this.parent = parent;
        this.segments = segments;
    }

    public url(...segments: string[]): string {
        return [this.urlBase].concat(segments).join('/')
    }

    public enfant(...segments: string[]): Routeur {
        const routeur = new Routeur(this, ...segments);
        return routeur
    }
}
