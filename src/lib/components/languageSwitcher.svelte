<script>
    import { language } from "$lib/stores/language";
</script>
<div class="language-switch">
    <button
        class:active={$language === "en"}
        onclick={() => language.set("en")}
    >
        EN
    </button>

    <button
        class:active={$language === "ru"}
        onclick={() => language.set("ru")}
    >
        RU
    </button>
</div>
<style>
    .language-switch {
        display: flex;
        gap: 6px;
    }

    .language-switch button {
        border: 1px solid #e5e7eb;
        background: white;
        padding: 8px 14px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: 0.2s;
    }

    .language-switch button:hover {
        background: #f9fafb;
    }

    .language-switch button.active {
        background: #111827;
        color: white;
        border-color: #111827;
    }
</style>