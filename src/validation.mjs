import { inputError } from './errors.mjs';

export const text = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw inputError(`${name} is required`);
  return value.trim();
};

export const capacityScope = (value) => {
  value = text(value, 'capacity scope');
  if (!['access_commitment_capacity', 'evidence_entitlement_capacity', 'exception_route_capacity'].includes(value)) throw inputError('capacity scope is invalid');
  return value;
};

export const actor = (headers) => ({ id: headers['x-actor-id'], role: headers['x-actor-role'] });
