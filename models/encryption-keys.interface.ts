export class AesKey {
    key!: string;
    iv!: string;
}

export class RsaKey {
    private: any;
    public: any;
}

export interface CharacterMap {
    [key: string]: string;
}
