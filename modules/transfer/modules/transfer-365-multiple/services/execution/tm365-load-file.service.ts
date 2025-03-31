import { Injectable } from '@angular/core';
import { LoadSheetFileService } from '../../../../../../service/common/load-sheet-file.service';
import { ITM365FileValidationResponse, ITM365InitLoadFileParameters } from '../../interfaces/load-file.interface';
import { Tm365FileValidationsService } from './tm365-file-validations.service';
import {
  ISPPBuildCsvFileParametersSV
} from '../../../../../payroll/manager-payroll/interfaces/pmp-upload-file.interface';
import { fileValidationsParameters } from '../../interfaces/file-validations.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class Tm365LoadFileService {

  constructor(
    private loadSheetFile: LoadSheetFileService,
    private fileValidationService: Tm365FileValidationsService,
    private utilWorkFlow: UtilWorkFlowService,
    private utils: UtilService,
  ) { }

  async loadExcelFile(parameters: ITM365InitLoadFileParameters) {
    const {
      file,
      emitter,
      settings,
      formValues,
    } = parameters;

    try {
      const workSheetValues = await this.loadSheetFile.excel(file);

      return this.fileValidationService.validate({
        file,
        formValues,
        settings,
        workSheetRawValues: workSheetValues,
        emitter,
      });
    } catch (error) {
      return {
        message: 'error:upload_file',
        fileRaw: file,
        fileLoaded: null,
        isSuccessLoadFile: false,
      } as ITM365FileValidationResponse;
    }
  }

  async loadCsvFile(parameters: ITM365InitLoadFileParameters) {
    const {
      file,
      emitter,
      settings,
      formValues,
    } = parameters;

    try {
      const csvValues = await this.loadSheetFile.csv(file);
      return this.fileValidationService.validate({
        file,
        formValues,
        settings,
        workSheetRawValues: csvValues,
        emitter,
      });
    } catch (error) {
      return {
        message: 'error:upload_file',
        fileRaw: file,
        fileLoaded: null,
        isSuccessLoadFile: false,
      } as ITM365FileValidationResponse;
    }
  }

  buildFileToUpload(parameters: fileValidationsParameters) {
    const { fileParsed } = parameters;

    const creditsMapped = fileParsed.map(register => {
      const bankCode = register.bankCode.padStart(4, '0');
      const productCode = register.product.toString().padStart(2, '0');
      const currentAmount = this.utilWorkFlow.rebuildAmount(String(register.amount));
      const accountNumber = this.utils.fillStrings(register.account, ' ', 17);

      const part1 = `${bankCode}${productCode}${register.currency}${accountNumber}`
      const part2 = `${currentAmount}${register.comment}`;
      return `${part1}${part2}`;
    });

    return creditsMapped.join('\r\n');
  }
}
