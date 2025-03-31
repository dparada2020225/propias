import { Component, Input } from '@angular/core';
import { OnResize } from '../../../../../shared/classes/on-risize';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface IModalDetailData {
  title: string;
  data: { label: string, value: string }[];
}

@Component({
  selector: 'byte-bt-upload-file-helper-modal',
  templateUrl: './bt-upload-file-helper-modal.component.html',
  styleUrls: ['./bt-upload-file-helper-modal.component.scss']
})

export class BtUploadFileHelperModalComponent extends OnResize  {

  constructor(
    private activeModal: NgbActiveModal

  ) {
    super();
  }

  @Input() title: string = 'upload_file_recommendations';

  @Input() dataHeading: IModalDetailData = {
    title: 'title.heading',
    data:
      [
        {
          label: '',
          value: 'bulk_transfer:heading_column_a'
        },
        {
          label: '',
          value: 'bulk_transfer:heading_column_b'
        },
        {
          label: '',
          value: 'bulk_transfer:heading_column_c'
        },
        {
          label: '',
          value: 'bulk_transfer:heading_column_d'
        },
        {
          label: '',
          value: 'bulk_transfer:heading_column_e'
        }
      ]
  };

  @Input() dataDetail: IModalDetailData = {
    title: 'title.detail',
    data:
      [
        {
          label: '',
          value: 'bulk_transfer:detail_column_a'
        },
        {
          label: '',
          value: 'bulk_transfer:detail_column_b'
        },
        {
          label: '',
          value: 'bulk_transfer:detail_column_c'
        },
        {
          label: '',
          value: 'bulk_transfer:detail_column_d'
        },
        {
          label: '',
          value: 'bulk_transfer:detail_column_e'
        }
      ]
  };

  close() {
    this.activeModal.close();
  }

}
