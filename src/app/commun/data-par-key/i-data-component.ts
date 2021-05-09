import { PageDef } from '../page-def';
import { DataService } from 'src/app/services/data.service';

export interface IDataComponent {
    pageDef: PageDef;
    iservice: DataService;
}
