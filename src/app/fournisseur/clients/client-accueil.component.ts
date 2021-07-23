import { Component, OnInit } from '@angular/core';
import { Site } from '../../modeles/site/site';
import { PageDef } from '../../commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
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
import { EtatClient } from 'src/app/modeles/client/etat-client';
import { AppSite } from 'src/app/app-site/app-site';
import { KfContenuPhraséDef, KfContenuPhraséDefs } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfUlComposant } from 'src/app/commun/kf-composants/kf-ul-ol/kf-ul-ol-composant';
import { KfTypeDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { KfOnglets } from 'src/app/commun/kf-composants/kf-ul-ol/kf-onglets';
import { KfDescription } from 'src/app/commun/kf-composants/kf-description/kf-description';
import { KfDescriptions } from 'src/app/commun/kf-composants/kf-description/kf-descriptions';
import { Invitation } from 'src/app/modeles/client/invitation';
import { IKfstringDef } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-textes';



@Component({
    templateUrl: '../../disposition/page-base/page-base.html'
})
export class FClientAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = FournisseurPages.accueil;

    site: Site;

    clients: Client[];
    invitations: Invitation[];

    page: 'definitions' | 'methodes';

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
        const état = new KfGroupe('etat');
        let étiquette: KfEtiquette;
        const actifs = this.clients.filter(c => c.etat === EtatClient.actif);
        if (actifs.length === 0) {
            état.ajouteClasse('alert', KfBootstrap.classe('alert', 'danger'));
            étiquette = Fabrique.ajouteEtiquetteP();
            étiquette.ajouteTextes(`Il y a pas de client ayant un compte actif.`);
            état.ajoute(étiquette);
            étiquette = Fabrique.ajouteEtiquetteP();
            étiquette.ajouteTextes(`Sans clients ayant un compte actif, votre site ne peut pas fonctionner.`);
            état.ajoute(étiquette);
        } else {
            état.ajouteClasse('alert', KfBootstrap.classe('alert', 'success'));
            état.créeDivLigne();
            état.ajouteClasse('row', KfBootstrap.classeSpacing('padding', 'tous', 1));
            let colonne = état.divLigne.ajoute(`Etat des comptes`);
            colonne.ajouteClasse('col', KfBootstrap.classeTexte({ poids: 'bold' }));
            let composants: KfComposant[] = [];
            const ajouteLigne: (nom: string, texte: string, valeur: number, aide?: string) => void = (nom: string, texte: string, valeur: number) => {
                étiquette = Fabrique.ajouteEtiquetteP(composants, '');
                étiquette.nom = nom;
                const kfTextes = étiquette.ajouteTextes(
                    texte,
                    '' + valeur
                );
                kfTextes[0].ajouteClasse(KfBootstrap.classeSpacing('margin', 'droite', 2));
                kfTextes[1].ajouteClasse('badge', KfBootstrap.classeFond('secondary'))
            }
            ajouteLigne('total',
                `Clients ayant un compte actif`,
                actifs.length,
            );
            const actifsAvecEmail = actifs.filter(c => !!c.email);
            ajouteLigne('avecEmail',
                `Clients gérant un compte actif`,
                actifsAvecEmail.length,
            );
            colonne = état.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            composants = []
            const fermé = this.clients.filter(c => c.etat === EtatClient.fermé);
            ajouteLigne('fermé',
                `Comptes fermés`,
                fermé.length,
            );
            const inactifs = this.clients.filter(c => c.etat === EtatClient.inactif);
            ajouteLigne('inactifs',
                `Comptes inactifs`,
                inactifs.length,
            );
            colonne = état.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
            composants = []
            ajouteLigne('invitations', 'Invitations', this.invitations.length);
            colonne = état.divLigne.ajoute(composants);
            colonne.ajouteClasse('col');
        }
        this.superGroupe.ajoute(état);
    }

    private ajouteDescription(descriptions: KfDescriptions, titre: string, ...defs: KfContenuPhraséDefs[]): KfDescription {
        let étiquette: KfEtiquette;
        const groupe = new KfGroupe('');
        defs.forEach(def => {
            étiquette = new KfEtiquette('');
            étiquette.fixeContenus(def);
            groupe.ajoute(étiquette);
        });
        return descriptions.ajouteDescription(new KfEtiquette('', titre), groupe);
    }

    private créeDéfinitions(): KfDescriptions {
        const descriptions = new KfDescriptions('definitions');
        let titre: string;
        let détails: KfContenuPhraséDefs[];
        titre = `Données et documents d'un client`,
            détails = [
                [
                    `Les `, { texte: `données`, balise: KfTypeDeBaliseHTML.definition },
                    {
                        texte: ` d'un client sont son nom et les autres informations qui doivent figurer sur ses documents.`,
                        suiviDeSaut: true,
                    }
                ],
                [
                    `Les `, { texte: `documents`, balise: KfTypeDeBaliseHTML.definition },
                    ` d'un client sont les bons de commandes qu'il a pu envoyer et les bons de livraison et les factures que vous avez créées à son nom.`,
                ]
            ];
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte d'un client`
        détails = [
            [
                `Le `, { texte: `compte d'un client`, balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `contient les données et les documents de ce client et a un état qui définit les droits d'accés et de modification de ce client et les votres.`,
                    suiviDeSaut: true
                }
            ],
            `Un client crée son compte en répondant à une invitation envoyée à son adresse email. `
            + `Vous pouvez créer des comptes pour des clients qui n'ont pas d'adresse email.`
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = 'Invitation';
        détails = [
            [
                `Une `, { texte: `invitation`, balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: ` est un message email envoyé par le serveur de ${AppSite.titre} invitant un client à cliquer sur un lien `
                        + `vers la page de création d'un compte client.`,
                    suiviDeSaut: true
                },
            ],
            {
                texte: `Vous pouvez aussi inviter un client à accéder à un compte que vous avez déjà créé pour lui.`,
                classe: 'text-muted'
            }
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte avec accés client`;
        détails = [
            [
                `Un `, { texte: `compte avec accés client`, balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `est un compte auquel le client peut accéder en se connectant à ${AppSite.nom} avec son adresse email.`
                }
            ]
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Etats d'un compte`;
        détails = [
            [
                'Les', { texte: `états d'un compte`, balise: KfTypeDeBaliseHTML.definition },
                { texte: `sont: Nouveau, Actif, Inactif et Fermé.`, suiviDeSaut: true }
            ],
        ];
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte d'état Nouveau`;
        détails = [
            [
                `Un compte est`, { texte: 'nouveau', balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `quand le client obtient un accés au compte en répondant à une invitation. Il reste dans cet état jusqu'à ce que vous le rendiez actif.`,
                    suiviDeSaut: true
                },
                `Un compte nouveau apparaît `,
                { texte: 'en couleur', classe: this.service.utile.classeNouveau },
                { texte: `dans toutes les listes de clients.`, suiviDeSaut: true }
            ],
            [
                {
                    texte: `Quand un compte est nouveau,`, suiviDeSaut: true
                },
                {
                    texte: `le client peut créer ses bons de commande et consulter et télécharger ses bons de livraison et ses factures.`,
                    suiviDeSaut: true,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
                {
                    texte: `vous pouvez consulter et télécharger ses bons de commande mais vous ne pouvez pas créer de bons de livraison ni de factures.`,
                    suiviDeSaut: true,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
            ],
            [
                {
                    texte: `Vous pouvez supprimer un compte d'état Nouveau s'il a été créé par le client `
                    + `ou annuler les modifications faites depuis que le client y a eu accés s'il a été créé par vous. `
                    + `Cette possibilité permet de réparer le problème posé si l'invitation a été envoyée à `
                    + `adresse email erronnée et qu'une autre personne que le client y a répondu.`,
                }
            ]
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte d'état Actif`;
        détails = [
            [
                `Un compte est`, { texte: 'actif', balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `si le client y a accés et que vous l'avez fait passer de l'état Nouveau à l'état Actif `
                        + `ou si vous l'avez créé et que vous ne l'avez pas fait passer à l'état Inactif.`,
                    suiviDeSaut: true
                },
                { texte: `Un compte actif apparaît dans toutes les listes de clients.`, suiviDeSaut: true },
            ],
            [
                {
                    texte: `Quand un compte est actif,`, suiviDeSaut: true
                },
                {
                    texte: `s'il y a accés, le client peut créer ses bons de commande et consulter et télécharger ses bons de livraison et ses factures.`,
                    suiviDeSaut: true,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
                {
                    texte: `vous pouvez consulter et télécharger ses bons de commande et créer, consulter et télécharger ses bons de livraison et ses factures.`,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
            ]
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte d'état Inactif`;
        détails = [
            [
                `Un compte actif devient`, { texte: 'inactif', balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `pendant ${this.service.utile.joursInactifAvantFermé} jours quand vous déclenchez sa fermeture si le client y a accés, `
                    + `quand vous le faites passer à l'état Inactif sinon.`,
                    suiviDeSaut: true
                },
                `Un compte inactif n'apparaît que sur la page`,
                { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            ],
            [
                {
                    texte: `Quand un compte est inactif,`, suiviDeSaut: true
                },
                {
                    texte: `le client peut consulter et télécharger ses documents.`,
                    suiviDeSaut: true,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
                {
                    texte: `vous pouvez consulter et télécharger ses documents et vous pouvez réactiver le compte.`,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
            ]
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        titre = `Compte d'état Fermé`;
        détails = [
            [
                `Quand vous déclenchez la fermeture d'un compte avec accés client, il devient`, { texte: 'fermé', balise: KfTypeDeBaliseHTML.definition },
                {
                    texte: `aprés ${this.service.utile.joursInactifAvantFermé} jours d'inactivité.`,
                    suiviDeSaut: true
                },
                `Un compte fermé n'apparaît que sur la page`,
                { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            ],
            [
                {
                    texte: `Quand un compte est fermé,`, suiviDeSaut: true
                },
                {
                    texte: `le client n'a plus accés au compte.`,
                    suiviDeSaut: true,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
                {
                    texte: `vous pouvez consulter et télécharger ses documents et vous pouvez réactiver le compte.`,
                    classe: KfBootstrap.classeSpacing('padding', 'gauche', 4)
                },
            ]
        ]
        this.ajouteDescription(descriptions, titre, ...détails);

        return descriptions;
    }

    private créeMéthodes(): KfDescriptions {
        const descriptions = new KfDescriptions('methode');
        this.ajouteDescription(descriptions, `Pour qu'un client crée son compte`,
            `Munissez vous de son adresse email et envoyez-lui une invitation en cliquant sur`,
            this.service.utile.lien.ajouteInvitation(),
            `dans la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Il est impossible d'envoyer une invitation s'il y a déjà un client gérant son compte ou une invitation ayant cette adresse email.`,
                classe: KfBootstrap.classe('text', 'danger')
            }
        );
        this.ajouteDescription(descriptions, `Pour créer un compte pour un client`,
            `Cliquez sur`,
            this.service.utile.lien.ajoute(),
            `dans la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(descriptions, `Pour qu'un client ait accés à un compte déjà créé`,
            `Munissez vous de son adresse email et envoyez-lui une invitation en cliquant sur`,
            this.service.utile.lien.invite(),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(descriptions, `Pour modifier les données (nom, ...) d'un compte`,
            `Cliquez sur`,
            this.service.utile.lien.edite(),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Vous ne pouvez pas modifier les données d'un compte avec accés client.`,
                classe: 'text-muted'
            }
        );
        this.ajouteDescription(descriptions, `Pour supprimer un compte`,
            `Cliquez sur`,
            this.service.utile.lien.supprime(),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Vous ne pouvez pas supprimer un compte avec accés client mais vous pouvez le fermer.`,
                classe: 'text-muted'
            }
        );
        this.ajouteDescription(descriptions, `Pour fermer un compte avec accés client`,
            `Cliquez sur`,
            this.service.utile.lien.exclut(),
            `dans la ligne de ce compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) },
        );
        this.ajouteDescription(descriptions, `Pour réactiver un compte inactif ou fermé`,
            `Cliquez sur`,
            this.service.utile.lien.accepte(),
            `dans la ligne de ce compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) },
        );
        this.ajouteDescription(descriptions, `Pour supprimer une invitation`,
            `Cliquez sur`,
            this.service.utile.lien.supprime(),
            `dans la ligne de cette invitation sur la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(descriptions, `Pour réenvoyer une invitation`,
            `Cliquez sur`,
            this.service.utile.lien.réenvoie(),
            `dans la ligne de cette invitation sur la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `L'adresse email sera la même et si le client était invité à gérer un compte déjà créé, le compte sera le même.`,
                classe: 'text-muted'
            }
        );
        const email = 'client@site.com';
        this.ajouteDescription(descriptions, `Pour réenvoyer une invitation à gérer un compte déjà créé`,
            `Vous pouvez utiliser la méthode précédente ou cliquer sur`,
            this.service.utile.lien.invité(email),
            `(où ${email} est l'adresse email où a été envoyée l'invitation) dans la ligne de ce compte sur la page `,
            { texte: 'Compte.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `L'adresse email sera la même et le compte sera le même.`,
                classe: 'text-muted'
            }
        );

        return descriptions;
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(Fabrique.titrePage.titrePage(`Accueil`, 1));
        this.ajouteEtat();
        const onglets = new KfOnglets('onglets');
        onglets.ajouteClasse(KfBootstrap.classeSpacing('margin', 'bas', 2));
        KfBootstrap.prépareOnglets(onglets);

        const créeDéclencheur = (nom: string, texte: string) => {
            const bouton = new KfBouton(nom, texte);
            KfBootstrap.prépareOnglet(bouton);
            return bouton
        }
        this.superGroupe.ajoute(onglets);
        let déclencheur = créeDéclencheur('définitions', 'Définitions');
        let page = this.créeDéfinitions();
        onglets.ajouteOnglet(déclencheur, page);
        this.superGroupe.ajoute(page);
        déclencheur = créeDéclencheur('methodes', 'Méthodes');
        page = this.créeMéthodes();
        onglets.ajouteOnglet(déclencheur, page);
        this.superGroupe.ajoute(page);
    }


    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(data => {
            this.clients = data.liste;
            this.invitations = data.invitations;
            this.créeContenus();
        }));
    }

}
