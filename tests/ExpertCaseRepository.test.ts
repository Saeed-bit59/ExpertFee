import { MemoryExpertCaseDatabase } from "../src/database/ExpertCaseDatabase";
import { ExpertCaseRepository } from "../src/database/ExpertCaseRepository";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`EXPERT CASE REPOSITORY TEST FAILED: ${message}`);
}

let id = 0;
let minute = 0;
const repo = new ExpertCaseRepository(new MemoryExpertCaseDatabase(), {
  createId: () => `t-${++id}`,
  now: () => new Date(`2026-08-07T10:${String(minute++).padStart(2, "0")}:00.000Z`),
});

const judiciary = await repo.create({
  referralSource: "JUDICIARY",
  processingInstitution: "CENTER",
  caseNumber: "1405/123",
  calculationCategory: "ارزیابی عمومی",
  tariffArticle: 11,
  grossFeeToman: 20_000_000,
});
assert(
  judiciary.paymentStatus === "PENDING" &&
    judiciary.institutionSharePercent === 5 &&
    judiciary.netReceivableToman === 19_000_000 &&
    judiciary.receivedAmountToman === 0,
  "Judiciary create",
);

const center = await repo.create({
  referralSource: "CENTER",
  notificationNumber: "100",
  calculationCategory: "صنعت و فن",
  grossFeeToman: 10_000_000,
});
assert(center.processingInstitution === "CENTER" && center.netReceivableToman === 9_000_000, "Center create");

const received = await repo.markReceived(judiciary.id, "2026-08-08T12:00:00.000Z");
assert(received.paymentStatus === "RECEIVED" && received.receivedAmountToman === 19_000_000, "Full receipt");

const summary = await repo.summary();
assert(summary.recordCount === 2 && summary.receivedAmountToman === 19_000_000 && summary.pendingReceivableToman === 9_000_000, "Summary");
assert((await repo.list({ search: "1405/123" })).length === 1, "Search");

const snapshot = await repo.exportSnapshot();
const restoredRepo = new ExpertCaseRepository(new MemoryExpertCaseDatabase());
await restoredRepo.importSnapshot(snapshot);
assert((await restoredRepo.list()).length === 2, "Backup restore");

const pending = await repo.markPending(judiciary.id);
assert(pending.receivedAmountToman === 0 && pending.receivedAt === undefined, "Return pending");

let invalidRejected = false;
try {
  await restoredRepo.importSnapshot({
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    records: [{ id: "bad", grossFeeToman: -1 }],
  });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "Invalid backup must be rejected");
assert((await restoredRepo.list()).length === 2, "Rejected backup must not replace existing data");

let duplicateRejected = false;
try {
  await restoredRepo.importSnapshot({
    ...snapshot,
    records: [snapshot.records[0], snapshot.records[0]],
  });
} catch {
  duplicateRejected = true;
}
assert(duplicateRejected, "Duplicate backup IDs must be rejected");
assert((await restoredRepo.list()).length === 2, "Duplicate backup must not replace existing data");

console.log("EXPERT CASE REPOSITORY: ALL TESTS PASSED");
