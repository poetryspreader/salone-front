<script>
    import {PUBLIC_API_URL} from "$env/static/public";
    import { token } from "$lib/stores/auth";
    import { products } from "$lib/stores/products";
    import LanguageSwitcher from "./languageSwitcher.svelte";
    import { language } from "$lib/stores/language";

    let loaded = false;

    async function loadProducts() {
        const res = await fetch(`${PUBLIC_API_URL}/api/products`, {
            headers: {
                Authorization: `Bearer ${$token}`
            }
        });

        products.set(await res.json());
    }

    $: if ($token && !loaded) {
        loaded = true;
        loadProducts();
    }

    async function deleteProduct(id) {
        const confirmed = confirm("Delete this product?");

        if (!confirmed) return;

        const res = await fetch(
            `${PUBLIC_API_URL}/api/products/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${$token}`
                }
            }
        );

        if (!res.ok) {
            alert("Failed to delete product");
            return;
        }

        products.update(items =>
            items.filter(item => item._id !== id)
        );
    }
</script>
<div class="header">
    <div>
        <div class="header__title">
            Menu
        </div>
        <div class="header__products-count">
            Products: {$products.length}
        </div>
    </div>
    <LanguageSwitcher />
</div>


{#if !loaded}
    <div class="empty">Loading...</div>
{:else if $products.length === 0}
    <div class="empty">No products found</div>
{:else}
    <div class="products">
        {#each $products as product}
            <div class="product-card">
                <button
                    class="delete-btn"
                    onclick={() => deleteProduct(product._id)}
                >
                    ✕
                </button>
                <img
                    src={product.image}
                    alt={product.name?.en}
                />
                <div class="content">
                    <div class="category">
                        {product.category?.[$language]}
                    </div>
                    <div class="content__name">{product.name?.[$language]}</div>
                    <div class="content__description">
                        {product.description?.[$language]}
                    </div>
                    <div class="price">
                        {product.price}€
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .header__title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
    }

    .header__products-count {
        margin-top: 6px;
        color: #666;
    }

    .products {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin: 15px 0 0 0;
    }

    .product-card {
        position: relative;
        display: flex;
        gap: 16px;

        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 14px;
    }

    .delete-btn {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 50%;
        background: #f3f4f6;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
    }

    .delete-btn:hover {
        background: #fee2e2;
        color: #dc2626;
    }

    img {
        width: 120px;
        height: 120px;
        border-radius: 12px;
        object-fit: cover;
        background: #f3f4f6;
    }

    .price {
        margin: 10px 0 0 0;
        color: #1e1e1e;
        font-size: 22px;
        font-weight: 700;
        font-family: "Roboto", sans-serif;
    }

    .content__name {
        margin: 10px 0 0 0;
        font-weight: 600;
        font-size: 20px;
        font-family: "Lora", serif;
    }
    .content__description {
        margin: 0;
        color: #666;
    }

    .category {
        display: inline-block;
        width: fit-content;
        background: #fbfb55;
        border-radius: 999px;
        padding: 2px 12px;
        font-size: 13px;
    }

    .empty {
        text-align: center;
        padding: 40px;
        border-radius: 16px;
        border: 1px dashed #d1d5db;
        color: #666;
    }
</style>