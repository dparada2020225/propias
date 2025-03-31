import {SPPView} from "../enums/pmp-view.enum";
import {ISPPFStructureParsed} from "./pmp-upload-file.interface";
import {SPPMTableBody} from "./sppd-manually.interface";

export interface IexecuteInitInformationsParameter {
  currentView: SPPView;
  fileParsed: ISPPFStructureParsed|null;
  registers: Array<SPPMTableBody>;
}
