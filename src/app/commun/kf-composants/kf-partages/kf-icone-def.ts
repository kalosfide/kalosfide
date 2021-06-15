export interface IKfCollectionIcone {
    classe: string;
    préfixe: string;
}
export const FontAwesomeIcones: IKfCollectionIcone = { classe: 'fas', préfixe: 'fa' };
export const FontAwesomeRegularIcones: IKfCollectionIcone = { classe: 'far', préfixe: 'fa' };
export const BootstrapIcones: IKfCollectionIcone = { classe: 'bi', préfixe: 'bi' };

export interface IKfIconeDef {
    collection: IKfCollectionIcone;
    nom: string;
}
