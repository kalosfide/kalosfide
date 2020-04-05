
export type TypeCLF = 'commande' | 'livraison' | 'facture';
export const TypesCLF: TypeCLF[] = ['commande', 'livraison', 'facture'];

export function typeCLF(apiDocType: string): TypeCLF {
    return apiDocType === 'C' ? 'commande' : apiDocType === 'L' ? 'livraison' : apiDocType === 'F' ? 'facture' : undefined;
}
export function apiType(type: TypeCLF): string {
    return type === 'commande' ? 'C' : type === 'livraison' ? 'L' : type === 'facture' ? 'F' : undefined;
}

