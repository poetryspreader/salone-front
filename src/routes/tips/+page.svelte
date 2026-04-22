<script lang="ts">
    import { onMount } from "svelte";
    import WorkerPicker from '$lib/components/tipsWorkerPicker.svelte';
    import TipsPeriodCard from '$lib/components/tipsPeriodCard.svelte';
    import TimeSlotAssigner from '$lib/components/timeSlotAssigner.svelte';

    type Worker = {
        _id: string,
        name: string;
        surname: string;
        baseCoefficient: number;
    };

    type Slot = {
        key: string;
        label: string;
        start: number | null;
        end: number | null;
        cleanTipsPerPeriod: number;
        kitchenPerPeriod: number;
        transportPerPeriod: number;
        cleanAmountPerPeriod: number;
        workersWithPay: any[];
    };

    type Meta = {
        totalKitchenTips: number;
        transportFund: number;
        totalFreeBalance: number;
    };

    type TotalPerWorker = {
        worker: string;
        totalPayout: number;
        freeBalance: number
    };

    let workers = $state<Worker[]>([]);
    let selectedWorkers = $state([]);
    let periods = $state([]);
    let totalTips = $state();
    let transportFund = $state();
    let slots = $state([]);
    let data = $state<Slot[]>([]);
    let meta = $state<Meta | null>(null);
    let totalPerWorker = $state<TotalPerWorker[]>([]);

    onMount(async () => {
        try {
            // const res = await fetch("http://localhost:3000/api/workers");
            const res = await fetch("https://salone-core.onrender.com/api/workers");

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            workers = await res.json();

        } catch (error) {
            console.error("Failed to load workers:", error);

            workers = [];
        }
    });

    async function sendTips() {
        try {
            const res = await fetch("https://salone-core.onrender.com/api/tips", {
            // const res = await fetch("http://localhost:3000/api/tips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    periods,
                    totalTips,
                    transportFund,
                    selectedWorkers,
                    slots
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const result = await res.json();
            data = result.data;
            totalPerWorker = result.totalPerWorker;
            meta = result.meta;

            // console.log("Saved:", data);
            // console.log("Saved:", meta);

        } catch (error) {
            console.error("Failed to send tips:", error);
        }
    }

    function getWorkerById(workerId: string) {
        return workers.find((w) => w._id === workerId);
    }

</script>

<div class="updates-card">
    <div class="updates-header">
        <span class="updates-badge">Updates:</span>
    </div>

    <ul class="updates-list">
        <li>Деньги на развоз теперь считаются процентуально с каждого периода,</li>
        <li>итоговый чаевые по каждому сотруднику теперь округлены,</li>
        <li>добавлен свободный баланс после округления.</li>
    </ul>
</div>

<TipsPeriodCard bind:periods bind:totalTips bind:transportFund />
<WorkerPicker {workers} bind:selectedWorkers />
<TimeSlotAssigner {workers} {periods} {selectedWorkers} bind:slots />

{#if slots.length !== 0}
    <button class="submit-btn" onclick={sendTips}>
        CALCULATE TIPS
    </button>
{/if}

<!--<pre>{JSON.stringify(data, null, 2)}</pre>-->
{#if data.length > 0}
    <div class="summary">
        <div class="summary-card">
            <div class="summary-title">Kitchen tips</div>
            <div class="summary-value">{meta?.totalKitchenTips?.toFixed(2)}</div>
        </div>

        <div class="summary-card">
            <div class="summary-title">Transport fund</div>
            <div class="summary-value">{meta?.transportFund?.toFixed(2)}</div>
        </div>
    </div>
    {#each data as dataItem}
        <div class="slot-card">

            <!-- 1. LABEL -->
            <div class="slot-header">
                <div class="title">{dataItem.label ?? ''}</div>
            </div>

            <!-- 2. CLEAN TIPS -->
            <div class="row">
                Clean tips: <b>{dataItem.cleanTipsPerPeriod.toFixed(2) ?? 0}</b>
            </div>

            <!-- 3. KITCHEN -->
            <div class="row">
                Kitchen: <b>{dataItem.kitchenPerPeriod.toFixed(2) ?? 0}</b>
            </div>

            <!-- 4. TRANSPORT -->
            <div class="row">
                Transport: <b>{dataItem.transportPerPeriod.toFixed(2) ?? 0}</b>
            </div>

            <!-- 5. CLEAN AMOUNT -->
            <div class="row total">
                Clean amount: <b>{dataItem.cleanAmountPerPeriod.toFixed(2) ?? 0}</b>
            </div>

            <!-- 6. WORKERS -->
            <div class="workers">
                {#each dataItem.workersWithPay ?? [] as w}
                    <div class="worker">
                        <div class="name">
                            {getWorkerById(w.worker)?.name}
                            {getWorkerById(w.worker)?.surname}
                        </div>

                        <div class="info">
                            start: <b>{w.shiftStart}</b>
                        </div>

                        <div class="coef">
                            coef: <b>{w.baseCoefficient}</b>
                        </div>

                        <div class="payout">
                            <b>{w.payout.toFixed(2)}€</b>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}

    {#if totalPerWorker.length > 0}
        <div class="workers-total">
            <h3>Workers total payout:</h3>

            {#each totalPerWorker as w}
                <div class="worker-row">
                    <div class="name">
                        {getWorkerById(w.worker)?.name}
                        {getWorkerById(w.worker)?.surname}
                    </div>

                    <div class="payout">
                        {w.totalPayout}€
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    {#if data.length > 0}
        <div class="free-balance-card">
            <div class="title">💰 Free balance</div>
            <div class="value">{meta?.totalFreeBalance.toFixed(2)}</div>
        </div>
    {/if}
{/if}


<style>
    .updates-card {
        background: #fee2e2; /* светло-красный фон */
        border: 1px solid #fecaca;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 40px;
    }

    .updates-header {
        font-family: "Roboto", sans-serif;
        margin-bottom: 20px;
    }

    .updates-badge {
        background: #ef4444;
        color: white;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
    }

    .updates-list {
        margin: 8px 0 12px 0;
        padding-left: 18px;
        color: #7f1d1d;
    }

    .updates-list li {
        margin-bottom: 4px;
    }

    .submit-btn {
        display: block;
        margin: 50px auto;
        padding: 0 50px;
        height: 48px;
        border: none;
        border-radius: 12px;
        background: #1e40af;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
    }

    .submit-btn:hover {
        background: #1d4ed8;
    }

    .slot-card {
        font-family: "Roboto", sans-serif;
        border: 1px solid #e5e5e5;
        border-radius: 14px;
        padding: 14px;
        margin-bottom: 12px;
        background: #fff;
    }

    .slot-header .title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 10px;
    }

    .row {
        font-size: 14px;
        margin-bottom: 4px;
        color: #444;
    }

    .row.total {
        font-weight: 700;
        color: #16a34a;
        margin-top: 6px;
    }

    .workers {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .worker {
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        align-items: center;
        gap: 10px;
        padding: 6px 0;
        border-top: 1px solid #f2f2f2;
    }

    .worker:first-child {
        border-top: none;
    }

    .name {
        font-weight: 600;
    }

    .summary {
        font-family: "Roboto", sans-serif;
        display: grid;
        align-items: center;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin: 20px 0;
    }

    .summary-card {
        padding: 16px;
        border-radius: 14px;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .summary-title {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
    }

    .summary-value {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
    }

    .workers-total {
        font-family: "Roboto", sans-serif;
        margin-top: 30px;
        padding: 16px;
        border-radius: 16px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
    }

    .workers-total h3 {
        margin: 0 0 12px 0;
        font-size: 18px;
        font-weight: 700;
    }

    .worker-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-radius: 10px;
        background: #fff;
        margin-bottom: 8px;
    }

    .worker-row .name {
        font-weight: 500;
    }

    .worker-row .payout {
        color: #0d7a35;
        font-weight: 700;
    }

    .free-balance-card {
        font-family: "Roboto", sans-serif;
        width: 100%;
        background: #e0f2fe;
        border: 1px solid #bae6fd;
        border-radius: 12px;
        padding: 16px;
        margin-top: 16px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .free-balance-card .title {
        color: #0369a1;
        font-weight: 600;
    }

    .free-balance-card .value {
        color: #075985;
        font-size: 18px;
        font-weight: bold;
    }

    @media (max-width: 480px) {
        /*.fields {*/
        /*    grid-template-columns: 1fr 1fr;*/
        /*    gap: 10px;*/
        /*}*/

        /*.field input {*/
        /*    height: 46px;*/
        /*    font-size: 16px;*/
        /*}*/
    }
</style>