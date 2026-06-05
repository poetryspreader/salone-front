<script>
import calculatorIcon from "$lib/assets/calculator.png";
import cateringOrdersIcon from "$lib/assets/catering-online-orders.png";
import cateringDishes from "$lib/assets/catering-dishes.png";
</script>

<nav class="admin-nav">
    <a href="/admin/tips">
        <span>Tips Calculator</span>
        <img src={calculatorIcon} alt="logout" class="icon" />
    </a>
    <a href="/admin/catering/orders">
        <span>Catering Orders</span>
        <img src={cateringOrdersIcon} alt="logout" class="icon" />
    </a>
    <a href="/admin/catering/dishes">
        <span>Catering Dishes</span>
        <img src={cateringDishes} alt="logout" class="icon" />
    </a>
</nav>
<style>
    .admin-nav {
        display: flex;
        gap: 10px;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;
        font-size: 14px;
    }

    .admin-nav a {
        display: flex;
        align-items: center;
        text-decoration: none;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 999px;
        padding: 10px 16px;
        transition: all 0.2s ease;
        gap: 10px;
    }

    .admin-nav a:hover {
        background: #eff6ff;
        border-color: #93c5fd;
        color: #1d4ed8;
        transform: translateY(-1px);
    }

    .admin-nav a img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }

    .admin-nav a span{
        font-family: "Roboto", sans-serif;
        color: #374151;
        font-size: 18px;
        font-weight: 450;
    }

</style>