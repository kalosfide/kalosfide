import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions, ContentSettings, CellDef, RowInput } from 'jspdf-autotable';
import { IKfVueTable } from '../kf-composants/kf-vue-table/kf-vue-table';
import { KfTypeDeComposant } from '../kf-composants/kf-composants-types';
import { KfEtiquette } from '../kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { IKfVueTableLigne } from '../kf-composants/kf-vue-table/kf-vue-table-ligne-base';

export class JsPdfTs {
    doc: any;
    constructor() {
        this.doc = new jsPDF();
    }

    get pageWidth(): number {
        return this.doc.internal.pageSize.width;
    }

    textWidth(texte: string): number {
        return this.doc.getStringUnitWidth(texte) * this.doc.internal.getFontSize() / this.doc.internal.scaleFactor;
    }

    get fontSize(): number {
        return this.doc.getFontSize();
    }
    set fontSize(size: number) {
        this.doc.setFontSize(size);
    }

    text(text: string, marge: number, y: number, justify?: 'left' | 'center' | 'right'): number {
        const width = this.textWidth(text);
        let offset = 0;
        switch (justify) {
            case 'center':
                offset = (this.pageWidth - 2 * marge - width) / 2;
                break;
            case 'right':
                offset = this.pageWidth - 2 * marge - width;
                break;
            default:
                break;
        }
        this.doc.text(text, marge + offset, y);
        return width;
    }

    autoTable(options: UserOptions) {
        this.doc.autoTable(options);
    }

    previousAutoTableFinalY(): number {
        return this.doc.previousAutoTable.finalY;
    }

    save(filename?: string) {
        this.doc.save(filename);
    }

    output(type: 'arraybuffer'
        | 'blob' | 'bloburi' | 'bloburl'
        | 'datauristring' | 'dataurlstring' | 'datauri' | 'dataurl'
        | 'dataurlnewwindow' | 'pdfobjectnewwindow' | 'pdfjsnewwindow'): any {
        return this.doc.output(type);
    }

    contentConfig(vueTable: IKfVueTable): {
        head?: RowInput[],
        body: RowInput[],
        foot?: RowInput[]
    } {
        const ligneDefs: (lignes: IKfVueTableLigne[]) => RowInput[] = (lignes: IKfVueTableLigne[]) => {
            console.log(lignes.map(l => {
                return l.cellulesVisibles.map(c => {
                    return {
                        index: c.colonne.index,
                        composant: c.contenu,
                        colSpan: c.colSpan,
                        rowSpan: c.rowSpan,
                        texte: c.contenu.texte,
                        nePasAfficher: c.colonne.nePasAfficher,
                    };
                });
            }));
            return lignes.map(l => {
                return l.cellulesVisibles.map(c => {
                    if (c.contenu.type === KfTypeDeComposant.etiquette) {
                        const e = (c.contenu as KfEtiquette);
                        const def: CellDef = {
                            content: e.texte ? e.texte : '',
                        };
                        if (c.colSpan) {
                            def.colSpan = c.colSpan;
                        }
                        if (c.rowSpan) {
                            def.rowSpan = c.rowSpan;
                        }
                        return def;
                    }
                });
            });
        };
        const contentConfig: {
        head?: RowInput[],
        body: RowInput[],
        foot?: RowInput[]
        } = {
            body: ligneDefs(vueTable.lignes),
        };
        if (vueTable.enTete) {
            contentConfig.head = ligneDefs(vueTable.enTete.lignes);
        }
        if (vueTable.bilan) {
            contentConfig.foot = ligneDefs(vueTable.bilan.lignes);
        }
        return contentConfig;
    }
}
