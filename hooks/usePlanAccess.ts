'use client';

import { useAuth } from '@/context/AuthContext';
import { getPlanDetails, PlanFeatures, PlanTier } from '@/lib/plans';

export function usePlanAccess() {
  const { user } = useAuth();
  const currentPlanTier: PlanTier = (user?.subscriptionPlan as PlanTier) || 'Growth';
  const limits: PlanFeatures = getPlanDetails(currentPlanTier);

  const isTrial = user?.subscriptionStatus === 'trial';
  
  // Calculate trial days left
  let trialDaysLeft = 0;
  let isTrialExpired = false;

  if (isTrial) {
    if (user?.trialEndsAt) {
      const msLeft = new Date(user.trialEndsAt).getTime() - Date.now();
      trialDaysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      isTrialExpired = msLeft <= 0;
    } else {
      trialDaysLeft = 30;
    }
  } else if (user?.subscriptionStatus === 'expired') {
    isTrialExpired = true;
  }

  const canAccess = (feature: keyof Omit<PlanFeatures, 'name' | 'maxProperties'>): boolean => {
    if (isTrialExpired) return false;
    return Boolean(limits[feature]);
  };

  const isQuotaReached = (currentCount: number): boolean => {
    if (isTrialExpired) return true;
    if (limits.maxProperties === Infinity) return false;
    return currentCount >= limits.maxProperties;
  };

  return {
    userPlan: currentPlanTier,
    limits,
    isTrial,
    trialDaysLeft,
    isTrialExpired,
    canAccess,
    isQuotaReached,
  };
}
