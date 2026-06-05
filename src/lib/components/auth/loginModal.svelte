<script lang="ts">
    import { PUBLIC_API_URL } from '$env/static/public';
    export let open = false;
    export let onClose: () => void;

    import { setToken } from "$lib/stores/auth";

    let identifier = "";
    let password = "";

    async function login() {
        const res = await fetch(`${PUBLIC_API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();

        if (res.ok) {
            setToken(data.token);
            onClose();
        } else {
            alert("Login failed");
        }
    }
</script>

{#if open}
    <div class="overlay" on:click={onClose}>
        <div class="modal" on:click={(e) => e.stopPropagation()}>

            <h2>Welcome back</h2>
            <p class="subtitle">Sign in to continue</p>

            <div class="form">
                <label>
                    <span>Email or login</span>
                    <input
                            placeholder="you@example.com"
                            bind:value={identifier}
                    />
                </label>

                <label>
                    <span>Password</span>
                    <input
                            type="password"
                            placeholder="••••••••"
                            bind:value={password}
                    />
                </label>

                <button class="primary" on:click={login}>
                    Login
                </button>

                <button class="secondary" on:click={onClose}>
                    Cancel
                </button>
            </div>

        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }

    .modal {
        width: 380px;
        background: #ffffff;
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        gap: 14px;
        animation: pop 0.25s ease;
    }

    h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: #111827;
    }

    .subtitle {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 10px;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;
        color: #6b7280;
    }

    input {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        outline: none;
        font-size: 14px;
        transition: 0.2s ease;
        background: #fafafa;
    }

    input:focus {
        border-color: #6366f1;
        background: white;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    button {
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s ease;
        border: none;
    }

    .primary {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
    }

    .primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
    }

    .secondary {
        background: transparent;
        color: #6b7280;
    }

    .secondary:hover {
        background: #f3f4f6;
        color: #111827;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes pop {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
</style>