import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import { TRow } from '../../modules/transfer/modules/bulk-transfer/models/bulk-transfer.interface';
import {
  ILoadCsvFileParameters,
  IParseWorkSheetValues,
  parseArrayToObjLoadedFile
} from '../../models/load-sheet.file.interface';
import { ESides } from '../../modules/transfer/interface/table.enum';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class LoadSheetFileService {

  constructor(
    private utils: UtilService,
  ) {
  }

  async excel(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workBook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workBook.SheetNames[0];
      const sheetData: Array<Array<TRow>> = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
        header: 1,
        skipHidden: true,
        blankrows: false,
        defval: null
      });
      return sheetData;
    } catch (error) {
      return []
    }
  }

  async excelTUniMultiple(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workBook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workBook.SheetNames[0];
      const sheetData: Array<Array<TRow>> = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
        header: 1,
        skipHidden: true,
        blankrows: false,
        defval: null
      });
      const data = sheetData.map((row, index) => [...row, index + 1]);
      return data;
    } catch (error) {
      return []
    }
  }


  async csv(file: File): Promise<Array<Array<TRow>>> {
    try {
      const data = await file.text();
      if (!data || data === '') return [];
      const text = data.split('\n');
      return text.map(item => this.customSplit(item)).filter(x => x.filter(value => value).length > 0)
    } catch (error: any) {
      return [];
    }
  }

  async csvTAchUniMultiple(file: File): Promise<Array<Array<TRow>>> {
    try {
      const data = await file.text();
      if (!data || data === '') return [];
      const text = data.split('\n');
      return text.map(item => this.customSplitUni(item)).filter(x => x.filter(value => value).length > 0).map((row, index) => [...row, index + 1]);
    } catch (error: any) {
      return [];
    }
  }

  private customSplitUni(line: string) {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    return line.split(regex).map(value => value
      .replace(/"/g, '')
      .replace(',', '.')
      .replace('\r', ''));
  }

  createFileToUpload(parameters: ILoadCsvFileParameters): Promise<FormData> {
    const { fileStructure, fileName, typeFile } = parameters;
    const type = `text/${typeFile}`;

    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([fileStructure], { type });
        const formData = new FormData();
        formData.append('uploadFile', blob, fileName);
        resolve(formData);
      } catch (error) {
        reject(new Error(`fatal error: create ${fileName} file`))
      }
    });
  }

  private getDateTimeToFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return {
      date: `${year}${month}${day}`,
      time: `${hours}${minutes}${seconds}`,
    }
  }

  buildFileNameForBPPayroll(fileName: string) {
    const { date, time } = this.getDateTimeToFileName();

    return `${fileName}.${date}${time}.pla`;
  }

  buildFileNameWithWebPattern(extension: string, fileName:string) {
    return `${fileName}`
  }

  private  readonly INITIAL_LETTER: string = "I";

  buildFileNameWithWebPatternPayPayroll(extension: string, fileName: string){
    return fileName
  }

  private customSplit(line: string) {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    return line.split(regex).map(value => value
      .replace(/"/g, '')
      .replace(',', '.')
      .replace('\r', ''));
  }

  private parseArrayToObj<T = any>(parameters: parseArrayToObjLoadedFile): T {
    const { list, keys, parseFileValues, setValueInNull } = parameters;

    return list.reduce((prev, current, i) => {
      return { ...prev, [keys[i]]: !current ? setValueInNull(keys[i]) : parseFileValues(current, keys[i]) };
    }, {} as T);
  }

  parseWorkSheetValueIntoObjStructure<T = any>(parameters: IParseWorkSheetValues): T {
    const { list } = parameters;
    return list.reduce((prev: any, current) => {
      const parser = this.parseArrayToObj<T>({
        ...parameters,
        list: current,
      });

      prev.push(parser);
      return prev;
    }, [] as unknown as T);
  }

  buildFileNameWithCorrelative(correlative: string, prefix: string, ext: string) {
    const correlativeParsed = this.getFileNameWithCorrelative(correlative);
    return `${prefix}${correlativeParsed}${ext}`;
  }

  getFileNameWithCorrelative(correlative: string) {
    return this.utils.filledSideStrings(String(correlative), '0', 7, ESides.LEFT);
  }
}
