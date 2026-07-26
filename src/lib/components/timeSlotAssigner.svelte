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

    function updateCoefficient(slotKey: string, workerId: string, value: string) {
        const coefficient = Math.round(Number(value) * 10) / 10;
        slots = slots.map(s =>
            s.key === slotKey
                ? {
                    ...s,
                    workers: s.workers.map(w =>
                        w.worker === workerId
                            ? { ...w, baseCoefficient: coefficient }
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
                                <div class="coef">
                                    coef:
                                    <div class="coef__control">
                                        <button
                                            class="coef__btn"
                                            onclick={() => updateCoefficient(slot.key, item.worker, String(item.baseCoefficient - 0.1))}
                                        >
                                            −
                                        </button>
                                        <input
                                                id={`coef-${item.baseCoefficient}`}
                                                class="coef__input"
                                                type="text"
                                                inputmode="decimal"
                                                value={item.baseCoefficient}
                                                oninput={(e) => {
                                            const value = e.currentTarget.value.replace(',', '.')
                                            updateCoefficient(slot.key, item.worker, value);
                                        }}
                                        />
                                        <button
                                                class="coef__btn"
                                                onclick={() => updateCoefficient(slot.key, item.worker, String(item.baseCoefficient + 0.1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
<!--                                <button-->
<!--                                        class="trash"-->
<!--                                        onclick={() => removeWorkerFromSlot(slot.key, item.worker)}-->
<!--                                >-->
<!--                                    🗑️-->
<!--                                </button>-->
                                <button
                                    type="button"
                                    class="remove-btn"
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        removeWorkerFromSlot(slot.key, item.worker);
                                    }}
                                >
                                    ✕
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
        padding: 14px;
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
        padding: 8px 35px 8px 8px;
        border-radius: 10px;
        background: #f4f6fb;
        font-size: 15px;
        position: relative;
    }

    .coef {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .coef__input {
        width: 40px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid #ccc;
        padding: 0 8px;
        font-size: 16px;
    }

    .coef__control {
        display: flex;
        align-items: center;
        gap: 3px;
    }

    .coef__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
        font-size: 18px;
    }

    .coef__btn:hover {
        background: #f5f5f5;
    }

    .remove-btn {
        position: absolute;
        top: 2px;
        right: 1px;
        border: none;
        cursor: pointer;
        background: transparent;
    }

</style>