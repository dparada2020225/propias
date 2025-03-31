export enum EProfile {
    HONDURAS = 'banpais',
    SALVADOR = 'bisv',
    PANAMA = 'bipa'
}

export const userAgentProfile = {
  [EProfile.HONDURAS]: 'HN',
  [EProfile.PANAMA]: 'PA',
  [EProfile.SALVADOR]: 'SV',
};
