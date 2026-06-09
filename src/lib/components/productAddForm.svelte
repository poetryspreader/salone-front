<script lang="ts">
    import { token } from "$lib/stores/auth";
    import { products } from "$lib/stores/products";
    import {PUBLIC_API_URL} from "$env/static/public";

    let nameEn = "";
    let nameRu = "";

    let descriptionEn = "";
    let descriptionRu = "";

    let categoryEn = "";
    let categoryRu = "";

    let price = "";
    let available = true;

    let imageFile: File | null = null;

    let submitted = false;

    let loading = false;

    async function createProduct(event: SubmitEvent) {
        event.preventDefault();
        submitted = true;

        const form = event.currentTarget as HTMLFormElement;

        if (!form.checkValidity()) {
            return;
        }

        event.preventDefault();

        const formData = new FormData();

        formData.append("name[en]", nameEn);
        formData.append("name[ru]", nameRu);

        formData.append("description[en]", descriptionEn);
        formData.append("description[ru]", descriptionRu);

        formData.append("category[en]", categoryEn);
        formData.append("category[ru]", categoryRu);

        formData.append("price", price);
        formData.append("available", String(available));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            loading = true;
            const res = await fetch(`${PUBLIC_API_URL}/api/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${$token}`
                },
                body: formData
            });

            if (!res.ok) {
                throw new Error("Failed to create product");
            }

            const data = await res.json();

            products.update(items => [data, ...items]);

            submitted = false;

            // reset form
            nameEn = "";
            nameRu = "";
            descriptionEn = "";
            descriptionRu = "";
            categoryEn = "";
            categoryRu = "";
            price = "";
            available = true;
            imageFile = null;

        } catch (err) {
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<form
    novalidate
    class="product-card"
    onsubmit={createProduct}
    class:submitted={submitted}
>
    <div class="header">
        <h2>Create Product</h2>
        <p>Multi-language product creation</p>
    </div>

    <!-- COMMON -->
    <div class="field">
        <div class="field__label">Price</div>
        <input required type="text" inputmode="decimal" bind:value={price} />
    </div>

    <div class="field checkbox">
        <label>
            <input required type="checkbox" bind:checked={available} />
            Available
        </label>
    </div>

    <div class="field">
        <div class="field__label">Image</div>
        <input
            required
            type="file"
            accept="image/*"
            onchange={(e) => {
                imageFile = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
            }}
        />
    </div>

    <div class="divider"></div>

    <!-- EN -->
    <div class="section-title">English</div>

    <div class="field">
        <div class="field__label">Name (EN)</div>
        <input required bind:value={nameEn} />
    </div>

    <div class="field">
        <div class="field__label">Description (EN)</div>
        <textarea required bind:value={descriptionEn}></textarea>
    </div>

    <div class="field">
        <div class="field__label">Category (EN)</div>
        <input required bind:value={categoryEn} />
    </div>

    <div class="divider"></div>

    <!-- RU -->
    <div class="section-title">Русский</div>

    <div class="field">
        <div class="field__label">Название (RU)</div>
        <input required bind:value={nameRu} />
    </div>

    <div class="field">
        <div class="field__label">Описание (RU)</div>
        <textarea required bind:value={descriptionRu}></textarea>
    </div>

    <div class="field">
        <div class="field__label">Категория (RU)</div>
        <input required bind:value={categoryRu} />
    </div>

    <button
        class="submit-btn"
        type="submit"
        disabled={loading}
    >
        {loading ? "Creating..." : "Create Product"}
    </button>
</form>

<style>
    .product-card {
        display: flex;
        flex-direction: column;
        gap: 16px;

        padding: 20px;
        border: 1px solid #e6e6e6;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        max-width: 600px;
    }

    .header {
        text-align: center;
        margin-bottom: 10px;
    }

    .header h2 {
        margin: 0;
        font-size: 26px;
    }

    .header p {
        margin: 4px 0 0;
        font-size: 14px;
        color: #666;
    }

    .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #444;
        margin-top: 10px;
    }

    .divider {
        height: 1px;
        background: #eee;
        margin: 10px 0;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .field__label {
        font-size: 16px;
        font-weight: 600;
        color: #444;
    }

    .field input,
    .field textarea {
        border: 1px solid #d8d8d8;
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 16px;
        background: #fafafa;
        outline: none;
        line-height: normal;
        font-family: "Roboto", sans-serif;
    }

    .field textarea {
        min-height: 80px;
        resize: vertical;
    }

    .field input:focus,
    .field textarea:focus {
        border-color: #999;
        background: #fff;
    }

    .product-card.submitted input:invalid,
    .product-card.submitted textarea:invalid {
        border-color: #ef4444;
        background: #fff5f5;
    }

    .checkbox {
        flex-direction: row;
        align-items: center;
    }

    .submit-btn {
        height: 48px;
        border: none;
        border-radius: 12px;
        background: #1e40af;
        color: white;
        font-weight: 400;
        cursor: pointer;
        margin-top: 25px;
        font-size: 18px;
    }

    .submit-btn:hover {
        background: #1d4ed8;
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>