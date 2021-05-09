import { AppSite } from 'src/app/app-site/app-site';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { DefTexte } from 'src/app/disposition/fabrique/fabrique-texte';
import { Client } from '../client/client';
import { InvitationUtile } from './invitation-utile';

export class InvitationUtileTexte {

    static invitationEnGras: DefTexte = {
        texte: `Ìnvitation `,
        balise: KfTypeDeBaliseHTML.b
    };

    static défInvifation = `un message email envoyé par le serveur de ${AppSite.titre} invitant à cliquer sur un lien
            pour accèder sur ${AppSite.texte} à la page d'enregistrement d'un client.`;

    static invitation: DefTexte[] = [
        `Une `,
        InvitationUtileTexte.invitationEnGras,
        ` est ` + InvitationUtileTexte.défInvifation
    ];


    static définitions: { [key: string]: DefTexte[] } = {
        client: [],
        invitation: [
        ]
    };

    static avertissementEmailExiste: DefTexte = {
        texte: `Attention! Vous devez connaître l'adresse email d'un client pour lui envoyer une invitation.`,
        balise: KfTypeDeBaliseHTML.small,
        classe: KfBootstrap.classe('text', 'danger')
    };

    private static résultatEnregistrementDefs = {
        client: [
            `devenir le propriétaire du compte client `,
            ` que vous avez créé.`
        ],
        sansClient: `créer son compte client sur votre site.`
    };

    static résultatEnregistrement(client: Client): string {
        if (client) {
            return InvitationUtileTexte.résultatEnregistrementDefs.client[0]
                + client.nom + InvitationUtileTexte.résultatEnregistrementDefs.client[1];
        } else {
            return InvitationUtileTexte.résultatEnregistrementDefs.sansClient;
        }
    }

    static résultatEnregistrementAAjouter(client: Client): DefTexte[] {
        if (client) {
            return [
                InvitationUtileTexte.résultatEnregistrementDefs.client[0],
                {
                    texte: client.nom,
                    balise: KfTypeDeBaliseHTML.b
                },
                InvitationUtileTexte.résultatEnregistrementDefs.client[1]
            ];
        } else {
            return [
                InvitationUtileTexte.résultatEnregistrementDefs.sansClient
            ];
        }
    }

    ajouteAvertissementEmailExiste(étiquette: KfEtiquette) {
        Fabrique.ajouteTexte(étiquette,
            {
                texte: `Attention! Vous devez connaître l'adresse email d'un client pour lui envoyer une invitation.`,
                balise: KfTypeDeBaliseHTML.small,
                classe: KfBootstrap.classe('text', 'danger')
            },
        );
    }


}
