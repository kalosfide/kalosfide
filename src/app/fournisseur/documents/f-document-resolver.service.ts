import { Injectable } from '@angular/core';
import { CLFDocumentResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-document-resolver.service';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { Client } from 'src/app/modeles/client/client';

@Injectable()
export class FDocumentResolverService extends CLFDocumentResolverService {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    client(): Client {
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            throw new Error('FDocumentResolverService: La garde précédente doit avoir déjà résolu le clfDocs');
        }
        return clfDocs.client;
    }
}
