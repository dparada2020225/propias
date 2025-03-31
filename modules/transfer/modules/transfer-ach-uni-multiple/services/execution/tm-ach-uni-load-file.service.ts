import { Injectable } from '@angular/core';
import { LoadSheetFileService } from 'src/app/service/common/load-sheet-file.service';
import { TmAchUniFileValidationsService } from './tm-ach-uni-file-validations.service';
import { ITMAchiUniValidateDataFile, ITMAchUniCreditInfo, ITMAchUniFileValidationResponse, ITMAchUniInitLoadFileParameters } from '../../interfaces/ach-uni-load-file.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniLoadFileService {

  constructor(
    private loadSheetFile: LoadSheetFileService,
    private fileValidationService: TmAchUniFileValidationsService,
    private http: HttpClient
  ) { }

  async loadExcelFile(parameters: ITMAchUniInitLoadFileParameters) {
    const {
      file,
      emitter,
      settings,
      formValues,
      targetAccountList,
      targetAccountListMap
    } = parameters;
    try {
      const workSheetValues = await this.loadSheetFile.excelTUniMultiple(file);

      return this.fileValidationService.validate({
        file,
        formValues,
        settings,
        targetAccountList,
        workSheetRawValues: workSheetValues,
        emitter,
        targetAccountListMap,
      });
    } catch (error) {
      return {
        message: 'error:upload_file',
        fileRaw: file,
        fileLoaded: null,
        isSuccessLoadFile: false,
      } as ITMAchUniFileValidationResponse;
    }
  }

  async loadCsvFile(parameters: ITMAchUniInitLoadFileParameters) {
    const {
      file,
      emitter,
      settings,
      formValues,
      targetAccountList,
      targetAccountListMap,
    } = parameters;

    try {
      const csvValues = await this.loadSheetFile.csvTAchUniMultiple(file);

      return this.fileValidationService.validate({
        file,
        formValues,
        settings,
        targetAccountList,
        workSheetRawValues: csvValues,
        emitter,
        targetAccountListMap,
      });
    } catch (error) {
      return {
        message: 'error:upload_file',
        fileRaw: file,
        fileLoaded: null,
        isSuccessLoadFile: false,
      } as ITMAchUniFileValidationResponse;
    }
  }

  validateFileServer(data: ITMAchiUniValidateDataFile){
    return this.http.post('/v1/massive-transferences/uni/validate', data);
  }

}
