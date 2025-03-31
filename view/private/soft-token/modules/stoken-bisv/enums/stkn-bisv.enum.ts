export enum EInvitationModal {
    MODAL_INFORMATION = 'stkn_info_modal',
    MODAL_QR = 'stkn_qr_modal',
    MODAL_QR_WARNING = 'stkn_qr_warning_modal',
    MODAL_TOKEN_HELP = 'stkn_qr_help_modal',
    MODAL_TOKEN = 'stkn_token_modal',
    MODAL_CONFIRMATION = 'stkn_confirm_modal',
    MODAL_EXIT = 'stkn_exit_modal'
  }
  
  export enum EStokenBisvQrCodesDEVEL {
    QR_SYNCHRONIZED_SUCCESS = '842',
    ERROR_SERVICE_INITAL = '900',
    ERROR_CHECKING_QR_STATUS = '844',
    QR_EXPIRED = '843',
    QR_ASSIGNED_TO_DEVICE = '841'
  }
  
  export enum EStokenBisvValidationMemerbership{
    ACTIVE = 'A',
    INACTIVE = 'I'
  }
  
  export enum EUsertTypeSToken{
    NEW_USER = '301',
    USER_DEVICE_NO_ASOCIATE = '302',
    USER_WITHOUT_CODEQR= '303',
    USER_ASOCIATE = '304',
    USER_ASOCIATE_WITH_CODEQR = '305',
    USER_WITH_MINI_STOKEN = '328'
  }
  
  export enum EStokenNavigationProtection {
    CONFIRMATION = 'confirmation_stoken',
    INFORMATION = 'information_stoken',
    NEW_DEVICE = 'new_device_stoken',
    QRCODE = 'qr_code_stoken',
    WELCOME = 'welcome_stoken'
  }
  
  export enum EStokenNavigationUrlNavigation {
    MIGRATION = '/soft-token/migration/',
  }
  
  export enum ESTokenSettingsProperty {
    STOKEN = 'stoken',
    STOKEN_NEW_USER = 'stoken-act'
  }
  
  export enum ETypeToken {
    TYPE_SMS = 'S',
    TYPE_F = 'F',
    TYPE_STOKEN = 'T',
    TYPE_EMPTY = ' ',
    TYPE_NULL = 'null',
    TYPE_UNDEFINED = 'undefined',
    TYPE_VALIDATE = 'V',
    TYPE_NEW_USER_STOKEN = 'N',
    TYPE_STOKEN_DEVEL = 'D',
  }
  
  export enum EModalsInformation{
    NOT_ALLOWED_MODAL = 'not_allowed_modal',
    SECURITY_MODAL = 'security_modal',
    SOFT_TOKEN_MODAL = 'stoken-modal',
    VERIFICATION_MODAL = 'verification_modal',
  }


  export enum EStokenRoutesNewUser{
    WELCOME_SCREEN = '/new-user/soft-token',
    INFORMATION_SCREEN = '/new-user/soft-token/information',
    QR_SCREEN = '/new-user/soft-token/qrcode-stoken',
    TOKEN_APPROVE_SCREEN = '/new-user/soft-token/approve-stoken',
    CONFIRMATION_SCREEN = '/new-user/soft-token/confirmation'
  }
  
  export enum EStokenRoutesMigration{
    INFORMATION_SCREEN = '/soft-token/migration',
    QR_SCREEN = '/soft-token/migration/qrcode-stoken',
    TOKEN_APPROVE_SCREEN = '/soft-token/migration/approve-stoken',
    CONFIRMATION_SCREEN = '/soft-token/migration/confirmation',
  }
  
  export enum EStokenRoutesChangeDevice{
    INFORMATION_SCREEN = '/soft-token/change-device',
    QR_SCREEN = '/soft-token/change-device/qrcode-stoken',
    TOKEN_APPROVE_SCREEN = '/soft-token/change-device/approve-stoken',
    CONFIRMATION_SCREEN = '/soft-token/change-device/confirmation',
  }
  
  
  export enum EStokenScreenNames{
    WELCOME = 'welcome_screen',
    INFORMATION = 'information_screen',
    QR = 'qr_screen',
    TOKEN_APPROVE = 'approve_screen',
    CONFIRMATION = 'confirmation_screen',
  }
  
  export enum EStokenBISVFlows {
    MIGRATION = 'migration',
    CHANGE_DEVICE = 'change-device',
    NEW_USER = 'new-user',
  }

  export enum EStokenBISVRequiredToken {
    REQUIRED_TOKEN = 'RQT',
    NOT_REQUIRED_TOKEN = 'NRQ',
  }