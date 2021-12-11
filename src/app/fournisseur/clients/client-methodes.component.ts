import { Component, OnInit } from '@angular/core';
import { PageDef } from '../../commun/page-def';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/modeles/client/client.service';
import { FournisseurClientPages } from './client-pages';
import { ClientDescriptionsComponent } from './client-descriptions.component';
import { IContenuPhraséDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html'
})
export class ClientMéthodesComponent extends ClientDescriptionsComponent implements OnInit {

    pageDef: PageDef = FournisseurClientPages.méthodes;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
    }

    protected ajouteDescriptions() {
        const étiquetteLien = (contenuDef: IContenuPhraséDef): KfEtiquette => {
            const étiquette = Fabrique.étiquetteLien(contenuDef);
            étiquette.gereHtml.fixeAttribut('role', 'img');
            étiquette.fixeStyleDef('cursor', 'auto');
            return étiquette;
        };
        const étiquetteBouton = (contenuDef: IContenuPhraséDef): KfEtiquette => {
            contenuDef.classeTexte = KfBootstrap.texteColor().classe('dark');
            return étiquetteLien(contenuDef);
        }

        this.ajouteDescription(`Pour qu'un client crée son compte`,
            `Munissez vous de son adresse email et envoyez-lui une invitation en cliquant sur`,
            this.service.utile.lien.ajouteInvitation(),
            `dans la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Il est impossible d'envoyer une invitation s'il y a déjà un client gérant son compte ou une invitation ayant cette adresse email.`,
                classe: KfBootstrap.classe('text', 'danger')
            }
        );
        this.ajouteDescription(`Pour créer un compte pour un client`,
            `Cliquez sur`,
            this.service.utile.lien.ajoute(),
            `dans la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(`Pour qu'un client ait accés à un compte déjà créé`,
            `Munissez vous de son adresse email et envoyez-lui une invitation en cliquant sur`,
            étiquetteLien(Fabrique.contenu.inviter()),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(`Pour modifier les données (nom, ...) d'un compte`,
            `Cliquez sur`,
            étiquetteLien(Fabrique.contenu.édite()),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Vous ne pouvez pas modifier les données d'un compte avec accés client.`,
                classe: 'text-muted'
            }
        );
        this.ajouteDescription(`Pour supprimer un compte`,
            `Cliquez sur`,
            étiquetteBouton(Fabrique.contenu.supprime()),
            `dans la ligne de son compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `Vous ne pouvez pas supprimer un compte avec accés client mais vous pouvez le fermer.`,
                classe: 'text-muted'
            }
        );
        this.ajouteDescription(`Pour fermer un compte avec accés client`,
            `Cliquez sur`,
            étiquetteBouton(Fabrique.contenu.fermer()),
            `dans la ligne de ce compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) },
        );
        this.ajouteDescription(`Pour réactiver un compte inactif ou fermé`,
            `Cliquez sur`,
            étiquetteLien(Fabrique.contenu.activer()),
            `dans la ligne de ce compte sur la page `,
            { texte: 'Comptes.', classe: KfBootstrap.classeTexte({ style: 'italic' }) },
        );
        this.ajouteDescription(`Pour supprimer une invitation`,
            `Cliquez sur`,
            étiquetteBouton(Fabrique.contenu.supprime()),
            `dans la ligne de cette invitation sur la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }) }
        );
        this.ajouteDescription(`Pour réenvoyer une invitation`,
            `Cliquez sur`,
            étiquetteLien(Fabrique.contenu.réinviter()),
            `dans la ligne de cette invitation sur la page `,
            { texte: 'Invitations.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `L'adresse email sera la même et si le client était invité à gérer un compte déjà créé, le compte sera le même.`,
                classe: 'text-muted'
            }
        );
        const email = 'client@site.com';
        this.ajouteDescription(`Pour réenvoyer une invitation à gérer un compte déjà créé`,
            `Vous pouvez utiliser la méthode précédente ou cliquer sur`,
            étiquetteLien(Fabrique.contenu.invité(email)),
            `(où ${email} est l'adresse email où a été envoyée l'invitation) dans la ligne de ce compte sur la page `,
            { texte: 'Compte.', classe: KfBootstrap.classeTexte({ style: 'italic' }), suiviDeSaut: true },
            {
                texte: `L'adresse email sera la même et le compte sera le même.`,
                classe: 'text-muted'
            }
        );
    }

}
