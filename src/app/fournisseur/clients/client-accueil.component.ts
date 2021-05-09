import { Component, OnInit } from '@angular/core';
import { Site } from '../../modeles/site/site';
import { PageDef } from '../../commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { BarreTitre } from '../../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/modeles/client/client';
import { FournisseurClientPages } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';
import { InvitationUtileTexte } from 'src/app/modeles/invitation/invitation-utile-texte';



@Component({
    templateUrl: '../../disposition/page-base/page-base.html'
})
export class FClientAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = FournisseurPages.accueil;

    site: Site;

    clients: Client[];
    grAlerteEtatSite: KfGroupe;
    texteEtat: KfTexte;
    infoPopover: KfBouton;
    lien: KfLien;

    constructor(
        private route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super();
    }

    get titre(): string {
        return this.site.titre;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        barre.ajoute(Fabrique.titrePage.groupeDefAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        const composants: KfComposant[] = [];
        let titre: KfGroupe;
        let étiquette: KfEtiquette;
        let pageDef: PageDef;
        let lien: KfLien;
        let texte: string;
        let classe: string;

        titre = Fabrique.titrePage.titrePage(`Liste des clients`, 1);
        composants.push(titre);
        const nbClients = this.clients.length;
        switch (nbClients) {
            case 0:
                classe = KfBootstrap.classe('text', 'danger');
                texte = `Il y a pas de clients enregistrés.`;
                break;
            case 1:
                texte = `Il y a un client enregistré ${this.clients[0].compte === 'O'
                    ? `qui gére son compte.`
                    : `dont vous gérez le compte.`
                    }`;
                break;
            default:
                texte = `Il y a ${nbClients} clients enregistrés `;
                const nbAvecCompte = this.clients.filter(c => c.compte === 'O').length;
                switch (nbAvecCompte) {
                    case 0:
                        texte += `dont vous gérez les comptes.`;
                        break;
                    case 1:
                        texte += `dont l'un gére son compte.`;
                        break;
                    case nbClients:
                        texte += `qui tous gérent leur compte.`;
                        break;
                    default:
                        texte += `dont ${nbAvecCompte} gérent leur compte.`;
                        break;
                }
                break;
        }
        étiquette = Fabrique.ajouteEtiquetteP(composants, classe);
        Fabrique.ajouteTexte(étiquette, texte);

        titre = Fabrique.titrePage.titrePage(`Enregistrement d'un client`, 1);
        composants.push(titre);
        étiquette = Fabrique.ajouteEtiquetteP(composants);
        Fabrique.ajouteTexte(étiquette,
            `Pour qu'un de vos clients puisse passer commande sur votre site, il doit s'enregistrer
            et il ne peut le faire qu'en utilisant une `,
            InvitationUtileTexte.invitationEnGras,
            {
                texte: `Il pourra alors passer commande sur le site et télécharger ses bons de livraison et ses factures.`,
                suiviDeSaut: true
            },
            {
                texte: `Attention! Vous devez connaître son adresse email pour lui envoyer une invitation.`,
                balise: KfTypeDeBaliseHTML.small,
                classe: KfBootstrap.classe('text', 'danger')
            },
        );
        pageDef = FournisseurClientPages.index;
        lien = this.service.utile.lien.accueil();


        étiquette = Fabrique.ajouteEtiquetteP(composants);
        Fabrique.ajouteTexte(étiquette,
            {
                texte: `S'il n'est pas nécessaire qu'un de vos clients gére lui même ses commandes sur le site ou
                si ce client n'a pas d'adresse mail, vous pouvez créer son compte`,
                suiviDeSaut: true
            },
            {
                texte: `Vous pourrez alors créer et télécharger ses bons de livraison et ses factures.`,
            },
        );

        étiquette = Fabrique.ajouteEtiquetteP(composants);
        Fabrique.ajouteTexte(étiquette,
            {
                texte: `Vous pouvez inviter un de vos clients à prendre en charge un compte que vous avez créé pour lui.`,
                suiviDeSaut: true
            },
            {
                texte: `Il pourra alors passer commande sur le site et télécharger ses bons de livraison et ses factures.`,
                suiviDeSaut: true
            },
            {
                texte: `Attention! Vous devez connaître son adresse email pour lui envoyer une invitation.`,
                balise: KfTypeDeBaliseHTML.small,
                classe: KfBootstrap.classe('text', 'danger')
            },
        );

        composants.forEach(c => this.superGroupe.ajoute(c));
    }


    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(data => {
            this.clients = data.liste;
            this.créeContenus();
        }));
    }

}
