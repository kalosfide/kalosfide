import { Component, OnInit } from '@angular/core';
import { PageDef } from '../../commun/page-def';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/modeles/client/client.service';
import { AppSite } from 'src/app/app-site/app-site';
import { KfContenuPhraséDef, KfContenuPhraséDefs } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfDescription } from 'src/app/commun/kf-composants/kf-description/kf-description';
import { FournisseurClientPages } from './client-pages';
import { ClientDescriptionsComponent } from './client-descriptions.component';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';


export type nomsDéfinitions = 'donnees' | 'documents' | 'compte' | 'invitation' | 'acces_client' | 'etats' | 'nouveau' | 'actif' | 'inactif' | 'ferme';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html'
})
export class ClientDéfinitionsComponent extends ClientDescriptionsComponent implements OnInit {

    pageDef: PageDef = FournisseurClientPages.définitions;

    définitions: KfDescription[];

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
    }

    protected ajouteDescriptions() {
        const ajouteDéfinition = (nom: nomsDéfinitions, titre: string, ...defs: (KfEtiquette | KfContenuPhraséDefs)[]): KfDescription => {
            const description = this.ajouteDescription(titre, ...defs);
            description.nom = nom;
            return description;
        }

        const définition = (nom: nomsDéfinitions, texte: string): KfContenuPhraséDef => {
            return { nom, texte, balise: KfTypeDeBaliseHTML.definition };
        }

        let titre: string;
        let détails: KfContenuPhraséDefs[];
        titre = `Données et documents d'un client`;
            détails = [
                [
                    `Les `, définition('donnees', `données`),
                    {
                        texte: ` d'un client sont son nom et les autres informations qui doivent figurer sur ses documents.`,
                        suiviDeSaut: true,
                    }
                ],
                [
                    `Les `, définition('documents', `documents`),
                    ` d'un client sont les bons de commandes qu'il a pu envoyer et les bons de livraison et les factures que vous avez créées à son nom.`,
                ]
            ];
        ajouteDéfinition('donnees', titre, ...détails);

        titre = `Compte d'un client`
        détails = [
            [
                `Le `, définition('compte', `compte d'un client`),
                {
                    texte: `contient les données et les documents de ce client et a un état qui définit les droits d'accés et de modification de ce client et les votres.`,
                    suiviDeSaut: true
                }
            ],
            `Un client crée son compte en répondant à une invitation envoyée à son adresse email. `
            + `Vous pouvez créer des comptes pour des clients qui n'ont pas d'adresse email.`
        ]
        ajouteDéfinition('compte', titre, ...détails);

        titre = 'Invitation';
        détails = [
            [
                `Une `, définition('invitation', `invitation`),
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
        ajouteDéfinition('invitation', titre, ...détails);

        titre = `Compte avec accés client`;
        détails = [
            [
                `Un `, définition('acces_client', `compte avec accés client`),
                {
                    texte: `est un compte auquel le client peut accéder en se connectant à ${AppSite.nom} avec son adresse email.`
                }
            ]
        ]
        ajouteDéfinition('acces_client', titre, ...détails);

        titre = `Etats d'un compte`;
        détails = [
            [
                'Les', définition('etats', `états d'un compte`),
                { texte: `sont: Nouveau, Actif, Inactif et Fermé.`, suiviDeSaut: true }
            ],
        ];
        ajouteDéfinition('etats', titre, ...détails);

        titre = `Compte d'état Nouveau`;
        détails = [
            [
                `Un compte est`, définition('nouveau', `nouveau`),
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
        ajouteDéfinition('nouveau', titre, ...détails);

        titre = `Compte d'état Actif`;
        détails = [
            [
                `Un compte est`, définition('actif', `actif`),
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
        ajouteDéfinition('actif', titre, ...détails);

        titre = `Compte d'état Inactif`;
        détails = [
            [
                `Un compte actif devient`, définition('inactif', `inactif`),
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
        ajouteDéfinition('inactif', titre, ...détails);

        titre = `Compte d'état Fermé`;
        détails = [
            [
                `Quand vous déclenchez la fermeture d'un compte avec accés client, il devient`, définition('ferme', `fermé`),
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
        ajouteDéfinition('ferme', titre, ...détails);
    }

}
