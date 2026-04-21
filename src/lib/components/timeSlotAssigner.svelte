<script lang="ts">
    type TipRow = {
        till: string;
        amount: string;
    };

    type Worker = {
        _id: string;
        name: string;
        surname: string;
        baseCoefficient: number;
    };

    type SlotWorker = {
        worker: string;
        shiftStart: number;
        baseCoefficient: number;
    };

    type SelectedWorker = {
        worker: string;
        shiftStart: number;
        baseCoefficient: number;
    };

    type Slot = {
        key: string;
        label: string;
        start: number | null;
        end: number | null;
        workers: SlotWorker[];
    };

    let {
        workers,
        periods,
        selectedWorkers,
        slots = $bindable()
    }: {
        workers: Worker[],
        periods: TipRow[];
        selectedWorkers: SelectedWorker[];
        slots: Slot[]
    } = $props();


    function getWorkerById(workerId: string) {
        return workers.find((w) => w._id === workerId);
    }

    function parseHour(value: string): number | null {
        const num = Number(value);
        return Number.isFinite(num) ? num : null;
    }

    function isValidPeriod(row: TipRow) {
        return row.till.trim() !== '' && row.amount.trim() !== '' && parseHour(row.till) !== null;
    }

    function buildSlots(rows: TipRow[]): Slot[] {
        const validRows = rows
            .filter(isValidPeriod)
            .map((row) => ({
                till: Number(row.till),
                amount: Number(row.amount)
            }))
            .sort((a, b) => a.till - b.till);

        const result: Slot[] = [];

        if (validRows.length === 0) {
            return [];
        }

        // промежуточные периоды: "X - Y"
        for (let i = 0; i <= validRows.length; i++) {
            result.push({
                key:
                    i === 0
                        ? `before-${validRows[0].till}`
                        : i === validRows.length
                            ? `${validRows[i - 1].till}-end`
                            : `${validRows[i - 1].till}-${validRows[i].till}`,

                label:
                    i === 0
                        ? `до ${validRows[0].till}`
                        : i === validRows.length
                            ? `${validRows[i - 1].till} – конец`
                            : `${validRows[i - 1].till} – ${validRows[i].till}`,

                start:
                    i === 0
                        ? null
                        : validRows[i - 1].till,

                end:
                    i === validRows.length
                        ? null
                        : validRows[i].till,

                workers: []
            });
        }

        return result;
    }

    function workerInSlot(worker: SelectedWorker, slot: Slot) {
        const start = worker.shiftStart;


        // "до X"
        if (slot.start === null && slot.end !== null) {
            return start < slot.end;
        }

        // "X - конец"
        if (slot.start !== null && slot.end === null) {
            return true;
        }

        // "X - Y"
        if (slot.start !== null && slot.end !== null) {
            return start < slot.end;
        }

        return false;
    }

    function updateCoefficient(slotKey: string, workerId: string, value: number) {
        slots = slots.map(s =>
            s.key === slotKey
                ? {
                    ...s,
                    workers: s.workers.map(w =>
                        w.worker === workerId
                            ? { ...w, baseCoefficient: value }
                            : w
                    )
                }
                : s
        );
    }

    function removeWorkerFromSlot(slotKey: string, workerId: string) {
        slots = slots.map(s =>
            s.key === slotKey
                ? {
                    ...s,
                    workers: s.workers.filter(w => w.worker !== workerId)
                }
                : s
        );
    }

    $effect(() => {
        const built = buildSlots(periods);

        slots = built.map((slot) => ({
            ...slot,
            workers: selectedWorkers.filter((worker) => workerInSlot(worker, slot))
        }));
    });
</script>

{#if slots.length !== 0}
    <div class="assigner">
    <h2>Time slot assignment</h2>
    <div class="slots">
        {#each slots as slot}
            <div class="slot-card">
                <div class="slot-header">
                    <div class="slot-title">
                        {slot.label}
                    </div>
                    <div class="slot-count">
                        workers: <b>{slot.workers.length}</b>
                    </div>
                </div>

                {#if slot.workers.length > 0}
                    <div class="workers">
                        {#each slot.workers as item}
                            <div class="worker-chip">
                                <span>
                                    {getWorkerById(item.worker)?.name} {getWorkerById(item.worker)?.surname}
                                </span>
                                <div>
                                    start: <b>{item.shiftStart}</b>
                                </div>
                                <div>
                                    coefficient:
                                    <input
                                        class="coefficient-input"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={item.baseCoefficient}
                                        oninput={(e) => {
                                            const value = Number((e.currentTarget as HTMLInputElement).value);
                                            updateCoefficient(slot.key, item.worker, value);
                                        }}
                                    />
                                </div>
                                <button
                                        class="trash"
                                        onclick={() => removeWorkerFromSlot(slot.key, item.worker)}
                                >
                                    🗑️
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
{/if}

<style>
    .assigner {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .assigner h2 {
        margin: 30px auto 0;
        font-size: 24px;
        font-weight: 700;
    }

    .slots {
        display: grid;
        gap: 12px;
    }

    .slot-card {
        padding: 14px 10px;
        border: 1px solid #e6e6e6;
        border-radius: 16px;
        background: #fff;
    }

    .slot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }

    .slot-title {
        font-size: 16px;
        font-weight: 700;
    }

    .slot-count {
        font-size: 13px;
        color: #666;
    }

    .workers {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 10px 0 0 0;
    }

    .worker-chip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 8px 10px;
        border-radius: 10px;
        background: #f4f6fb;
        font-size: 14px;
    }

    .coefficient-input {
        width: 70px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid #ccc;
        padding: 0 8px;
    }

    .trash {
        border: none;
        background: #f5f5f5;
        border-radius: 10px;
        height: 40px;
        width: 40px;
        cursor: pointer;
    }

    .trash:hover {
        background: #fecaca;
    }

</style>