import { IKeyUid } from './key-uid/i-key-uid';
import { IKeyUidRno } from './key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from './key-uid-rno-no/i-key-uid-rno-no';

export type IDataKey = IKeyUid | IKeyUidRno | IKeyUidRnoNo;
