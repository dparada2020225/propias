import { OperationBuilder, SmartcoreCheckpointService, StorageService, TransactionBuilder } from '@adf/security';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile, UserInformation } from 'src/app/models/security-option-modal';
import { SmartCoreService } from '../../common/smart-core.service';

import { TokenizerAccountsService } from '../../token/tokenizer-accounts.service';


/**
 * @author Fabian Serrano
 * @date 10/05/21
 *
 * service that allows us to obtain the value of the hotp
 */
@Injectable(
    { providedIn: 'root' }
)
export class SecurityOptionService {

    private profile: Profile = new Profile();
    private info!: UserInformation;
    private phone!: string;
    private simpleNavbar: boolean = true;

    constructor(
        private smartCore: SmartCoreService,
        private httpClient: HttpClient,
        private storageService: StorageService,
        private tokenizerEncrypt: TokenizerAccountsService,
        private smartcoreCheckpointService: SmartcoreCheckpointService
    ) { }

    setProfile(profile) {
        this.profile = profile;
    }

    get getProfile(): Profile {
        return this.profile;
    }

    setPhone(phone: string) {
        this.phone = phone;
    }

    get getPhone() {
        return this.phone;
    }

    setSimpleNavbar(simpleNavbar: boolean) {
        this.simpleNavbar = simpleNavbar;
    }

    get getSimpleNavbar() {
        return this.simpleNavbar;
    }

    getPasswordPeriod(): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/password-periods');
    }
    getPasswordPeriodExposed(): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/password-periods');
    }
    getPhoneCompanies(): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/phone-companies');
    }
    getPhoneCompaniesExposed(): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/phone-companies');
    }
    updateContact(phone: string, codeOperator: string, email: string, sendSms: boolean): Observable<any> {

        const operation = this.callSmartCore();

        let json = { phone, codeOperator, email, sendSms };
        let jsonStringify = JSON.stringify(json);

        let jtest = {
            data: this.tokenizerEncrypt.tokenizer(jsonStringify)
        }

        let headers = new HttpHeaders();

        if (this.smartcoreCheckpointService.useSmartidV5) {
            headers = this.smartcoreCheckpointService.setCheckpointHeaderEncryted(operation, headers);
        }

        return this.httpClient.post('/v1/sec-profile/new-security-profile/update-contact', jtest, {
            headers: headers
        });
    }

    updateContactExposed(phone: string, codeOperator: string, email: string, sendSms: boolean, areaCode: string): Observable<any> {

        this.callSmartCore();

        let json = { phone, codeOperator, email, sendSms, areaCode };
        let jsonStringify = JSON.stringify(json);

        console.log(json);

        let jtest = {
            data: this.tokenizerEncrypt.tokenizer(jsonStringify)
        }

        return this.httpClient.post('/v1/sec-profile/new-security-profile/passless/update-contact', jtest);
    }

    callSmartCore() {
        const transaction = new TransactionBuilder()
            .category('profile')
            .type('Personal information')
            .build();

        const operation = new OperationBuilder()
            .transaction(transaction)
            .build();

        if (!this.smartcoreCheckpointService.useSmartidV5) {
            this.smartCore.personalizationOperation(operation);
        }

        return operation;
    }

    updatePassworPeriod(codePeriod: string): Observable<any> {
        this.info = JSON.parse(this.storageService.getItem('userInformation'));
        let type = 'COMMON';
        let customer = this.info.customerCode;
        let json = { type, codePeriod, customer };
        return this.httpClient.put('/v1/sec-profile/new-security-profile/update-password-period', json);
    }
    updatePassworPeriodExposed(codePeriod: string): Observable<any> {
        this.info = JSON.parse(this.storageService.getItem('userInformation'));
        let type = 'COMMON';
        let customer = this.info.customerCode;
        let json = { type, codePeriod, customer };
        return this.httpClient.put('/v1/sec-profile/new-security-profile/passless/update-password-period', json);
    }
    validateAffiliation(codeAffiliation: string, codeArea: string): Observable<any> {
        let json = { codeAffiliation, codeArea };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/validate-affiliation', json);
    }

    validateAffiliationExposed(codeAffiliation: string): Observable<any> {
        let json = { codeAffiliation };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/passless/validate-affiliation', json);
    }
    sendAffiliationCode(phone: string, codeOperator: string, codeArea: string, email: string): Observable<any> {
        let json = { phone, codeOperator, codeArea, email };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/send-affiliation-code', json);
    }

    sendAffiliationCodeExposed(phone: string, codeOperator: string): Observable<any> {
        let json = { phone, codeOperator };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/passless/send-affiliation-code', json);
    }

    updateInfoContact(phone: string, codeOperator: string,email: string,codePeriod: string, codeArea: string ): Observable<any> {
        let json = { phone, codeOperator, email, codePeriod, codeArea };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/update-info-contact', json);
    }

    updateInfoContactExposed(phone: string, codeOperator: string,email: string,codePeriod: string, codeArea: string ): Observable<any> {
        let json = { phone, codeOperator, email, codePeriod, codeArea };
        return this.httpClient.post('/v1/sec-profile/new-security-profile/passless/update-info-contact', json);
    }
}
