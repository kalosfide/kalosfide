/**
 * KfTypeDeComposant
 * Détermine l'Angular template qui rend le composant
 */
export enum KfTypeDeComposant {
    /**
     * elements (ie composants non conteneurs)
     *  le type est fixée dans le constructeur
     */
    /**
     * descriptifs (sans valeur)
     */
    aucun = 'aucun',
    bouton = 'bouton',
    etiquette = 'etiquette',
    vuejson = 'vue-json',
    lien = 'lien',
    icone = 'icone',
    image = 'image',
    texte = 'texte',

    table = 'table',

    ngbDropdown = 'ngbDropdown',
    ngbDropdownGroup = 'ngbDropdownGroup',
    ngbPopover = 'ngbPopover',
    fichierSauve = 'fichier-sauve',
    fichier = 'fichier',
    fichierCharge = 'fichier-charge',

    /**
     * avec valeur
     */
    caseacocher = 'caseacocher',
    listederoulante = 'listederoulante',
    input = 'input',
    radio = 'radio',
    radios = 'radios',
    /**
     * conteneurs
     */
    groupe = 'groupe',
    vuetable = 'vuetable',
    ul = 'ul',
    b_btn_group = 'b_btn_group',
    b_btn_toolbar = 'b_btn_toolbar',

    liste = 'liste',
    listeEditeur = 'listeEditeur',
    navbar = 'navbar',
    menu = 'menu',
    sousmenu = 'sousmenu',
    dialogue = 'dialogue',
}

/**
 * Détermine l'Angular abstractControl et le type de la valeur du composant
 */
export enum KfTypeDeValeur {
    /**
     * elements descriptifs, menu, sous-menu (sans valeur)
     */
    aucun,
    /**
     * entrées (type de la valeur: boolean | number | string)
     */
    avecEntree,
    /**
     * input nombre (type de la valeur: number)
     */
    avecEntreeInputNombre,
    /**
     * liste (type de la valeur: any[])
     *  le type est fixé dans le constructeur
     */
    avecListe,
    /**
     * groupe (type de la valeur: any)
     *  le type fixé dans le constructeur devient aucun si tous les contenus sont de type aucun
     */
    avecGroupe,
}

export type KfTypeDeBouton = 'button' | 'reset' | 'submit'

export enum KfTypeDActionDeListe {
    ajouter = 'ajouter',
    editer = 'editer',
    monter = 'monter',
    descendre = 'descendre',
    supprimer = 'supprimer',
    effacerTout = 'effacerTout',
}

export enum KfTypeDeBaliseHTML {
    aucun = 'aucun',
    b = 'b',
    div = 'div',
    fieldset = 'fieldset',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
    i = 'i',
    label = 'label',
    legend = 'legend',
    p = 'P',
    pre = 'pre',
    span = 'span',
    small = 'small',
    strong = 'strong',
}
