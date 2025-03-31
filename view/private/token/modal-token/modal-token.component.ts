import {MaskOptionsBuilder} from '@adf/components';
import {StorageService} from '@adf/security';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {EProfile} from 'src/app/enums/profile.enum';
import {TypeTokenEnum} from 'src/app/enums/token.enum';
import {ISettingData} from 'src/app/models/setting-interface';
import {IServiceResponse} from 'src/app/models/token.interface';
import {ITokenResponse} from 'src/app/modules/loan/interfaces/token.interface';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TokenService} from 'src/app/service/private/token/token.service';
import {environment} from 'src/environments/environment';
import {HttpStatusCode} from '../../../../enums/http-status-code.enum';
import {UtilService} from '../../../../service/common/util.service';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';

export enum ETypeTokenModal {
    SMS = 'S',
}

@Component({
    selector: 'byte-modal-token',
    templateUrl: './modal-token.component.html',
    styleUrls: ['./modal-token.component.scss'],
})
export class ModalTokenComponent implements OnInit {
    private profile: string = environment.profile;
    sms = ETypeTokenModal.SMS;
    settingData!: ISettingData;
    tokenModalTransfer!: FormGroup;
    tokenValue: string = '';
    result: boolean = false;
    typeAlert: string | undefined;
    messageAlert: string | undefined;
    step: number = 1;
    minLength!: number;
    maxLength!: number;
  timeOut: NodeJS.Timeout | undefined = undefined;
    regexImask = new MaskOptionsBuilder()
        .mask({mask: /^(\d)*$/})
        .build();

    timeHiddenAlert = environment.profile === EProfile.PANAMA ? 10000 : 5000;

    @Input() tokenType: string | null = this.utils.getTokenType();
    @Input() typeTransaction: string | null = null;
    @Input() user: string | null = null;
    @Input() serviceResponse: IServiceResponse | null = null;
    @Input() executeService!: (token?: string) => Observable<any>;

    get controlName(): FormControl {
        return this.tokenModalTransfer.get('token') as FormControl;
    }

    get messageBtnMessage(): string {

        const mapMessage = {
            [EProfile.SALVADOR]: 'btn.confirm',
            [EProfile.PANAMA]: 'btn.confirm',
            [EProfile.HONDURAS]: 't.continue',
        }

        return mapMessage[this.profile] ?? 't.continue'

    }

    constructor(
        public activeModal: NgbActiveModal,
        private tokenService: TokenService,
        private storage: StorageService,
        private translateService: TranslateService,
        private fb: FormBuilder,
        private storageService: StorageService,
        private utils: UtilService,
        private parametersService: ParameterManagementService,
        private readonly featureManagerService: FeatureManagerService
    ) {
    }

    ngOnInit(): void {
        this.formValidator();
    }

    hiddenTokenAlert() {
        this.timeOut = setTimeout(() => {
            this.showAlert();
        }, this.timeHiddenAlert);
    }

    formValidator() {
        this.settingData = JSON.parse(this.storage.getItem('securityParameters'));

        switch (this.tokenType) {
            case TypeTokenEnum.SMS:
                this.generateToken();
                this.minLength = this.settingData.token.sms.min;
                this.maxLength = this.settingData.token.sms.max;
                break;
            case TypeTokenEnum.FISICO:
                this.minLength = this.settingData.token.physical.min;
                this.maxLength = this.settingData.token.physical.max;
                break;
            case TypeTokenEnum.SOFT_TOKEN: 
            case TypeTokenEnum.SOFT_TOKEN_DEVEL:
                this.maxLength = this.settingData.token['soft-token']?.max ?? 6;
                this.minLength = this.settingData.token['soft-token']?.min ?? 6;
                break;
            default:
                this.minLength = 1;
                this.maxLength = 12;
                break;
        }

        this.tokenModalTransfer = this.fb.group({
            token: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.minLength),
                    Validators.maxLength(this.maxLength),
                ],
            ],
        });

    };


    get descriptionRegional() {
        const a = {
            bipa: 'content-modal-transfer-bipa',
            bisv: 'content-modal-transfer-bisv',
            banpais: 'content-modal-transfer-banpais',
        };

        return a[environment.profile] || a.banpais;
    }

    nextStep() {
        if (this.step <= 0) {
            this.step = ++this.step;
            this.hideAlert();
        }
    }

    hideAlert() {
        this.showAlert();
    }

    showAlert(type?: string, message?: string) {
        this.typeAlert = type;
        this.messageAlert = message;
    }

    close() {
        this.activeModal.close(null);
    }

    validCamp(camp: string) {
        return this.tokenModalTransfer.get(camp)?.errors && this.tokenModalTransfer.get(camp)?.touched;
    }

    sendToken() {
        if (!this.tokenModalTransfer.get('token')?.valid) {
            this.tokenModalTransfer.markAllAsTouched();
            return;
        }

        this.tokenValue = this.tokenModalTransfer.get('token')?.value;

        this.sendParameters()

        if (!this.executeService) {
            this.handleValidateToken();
            return;
        }

        this.handleValidateTokenByService();
    }

    handleValidateToken() {
        this.utils.showPulseLoader();
        const handlerValidationToken = this.handlerValidationToken()
        //this.tokenService.getTokenValidate(this.tokenValue)
        handlerValidationToken
            .pipe(finalize(() => this.utils.hidePulseLoader()))
            .subscribe({
                next: () => {
                    this.storageService.addItem("ne", this.tokenValue);
                    this.activeModal.close(true);
                },
                error: (error: HttpErrorResponse) => {
                    this.showAlert('error', error?.error?.message);
                }
            })
    }

    handlerValidationToken(): Observable<any> {
        const tokenValue = this.tokenValue;
        const profile: string = environment.profile;
        const featureManager = this.featureManagerService.stknBisvAllow();
    
        if ((this.tokenType === TypeTokenEnum.SOFT_TOKEN_DEVEL) && (EProfile.SALVADOR === profile) && (featureManager)) {
          return this.tokenService.validateOTPStokenSV(tokenValue)
        }
    
        return this.tokenService.getTokenValidate(tokenValue)
      }
    

    onSubmit() {
        this.sendToken();
    }

    generateToken() {
        this.utils.showPulseLoader();
        this.tokenService.tokenGenerate(this.typeTransaction ?? '', this.user!)
            .subscribe({
                next: (data: ITokenResponse) => {
                    this.utils.hidePulseLoader();
                    const message = this.translateService.instant('t_ok_send_token', {
                        digitCode: data?.digitCode,
                    });
                    this.showAlert('success', message);
                    this.hiddenTokenAlert();
                },
                error: () => {
                    this.utils.hidePulseLoader();
                    this.showAlert('error', 't_could_not_send_token');
                }
            });
    }

    sendParameters() {
        this.parametersService.sendParameters({
            tokenMethodSecurity: this.tokenValue
        })
    }

    handleValidateTokenByService() {
        this.executeService(this.tokenValue).subscribe(data => {
            if (data?.hasOwnProperty('error') && data?.status === HttpStatusCode.INVALID_TOKEN) {
              if (this.timeOut) {
                clearTimeout(this.timeOut);
              }

                this.utils.hideLoader();
                this.utils.hidePulseLoader();
                this.showAlert('error', 'invalid_token');
                return;
            }

            this.activeModal.close({
                ...data,
            });
        });
    }
}
