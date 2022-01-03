import { IKeyId } from './i-key-id';

export class KeyId implements IKeyId {
    id: number;

    static créeParams(key: IKeyId): { [param: string]: string } {
        return {
            id: '' + key.id,
        };
    }

    static copieKey(de: IKeyId, vers: IKeyId) {
        vers.id = de.id;
    }

    static texteDeKey(key: IKeyId): string {
        return '' + key.id;
    }

    static keyDeTexte(texte: string): IKeyId {
        try {
            return {
                id: Number.parseInt(texte, 10),
            };
        } catch (error) {
        }
    }

    static compareKey(key1: IKeyId, key2: IKeyId): boolean {
        return key1.id === key2.id;
    }

    static aMêmeKey(key1: IKeyId, key2: IKeyId): boolean {
        if (!key1) {
            return !key2;
        }
        if (!key2) {
            return false;
        }
        return key1.id === key2.id;
    }
}

export class KeyUidRnoActif extends KeyId {
    actif: boolean;
}
