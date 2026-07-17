import { fullPlan } from "./plans/full";
import { stepsByIdFrom } from "./plans/types";

export const steps = fullPlan.steps;
export const stepsById = stepsByIdFrom(steps);
