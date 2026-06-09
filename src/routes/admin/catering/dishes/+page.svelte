<script>
    import ProductAddForm from '$lib/components/productAddForm.svelte';
    import ProductsList from '$lib/components/productList.svelte';
</script>

<ProductsList  />
<div class="divider"></div>
<ProductAddForm  />

<style>
    .divider {
        height: 1px;
        background: #eee;
        margin: 50px 0;
    }
</style>

