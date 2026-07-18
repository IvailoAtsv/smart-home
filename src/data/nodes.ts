import { fullPlanFallback } from "./plans/buildFullPlan";
import { stepsByIdFrom } from "./plans/types";

export const steps = fullPlanFallback.steps;
export const stepsById = stepsByIdFrom(steps);
