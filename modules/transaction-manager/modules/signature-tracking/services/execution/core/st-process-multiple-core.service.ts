import { Injectable } from '@angular/core';
import { EProfile } from '../../../../../../../enums/profile.enum';
import { UtilService } from '../../../../../../../service/common/util.service';
import { StProcessMultipleBpService } from './bp/st-process-multiple-bp.service';
import { StProcessMultipleBipaService } from './bipa/st-process-multiple-bipa.service';
import { IStProcessMultipleCoreParameters } from '../../../interfaces/st-process-multiple.interface';
import { StProcessMultipleSvService } from './bisv/st-process-multiple-sv.service';

@Injectable({
  providedIn: 'root'
})
export class StProcessMultipleCoreService {
  constructor(
    private utils: UtilService,
    private stProcessMultipleTransactionManager: StProcessMultipleBpService,
    private stProcessMultipleTransactionBipaManager: StProcessMultipleBipaService,
    private stProcessMultipleTransactionBiesManager: StProcessMultipleSvService,
  ) { }

  executeProcessMultiple(parameters: IStProcessMultipleCoreParameters) {
    const processManagerByProfile = {
      [EProfile.HONDURAS]: () => this.executeProcessMultipleForBPProfile(parameters),
      [EProfile.SALVADOR]: () => this.executeProcessMultipleForSVProfile(parameters),
      [EProfile.PANAMA]: () => this.executeProcessMultipleForSBipaProfile(parameters),
    }

    const execute = processManagerByProfile[this.utils.getProfile()];

    if (!execute) return [];

    return execute();
  }

  private executeProcessMultipleForBPProfile(parameters: IStProcessMultipleCoreParameters) {
    const {
      transactionList,
      achSettings,
      achAssociatedAccounts,
      achAssociatedAccountsMap,
      signatureType,
    } = parameters;

    return transactionList.map(transaction => this.stProcessMultipleTransactionManager.executeTransactionMap({
      signatureType,
      achSettings,
      achAssociatedAccounts,
      transactionSelected: transaction,
      achAssociatedAccountsMap,
    }));
  }

  private executeProcessMultipleForSVProfile(parameters: IStProcessMultipleCoreParameters) {
    const {
      transactionList,
      achSettings,
      achAssociatedAccounts,
      achAssociatedAccountsMap,
      signatureType,
    } = parameters;

    return transactionList.map(transaction => this.stProcessMultipleTransactionBiesManager.executeTransactionMap({
      signatureType,
      achSettings,
      achAssociatedAccounts,
      transactionSelected: transaction,
      achAssociatedAccountsMap,
    }));
  }

  private executeProcessMultipleForSBipaProfile(parameters: IStProcessMultipleCoreParameters) {
    console.log(parameters);
    return [];
  }
}
