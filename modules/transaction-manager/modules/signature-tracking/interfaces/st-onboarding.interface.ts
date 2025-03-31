export interface STOnboarding {
  cover: {
    tablet: string;
    mobile: string;
    desktop: string;
  },
  title: string;
  description: string;
  step: number;
}

export type StOnboardingList = Array<STOnboarding>;
