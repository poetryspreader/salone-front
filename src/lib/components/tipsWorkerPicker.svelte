<script lang="ts">
    type Worker = {
        _id: string;
        name: string;
        surname: string;
        baseCoefficient: number;
    };

    type SelectedWorker = {
        worker: string;
        baseCoefficient: number;
        shiftStart: number;
    };

    let {
        workers,
        selectedWorkers = $bindable()
    }: {
        workers: Worker[];
        selectedWorkers: SelectedWorker[];
    } = $props();

    let search = $state('');
    let isOpen = $state(false);
    let isDayOff = $state(false);

    let container: HTMLDivElement;

    let availableHours = $derived(
        isDayOff ? [9, 13, 18] : [8, 13, 18]
    );

    function isSelected(workerId: string) {
        return selectedWorkers.some((item) => item.worker === workerId);
    }

    function getShiftStart(workerId: string): number | '' {
        return selectedWorkers.find((item) => item.worker === workerId)?.shiftStart ?? '';
    }

    function removeWorker(workerId: string) {
        selectedWorkers = selectedWorkers.filter((item) => item.worker !== workerId);
    }

    function updateShiftStart(workerId: string, baseCoefficient: number, value: number, mode: 'set' | 'change') {
        const existing = selectedWorkers.find((item) => item.worker === workerId);

        if (!existing) {
            selectedWorkers = selectedWorkers.concat({
                worker: workerId,
                baseCoefficient: baseCoefficient,
                shiftStart: mode === 'set'
                    ? Math.max(0, value)
                    : Math.max(0, availableHours[0] + value)
            });
            return;
        }

        selectedWorkers = selectedWorkers.map((item) =>
            item.worker === workerId
                ? {
                    ...item,
                    shiftStart: mode === 'set'
                        ? Math.max(0, value)
                        : Math.max(0, item.shiftStart + value)
                }
                : item
        );
    }

    function isHourActive(workerId: string, hour: number) {
        return selectedWorkers.find((item) => item.worker === workerId)?.shiftStart === hour;
    }

    function getWorkerById(workerId: string) {
        return workers.find((w) => w._id === workerId);
    }

    const filteredWorkers = $derived(
        workers.filter((worker) =>
            `${worker.name} ${worker.surname}`.toLowerCase().includes(search.toLowerCase().trim())
        )
    );
</script>

<div class="picker">
    <label class="dayoff-toggle">
        <input type="checkbox" bind:checked={isDayOff} />
        <span>Сегодня выходной</span>
    </label>

    <div class="search-block" bind:this={container}>
        <input
            class="search"
            type="text"
            placeholder="Search worker"
            bind:value={search}
            onmousedown={(e) => {
                e.stopPropagation();
                isOpen = true;
            }}
        />

        {#if isOpen}
            <div class="dropdown">
                {#each filteredWorkers as worker}
                    <div
                        class="dropdown-item"
                        class:selected={isSelected(worker._id)}
                    >
                        <div class="name">{worker.name} {worker.surname}</div>
                        <div class="shift-start-controls">
                            <div class="hours">
                                {#each availableHours as hour}
                                    <button
                                        type="button"
                                        class="hour-btn"
                                        class:active={isHourActive(worker._id, hour)}
                                        onclick={() => updateShiftStart(worker._id, worker.baseCoefficient, hour, 'set')}
                                    >
                                        {hour}
                                    </button>
                                {/each}
                            </div>

                            <div class="manual-control">
                                <button
                                    class="step-btn"
                                    onclick={() => updateShiftStart(worker._id, worker.baseCoefficient, -1, 'change')}
                                > - </button>

                                <input
                                    class="time"
                                    value={getShiftStart(worker._id)}
                                    oninput={(e) => {
                                        const raw = (e.currentTarget as HTMLInputElement).value;
                                        updateShiftStart(worker._id, worker.baseCoefficient, raw === '' ? 0 : Number(raw), 'set');
                                    }}
                                />

                                <button
                                    class="step-btn"
                                    onclick={() => updateShiftStart(worker._id, worker.baseCoefficient, +1, 'change')}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {#if isSelected(worker._id)}
                            <button
                                    type="button"
                                    class="remove-btn"
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        removeWorker(worker._id);
                                    }}
                            >
                                ✕
                            </button>
                        {/if}
                    </div>
                {/each}

                {#if filteredWorkers.length === 0}
                    <div class="dropdown-empty">No workers</div>
                {/if}
            </div>
        {/if}
    </div>

    {#if selectedWorkers.length > 0}
        <div class="selected-workers">
            {#each selectedWorkers as item}
                {@const w = getWorkerById(item.worker)}

                {#if w}
                    <div class="selected-workers_item">
                        <div class="name">{w.name} {w.surname}</div>
                        <input
                            class="time"
                            type="number"
                            min="0"
                            value={item.shiftStart}
                            oninput={(e) =>
                            updateShiftStart(
                                item.worker, w.baseCoefficient,
                                Number((e.currentTarget as HTMLInputElement).value || 0), 'set'
                            )}
                        />
                        <button class="trash" onclick={() => removeWorker(item.worker)}>
                            🗑️
                        </button>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}

<!--    <pre class="debug">-->
<!--        {JSON.stringify(selectedWorkers, null, 2)}-->
<!--    </pre>-->
</div>

<svelte:window
    onclick={(e) => {
        if (container && !container.contains(e.target as Node)) {
            isOpen = false;
        }
    }}
/>

<style>

.picker {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
    margin: 40px auto 0;
    .dayoff-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
        font-weight: 600;
    }
    .search-block {
        position: relative;
        .search {
            width: 100%;
            height: 50px;
            padding: 0 14px;
            border-radius: 12px;
            border: 1px solid #ccc;
            font-size: 16px;
        }
        .dropdown {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            border: 1px solid #ddd;
            border-radius: 12px;
            background: #fff;
            max-height: 420px;
            overflow-y: auto;
            padding: 8px;
            gap: 8px;
            .dropdown-item {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                border: 1px solid #eee;
                border-radius: 12px;
                &.selected {
                    background: #eef3ff;
                    border-color: #c7d7ff;
                }
                .name {
                    margin: 0 0 10px 0;
                    display: flex;
                    text-align: left;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-weight: 600;
                }
                .shift-start-controls {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                    .hours {
                        display: flex;
                        flex-direction: row;
                        gap: 2px;
                    }
                    .hour-btn {
                        min-width: 42px;
                        height: 36px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        background: #fff;
                        cursor: pointer;
                        &.active {
                            background: #1e40af;
                            color: #fff;
                            border-color: #1e40af;
                        }
                    }
                    .manual-control {
                        display: grid;
                        grid-template-columns: 36px 1fr 36px;
                        gap: 8px;
                        align-items: center;
                        .step-btn {
                            height: 36px;
                            border: none;
                            border-radius: 8px;
                            background: #eaeaea;
                            cursor: pointer;
                            font-size: 18px;
                        }
                        .time {
                            height: 40px;
                            width: 60px;
                            border-radius: 10px;
                            border: 1px solid #ccc;
                            padding: 0 10px;
                        }
                    }
                }
                .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    border: none;
                    cursor: pointer;
                    background: transparent;
                }
            }
            .dropdown-empty {
                padding: 12px;
                text-align: center;
                color: #777;
            }
        }
    }
    .debug {
        background: #f6f6f8;
        padding: 10px;
        border-radius: 10px;
        font-size: 12px;
    }
}

.selected-workers {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .selected-workers_item {
        display: grid;
        grid-template-columns: 1fr 90px 40px;
        gap: 8px;
        align-items: center;
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 12px;
        background: #fff;
        .name {
            font-weight: 600;
        }
        .time {
            height: 40px;
            border-radius: 10px;
            border: 1px solid #ccc;
            padding: 0 10px;
        }
        .trash {
            border: none;
            background: #f5f5f5;
            border-radius: 10px;
            height: 40px;
            cursor: pointer;
        }

        .trash:hover {
            background: #fecaca;
        }
    }
}



</style>