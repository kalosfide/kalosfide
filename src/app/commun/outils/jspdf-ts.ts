import * as JsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions, CellDefinition, ContentConfig } from 'jspdf-autotable';
import { IKfVueTable } from '../kf-composants/kf-vue-table/kf-vue-table';
import { KfTypeDeComposant } from '../kf-composants/kf-composants-types';
import { KfEtiquette } from '../kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { IKfVueTableLigne } from '../kf-composants/kf-vue-table/kf-vue-table-ligne';

export class JsPdfTs {
    doc: any;
    constructor() {
        this.doc = new JsPDF();
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

    text(text: string, marge: number, y: number, justify?: 'left' | 'center' | 'right') {
        let offset = 0;
        switch (justify) {
            case 'center':
                offset = (this.pageWidth - 2 * marge - this.textWidth(text)) / 2;
                break;
            case 'right':
                offset = this.pageWidth - 2 * marge - this.textWidth(text);
                break;
            default:
                break;
        }
        this.doc.text(text, marge + offset, y);
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

    contentConfig(vueTable: IKfVueTable): ContentConfig {
        const ligneDefs = (lignes: IKfVueTableLigne[]) => {
            console.log(lignes.map(l => {
                return l.cellules.map(c => {
                    return {
                        index: c.colonne.index,
                        composant: c.composant,
                        colSpan: c.colSpan,
                        rowSpan: c.rowSpan,
                        texte: c.composant.texte,
                        nePasAfficher: c.colonne.nePasAfficher,
                    };
                });
            }));
            return lignes.map(l => {
                return l.cellules.map(c => {
                    if (c.composant.type === KfTypeDeComposant.etiquette) {
                        const e = (c.composant as KfEtiquette);
                        const def: CellDefinition = {
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
        const contentConfig: ContentConfig = {
            body: ligneDefs(vueTable.lignes),
        };
        if (vueTable.lignesEnTete) {
            contentConfig.head = ligneDefs(vueTable.lignesEnTete);
        }
        if (vueTable.lignesBilan) {
            contentConfig.foot = ligneDefs(vueTable.lignesBilan);
        }
        return contentConfig;
    }
}
