import { Arbre } from './arbre';
import { Noeud } from './noeud';

function créeNoeud(
  defEnfants: any,
  objet: (def: any) => any)
  : Noeud {
  if (defEnfants.enfants) {
    let noeud = new Noeud;
    noeud.objet = objet(defEnfants);
    noeud.objet['noeud'] = noeud;
    defEnfants.enfants.forEach(
      e => {
        const n = créeNoeud(e, objet);
        if (n) {
          if (noeud) {
            noeud.Ajoute(n);
          }
        } else {
          noeud = null;
        }
      }
    );
    return noeud;
  } else {
    return null;
  }
}

export function ArbreFabrique(
  defEnfants: any,
  objet: (def: any) => any)
  : Arbre {
  const racine = créeNoeud(defEnfants, objet);
  if (racine) {
    const arbre = new Arbre;
    arbre.enracine(racine);
    return arbre;
  } else {
    return null;
  }
}
