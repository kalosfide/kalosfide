import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { EtatRole } from '../role/etat-role';
import { FournisseurUtile } from './fournisseur-utile';
import { FournisseurUtileLien } from './fournisseur-utile-lien';
import { FournisseurUtileUrl } from './fournisseur-utile-url';
import { IContenuPhraséDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { BootstrapType } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { Fournisseur } from './fournisseur';

export class FournisseurUtileBouton extends DataUtileBouton {
    constructor(utile: FournisseurUtile) {
        super(utile);
    }

    get utile(): FournisseurUtile {
        return this.dataUtile as FournisseurUtile;
    }

    get url(): FournisseurUtileUrl {
        return this.utile.url;
    }

    get lien(): FournisseurUtileLien {
        return this.utile.lien;
    }

    active(fournisseur: Fournisseur, rafraichitComponent: () => void): KfBouton {
        let contenu: IContenuPhraséDef;
        let titre: string;
        let texte: {
            action: string,
            état: string,
            annulation?: string
        };
        let nom : string;
        let bootstrapType: BootstrapType;
        let active: boolean;
        if (fournisseur.etat === EtatRole.inactif || fournisseur.etat === EtatRole.fermé) {
            contenu = Fabrique.contenu.activer();
            contenu.texte = 'Réactiver';
            titre = `Activation d'un fournisseur`;
            texte = {
                action: `va être réactivé`,
                état: fournisseur.etat === EtatRole.inactif ? 'désactivé' : 'fermé'
            };
            nom = 'active';
            bootstrapType = 'primary';
            active = true;
        } else {
            contenu = Fabrique.contenu.fermer();
            titre = `Fermeture d'un fournisseur`;
            texte = {
                action: `va être désactivé pour une période de 60 jours après laquelle il sera automatiquement fermé`,
                état: 'activé',
                annulation: `Cette action pourra être annulée en réactivant le fournisseur.`
            };
            nom = 'active';
            bootstrapType = 'primary';
            active = false;
        }
        
        const étiquettes: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(`Le fournisseur `,
            { texte: fournisseur.titre, balise: KfTypeDeBaliseHTML.b },
            ` créé le ${TexteOutils.date.en_chiffresHMin(fournisseur.date0)}`
            + ` et ${texte.état} depuis le ${TexteOutils.date.en_chiffresHMin(fournisseur.dateEtat)} ${texte.action}.`
        );
        if (texte.annulation) {
            étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
            étiquette.ajouteTextes(texte.annulation);
        }
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.active(fournisseur, active),
            actionSiOk: (créé: { dateEtat: Date }) => {
                fournisseur.dateEtat = créé.dateEtat;
                fournisseur.etat = active ? EtatRole.actif : EtatRole.inactif;
                fournisseur.vueTableLigne.quandItemModifié();
            }
        };
        const bouton = Fabrique.bouton.attenteDeColonne(nom + KeyId.texteDeKey(fournisseur),
            contenu, apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, bootstrapType, étiquettes)
        );
        return bouton;
    }

}
