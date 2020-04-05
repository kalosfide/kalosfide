import { PageDef } from '../page-def';
import { DataService } from 'src/app/services/data.service';

export interface IDataKeyComponent {
    pageDef: PageDef;
    iservice: DataService;
}
