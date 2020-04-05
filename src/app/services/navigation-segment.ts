
/**
 * Pour qu'une route ait un NavigationSegment, elle doit avoir dans sa définition:
 *  data: { pageDef: (pageDef à afficher) }
 * Pour que le NavigationSegment d'une route parent inclue les données du pageDef de son descendant par défaut (path = '' redirigé),
 * la route du descendant doit avoir dans sa définition:
 *  data: { pageDef: (pageDef du descendant), estEnfantPathVide: true }
 * S'l y a plusieurs redirection de path vide '', entre le parent et le descendant par défaut, le parent doit avoir:
 *  data: { pageDef: (pageDef du parent), pageDefEnfantPathVide: (pageDef du descendant) }
 *
 * Pour utiliser une propriété d'un objet résolu à la place du title et du titre de la pageDef, la route doit avoir:
 *  resolve: { objet: ObjetResolverService }
 *  data: { pageDef: (pageDef du segment url), cheminDeTitre: ['objet', 'prop1', 'prop2', ...] }
 * titre et titre seront remplacés par data.objet.prop1.prop2....
 * Pour utiliser une propriété d'un objet résolu à la place du paramétre d'une route paramétrée segment/:key, la route doit avoir:
 *  resolve: { objet: ObjetResolverService }
 *  data: { pageDef: (pageDef du segment url), cheminDeKey: ['objet', 'prop1', 'prop2', ...] }
 * Les parties de titre et titre correspondant à la valeur du paramètre seront remplacés par data.objet.prop1.prop2....
 *
 * ATTENTION: Une propriété du data d'une route parent peut être transmise aux datas des routes enfant. Pour éviter ça, il faut
 * effacer explicitement la propriété dans le data de l'enfant.
 * Pour qu'une route suivant une route avec NavigationSegment n'ait pas de NavigationSegment, elle doit avoir dans sa définition:
 *  data: { pageDef: undefined }
 */
export class NavigationSegment {
    title: string;
    titre: string;
    path: string;
}
