// viewflow/lib/plans.ts

export type PlanTier = 'Starter' | 'Growth' | 'Enterprise';

export interface PlanFeatures {
  name: PlanTier;
  maxProperties: number;
  allowWhatsApp: boolean;
  allowKanban: boolean;
  allowPdfExport: boolean;
  allowCustomTemplates: boolean;
  allowFeedbackOffers: boolean;
  whitelabel: boolean;
}

export const PLAN_CONFIGS: Record<PlanTier, PlanFeatures> = {
  Starter: {
    name: 'Starter',
    maxProperties: 15,
    allowWhatsApp: false,
    allowKanban: true,
    allowPdfExport: false,
    allowCustomTemplates: false,
    allowFeedbackOffers: false,
    whitelabel: false,
  },
  Growth: {
    name: 'Growth',
    maxProperties: Infinity,
    allowWhatsApp: true,
    allowKanban: true,
    allowPdfExport: true,
    allowCustomTemplates: true,
    allowFeedbackOffers: true,
    whitelabel: false,
  },
  Enterprise: {
    name: 'Enterprise',
    maxProperties: Infinity,
    allowWhatsApp: true,
    allowKanban: true,
    allowPdfExport: true,
    allowCustomTemplates: true,
    allowFeedbackOffers: true,
    whitelabel: true,
  },
};

export const getPlanDetails = (tier?: string): PlanFeatures => {
  if (tier === 'Enterprise') return PLAN_CONFIGS.Enterprise;
  if (tier === 'Growth') return PLAN_CONFIGS.Growth;
  return PLAN_CONFIGS.Starter;
};
