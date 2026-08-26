import { conflict, forbidden, missing } from './errors.mjs';
import { capacityScope, text } from './validation.mjs';

const transitions = {
  assessCapacity: { from: 'submitted', to: 'capacity_assessed', role: 'capacity_assessment_analyst', event: 'capacity_assessed' },
  verifyAvailability: { from: 'capacity_assessed', to: 'availability_verified', role: 'capacity_availability_verifier', event: 'capacity_availability_verified' },
  validateReservation: { from: 'availability_verified', to: 'reservation_validated', role: 'capacity_reservation_validator', event: 'capacity_reservation_validated' },
  authorizeCapacity: { from: 'reservation_validated', to: 'capacity_authorized', role: 'capacity_authority', event: 'capacity_authorized' },
  releaseCapacity: { from: 'capacity_authorized', to: 'capacity_released', role: 'capacity_registrar', event: 'capacity_released' }
};
const timestamp = () => new Date().toISOString();
const requireRole = (actor, role) => { if (!actor?.id || actor.role !== role) throw forbidden(`role ${role} is required`); };
const requestSeen = (record, requestId) => record.events.some((event) => event.requestId === requestId);

export class AccessPerformanceCapacityService {
  constructor(store) { this.store = store; }
  submit(input, actor, requestId) {
    requireRole(actor, 'evidence_owner'); const database = this.store.read(); if (database.accessPerformanceCapacityReviews.some((record) => requestSeen(record, requestId))) throw conflict('request identifier was already used');
    const now = timestamp(); const record = { id: crypto.randomUUID(), supplierId: text(input.supplierId, 'supplier id'), evidenceReference: text(input.evidenceReference, 'evidence reference'), capacityReference: text(input.capacityReference, 'capacity reference'), capacityScope: capacityScope(input.capacityScope), status: 'submitted', createdAt: now, updatedAt: now, events: [{ type: 'access_performance_capacity_submitted', actorId: actor.id, requestId, at: now }] };
    database.accessPerformanceCapacityReviews.push(record); this.store.write(database); return record;
  }
  transition(id, action, input, actor, requestId) {
    const policy = transitions[action]; if (!policy) throw missing('action was not found'); requireRole(actor, policy.role); const database = this.store.read(); const record = database.accessPerformanceCapacityReviews.find((entry) => entry.id === id);
    if (!record) throw missing('access-performance capacity review was not found'); if (requestSeen(record, requestId)) throw conflict('request identifier was already used'); if (record.status !== policy.from) throw conflict(`access-performance capacity review must be ${policy.from}`);
    const note = text(input.note, 'note'); const now = timestamp(); record.status = policy.to; record.updatedAt = now; record.events.push({ type: policy.event, actorId: actor.id, requestId, note, at: now }); database.accessPerformanceCapacityReviews = database.accessPerformanceCapacityReviews.map((entry) => entry.id === id ? record : entry); this.store.write(database); return record;
  }
  get(id) { const record = this.store.read().accessPerformanceCapacityReviews.find((entry) => entry.id === id); if (!record) throw missing('access-performance capacity review was not found'); return record; }
}
