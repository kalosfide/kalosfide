import { Component, OnInit } from '@angular/core';
import { Site } from '../../modeles/site/site';
import { PageDef } from '../../commun/page-def';
import { IBarreTitre } from '../../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/modeles/client/client';
import { ClientService } from 'src/app/modeles/client/client.service';
import { EtatRole } from 'src/app/modeles/role/etat-role';
import { KfOnglets } from 'src/app/commun/kf-composants/kf-ul-ol/kf-onglets';
import { KfDescription } from 'src/app/commun/kf-composants/kf-description/kf-description';
import { Invitation } from 'src/app/modeles/client/invitation';
import { KfDivTableColonne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';
import { FournisseurClientPages } from './client-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html'
})
export class FClientAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = FournisseurClientPages.accueil;

    site: Site;

    clients: Client[];
    invitations: Invitation[];

    onglets: KfOnglets;

    infoPopover: KfBouton;
    lien: KfLien;

    définitions: KfDescription[];

    constructor(
        private route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super();
    }

    get titre(): string {
        return this.site.titre;
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [Fabrique.titrePage.groupeDefAccès()]
        });

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private ajouteEtat() {
        let groupe = new KfGroupe('etat');
        let étiquette: KfEtiquette;
        const nouveaux = this.clients.filter(c => c.etat === EtatRole.nouveau);
        const actifs = this.clients.filter(c => c.etat === EtatRole.actif);
        if (actifs.length === 0 && nouveaux.length === 0) {
            groupe.ajouteClasse('alert', KfBootstrap.classe('alert', 'danger'));
            étiquette = Fabrique.ajouteEtiquetteP();
            étiquette.ajouteTextes(`Il y a pas de client ayant un compte actif.`);
            groupe.ajoute(étiquette);
            étiquette = Fabrique.ajouteEtiquetteP();
            étiquette.ajouteTextes(`Sans clients ayant un compte actif, votre site ne peut pas fonctionner.`);
            groupe.ajoute(étiquette);
            this.superGroupe.ajoute(groupe);
        } else {
            groupe.ajouteClasse('alert', KfBootstrap.classe('alert', 'success'));
            groupe.créeDivLigne();
            groupe.ajouteClasse('row', KfBootstrap.classeSpacing('padding', 'tous', 1));
            let colonne: KfDivTableColonne;
            let composants: KfComposant[] = [];
            const ajouteLigne: (nom: string, texte: string, valeur: number) => KfEtiquette = (nom: string, texte: string, valeur: number) => {
                étiquette = Fabrique.ajouteEtiquetteP(composants, '');
                étiquette.nom = nom;
                const contenus = étiquette.ajouteContenus(
                    this.lienDéfinition(nom, texte),
                    '' + valeur
                );
                contenus[0].ajouteClasse(KfBootstrap.classeSpacing('margin', 'droite', 2));
                contenus[1].ajouteClasse('badge', KfBootstrap.classeFond('secondary'));
                return étiquette;
            }

            étiquette = Fabrique.ajouteEtiquetteP(composants, KfBootstrap.classeTexte({ poids: 'bold' }));
            étiquette.ajouteTextes(`Etat des comptes`);
            if (nouveaux.length > 0) {
                ajouteLigne('nouveau',
                    `Comptes nouveaux à activer`,
                    nouveaux.length,
                ).ajouteClasse(KfBootstrap.classeTexte({ color: 'danger' }));
            }
            colonne = groupe.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            composants = []

            ajouteLigne('actif',
                `Clients ayant un compte actif`,
                actifs.length,
            );
            const actifsAvecEmail = actifs.filter(c => !!c.email);
            ajouteLigne('acces_client',
                `Clients gérant un compte actif`,
                actifsAvecEmail.length,
            );
            colonne = groupe.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            composants = []
            const fermé = this.clients.filter(c => c.etat === EtatRole.fermé);
            ajouteLigne('ferme',
                `Comptes fermés`,
                fermé.length,
            );
            const inactifs = this.clients.filter(c => c.etat === EtatRole.inactif);
            ajouteLigne('inactif',
                `Comptes inactifs`,
                inactifs.length,
            );
            colonne = groupe.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            composants = []
            ajouteLigne('invitation', 'Invitations', this.invitations.length);
            colonne = groupe.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            this.superGroupe.ajoute(groupe);

            if (nouveaux.length > 0) {
                groupe = new KfGroupe('nouveaux');
                groupe.ajouteClasse('row', KfBootstrap.classeSpacing('padding', 'tous', 1));
                groupe.ajouteClasse('alert', KfBootstrap.classe('alert', 'warning'));
                const un = nouveaux.length === 1;
                étiquette = Fabrique.ajouteEtiquetteP();
                étiquette.fixeTextes(un
                    ? `Une invitation que vous avez envoyé a reçu une réponse et un nouveau compte a été créé.`
                    : `Des invitations que vous avez envoyé ont reçu des réponses et de nouveaux comptes ont été créé.`
                );
                groupe.ajoute(étiquette);
                étiquette = Fabrique.ajouteEtiquetteP();
                étiquette.fixeTextes(un
                    ? `Vous devez activer .`
                    : `Des invitations que vous avez envoyé ont reçu des réponses et de nouveaux comptes ont été créé.`
                );
                groupe.ajoute(étiquette);
                if (nouveaux.length === 1) {
                    étiquette.ajouteContenus(
                        `Une invitation que vous avez envoyé a reçu une réponse et un nouveau compte a été créé.`,
                        `Si vous ètes sûr que c'est bien le client concerné qui a répondu, vous pouvez activer ce compte sur la page`
                    )
                }
                this.superGroupe.ajoute(groupe);
            }
        }
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(Fabrique.titrePage.titrePage(`Accueil`, 1));
        this.ajouteEtat();
        this.onglets = new KfOnglets('onglets');
        this.onglets.ajouteClasse(KfBootstrap.classeSpacing('margin', 'bas', 2));
        KfBootstrap.prépareOnglets(this.onglets);

        this.superGroupe.ajoute(this.onglets);
        let pageDef: PageDef;
        let lien: KfLien;
        pageDef = FournisseurClientPages.définitions;
        lien = this.onglets.ajouteLien(pageDef.lien, pageDef.path);
        KfBootstrap.prépareOnglet(lien);
        lien.avecRouterLinkActive('active');
        pageDef = FournisseurClientPages.méthodes;
        lien = this.onglets.ajouteLien(pageDef.lien, pageDef.path);
        KfBootstrap.prépareOnglet(lien);
        lien.avecRouterLinkActive('active');
    }

    lienDéfinition(nom: string, texte: string): KfLien {
        const lien = new KfLien('vers_' + nom, `./${FournisseurClientPages.définitions.path}`, texte);
        lien.fragment = nom;
        return lien;
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(data => {
            this.clients = data.liste;
            this.invitations = data.invitations;
            this.créeContenus();
        }));
    }

}
