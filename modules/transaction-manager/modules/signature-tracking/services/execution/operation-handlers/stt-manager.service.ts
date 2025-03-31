import { Injectable } from '@angular/core';
import { SttAuthorizeService } from './stt-authorize.service';
import { SttDeleteService } from './stt-delete.service';
import { SttProcessService } from './stt-process.service';
import { SttRejectService } from './stt-reject.service';
import { SttSendService } from './stt-send.service';
import { IProcessSTOperations, IProcessSTOperationsWithToken } from '../../../interfaces/st-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class SttManagerService {

  constructor(
    private sendService: SttSendService,
    private rejectService: SttRejectService,
    private authorizeService: SttAuthorizeService,
    private processService: SttProcessService,
    private deleteService: SttDeleteService,
  ) { }

  handleExecuteDelete(properties: IProcessSTOperations) {
    return this.deleteService.deleteExecute(properties);
  }

  handleExecuteReject(properties: IProcessSTOperations) {
    return this.rejectService.rejectExecute(properties);
  }

  handleExecuteSend(properties: IProcessSTOperations) {
    return this.sendService.sendExecute(properties);
  }

  handleExecuteProcess(properties: IProcessSTOperations) {
    return this.processService.processExecute(properties);
  }

  handleExecuteAuthorize(properties: IProcessSTOperations) {
    return this.authorizeService.authorizeExecute(properties);
  }

  handleExecuteProcessWithToken(parameters: IProcessSTOperationsWithToken) {
    return this.processService.processExecuteWithToken(parameters);
  }
}
