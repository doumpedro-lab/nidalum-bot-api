export interface Budget {
  id?: string;
  month: string; // ex: '2026-08'
  aiBudgetLimitUsd: number;
  currentAiSpendUsd: number;
  cloudCostUsd: number;
  isAiAvailable: boolean; // Automatiquement false si currentAiSpendUsd >= aiBudgetLimitUsd
  updatedAt: Date;
}
