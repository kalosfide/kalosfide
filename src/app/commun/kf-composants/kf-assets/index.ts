const KfImages: string[] = [
    'category.png',
    'categoryopen.png',
    'categoryclosed.png',
    'categorytree.png',
    'document.png',
    'document.png',
];

function extraitExtension(nomAvec: string, nomSans: string): string {
    // tslint:disable-next-line:prefer-const
    let pos: number;
    const trouvé = nomAvec.includes('.', pos);
    if (trouvé) {
        nomSans = nomAvec.slice(0, pos - 1);
        return nomAvec.slice(pos + 1);
    }
}
export function KfConstruitUrl(nomFichier: string): string {
    // tslint:disable-next-line:prefer-const
    let nomSansExtension: string;
    const extension = extraitExtension(nomFichier, nomSansExtension);
    function compare(nom: string): boolean {
        // tslint:disable-next-line:prefer-const
        let ns: string;
        const e = extraitExtension(nom, ns);
        return ns === nomSansExtension && e === extension;
    }
    if ((extension && KfImages.find(compare)) || KfImages.find(n => n === nomFichier)) {
        return '/kf-composants/kf-assets/' + nomFichier;
    }
}
