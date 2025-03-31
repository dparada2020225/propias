export const phoneValidationCode = {
    maxLength: 10,
    minLength: 10
}

export class Profile {
    code!: number;
    decription!: string;
    status!: string;
    registrationRequired!: string;
    phone!: string | undefined;
    codeOperator!: string;
    email!: string;
    lastConnectionDate!: string;
    hasPendings!: string;
    managedUser!: string;
    periodChangePassword!: string;
    profile!: string;
    userType!: string;
    error!: any;
    reference!: any;
    codeError!: any;
    description!: any;
    incompleteProfile!: any;
    changePeriod!: any;
    operatorDescription!: any;
    idClient!: any;
    idGen!: any;
    codeArea!: any;
}

export class PasswordPeriod {
    channel!: string;
    code!: string;
    description!: string;
}

export class PhoneCompanies {
    channel!: string;
    code!: string;
    description!: string;
}

export class Option {
    value!: string;
    name!: string;
}

export class UserInformation {
    username!: string;
    status!: boolean;
    profile!: string;
    email!: string;
    firstName!: string;
    secondName!: string;
    firstLastname!: string;
    secondLastname!: string;
    thirdLastname!: string;
    connectionDate!: string;
    signatureType!: string;
    customerCode!: string;
    lastConnectionDate!: string;
    duration!: string;
    ip!: string;
    userType!: string;
}