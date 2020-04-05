import { KeyUidRnoUtile } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-utile';
import { Site } from './site';
import { SiteService } from './site.service';

export class SiteUtile extends KeyUidRnoUtile<Site> {
    constructor(service: SiteService) {
        super(service);
    }

    get service(): SiteService {
        return this.pService as SiteService;
    }
}
