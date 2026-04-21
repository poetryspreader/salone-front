<script lang="ts">
    type TipRow = {
        till: string;
        amount: string;
    };

    let {
        periods = $bindable(),
        totalTips = $bindable(),
        transportFund = $bindable()
    }: {
        periods: TipRow[],
        totalTips: number;
        transportFund: number;
    } = $props();

    periods = [{ till: '', amount: '' }];

    // проверяем заполненность строки
    function isFilled(row: TipRow) {
        return row.till.trim() !== '' && row.amount.trim() !== '';
    }

    // обновляем базу типсов
    function updateRow(index: number, field: keyof TipRow, value: string) {
        periods[index][field] = value;

        const isLastRow = index === periods.length - 1;
        const currentRowFilled = isFilled(periods[index]);

        isLastRow && currentRowFilled ? periods = [...periods, { till: '', amount: '' }] : periods = [...periods]
    }

    // удаляем строку
    function removeRow(index: number) {
        periods = periods.filter((_, i) => i !== index);

        if (periods.length === 0 || periods.every(isFilled)) {
            periods = [...periods, { till: '', amount: '' }];
        }
    }

</script>

<div class="header">
    <h2>Tips by period</h2>
    <p>Enter cumulative tips by time</p>
</div>


<div class="tips-card">
    <div class="labels">
        <div class="label">Till</div>
        <div class="label">Amount</div>
    </div>
    {#each periods as row, index}
        <div class="fields">
            <div class="field">
                <input
                    id={`till-${index}`}
                    type="number"
                    value={row.till}
                    oninput={(e) => updateRow(index, 'till', (e.currentTarget as HTMLInputElement).value)}
                />
            </div>
            <div class="field">
                <input
                    id={`amount-${index}`}
                    type="number"
                    inputmode="numeric"
                    value={row.amount}
                    oninput={(e) => updateRow(index, 'amount', (e.currentTarget as HTMLInputElement).value)}
                />
            </div>
            <button
                class="trash"
                onclick={() => removeRow(index)}
                disabled={!(row.till || row.amount) || index === periods.length - 1}
            >
                🗑️
            </button>
        </div>
    {/each}
</div>
<div class="extra-cards">
    <div class="extra-card">
        <div class="label">Total:</div>
        <input
            class="extra-card-input"
            type="number"
            inputmode="numeric"
            value={totalTips}
            oninput={(e) => totalTips = (e.currentTarget as HTMLInputElement).value}
        />
    </div>
    <div class="extra-card">
        <div class="label">Transport:</div>
        <input
            class="extra-card-input"
            type="number"
            inputmode="numeric"
            value={transportFund}
            oninput={(e) => {
                const value = (e.currentTarget as HTMLInputElement).value;
                transportFund = value === '' ? 0 : Number(value);
            }}
        />
    </div>
</div>

<style>
    .header {
        margin-bottom: 20px;
        text-align: center;
    }

    .header h2 {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 700;
    }

    .header p {
        margin: 0;
        font-size: 14px;
        color: #666;
    }

    .tips-card {
        display: grid;
        gap: 20px;
        padding: 14px;
        border: 1px solid #e6e6e6;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .fields {
        display: grid;
        grid-template-columns: 1fr 1fr 40px;
        gap: 10px;
        align-items: center
    }

    .trash {
        border: none;
        background: #f5f5f5;
        border-radius: 10px;
        height: 40px;
    }

    .trash:not(:disabled):hover {
        background: #fecaca;
        cursor: pointer;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .labels {
        display: grid;
        grid-template-columns: 1fr 1fr 40px;
        gap: 10px;
    }
    .labels .label {
        font-size: 16px;
        font-weight: 600;
        color: #444;
        font-family: "Google Sans Flex", sans-serif;
    }

    .field input {
        width: 100%;
        height: 48px;
        padding: 0 14px;
        border: 1px solid #d8d8d8;
        border-radius: 12px;
        font-size: 16px;
        outline: none;
        background: #fafafa;
    }

    .field input:focus {
        border-color: #999;
        background: #fff;
    }

    .extra-card {
        margin-top: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        background: #fff;
        max-width: 200px;
    }

    .extra-card .label {
        font-size: 16px;
        font-weight: 600;
        color: #444;
        font-family: "Google Sans Flex", sans-serif;
    }

    .extra-card-input {
        width: 100%;
        height: 48px;
        padding: 0 14px;
        border: 1px solid #d8d8d8;
        border-radius: 12px;
        font-size: 16px;
        background: #fafafa;
    }

    .extra-card-input:focus {
        border-color: #999;
        background: #fff;
    }

    .extra-cards {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
</style>