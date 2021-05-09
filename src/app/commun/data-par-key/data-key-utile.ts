import { DataKeyService } from './data-key.service';
import { DataUtile } from './data-utile';
import { IDataKey } from './data-key';
import { DataKeyUtileUrl } from './data-key-utile-url';
import { IDataPages } from './data-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { DataKeyUtileLien } from './data-key-utile-lien';
import { DataKeyUtileColonne } from './data-key-utile-colonne';
import { DataKeyUtileOutils } from './data-key-utile-outils';
import { DataKeyUtileEdite } from './data-key-utile-edite';

export class DataKeyUtile<T extends IDataKey> extends DataUtile {
    protected pUrlKey: DataKeyUtileUrl<T>;
    protected pLienKey: DataKeyUtileLien<T>;
    protected pColonneKey: DataKeyUtileColonne<T>;
    protected pOutilsKey: DataKeyUtileOutils<T>;
    protected pEdite: DataKeyUtileEdite<T>;

    dataPages?: IDataPages;
    dataRoutes?: ISiteRoutes;

    constructor(service: DataKeyService<T>) {
        super(service);
    }

    get urlKey(): DataKeyUtileUrl<T> {
        return this.pUrlKey;
    }

    get lienKey(): DataKeyUtileLien<T> {
        return this.pLienKey;
    }

    get colonneKey(): DataKeyUtileColonne<T> {
        return this.pColonneKey;
    }

    get outilsKey(): DataKeyUtileOutils<T> {
        return this.pOutilsKey;
    }

    get edite(): DataKeyUtileEdite<T> {
        return this.pEdite;
    }

    get service(): DataKeyService<T> {
        return this.pService as DataKeyService<T>;
    }
}
