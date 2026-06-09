<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import LoginModal from '$lib/components/auth/loginModal.svelte';
	import { onMount } from "svelte";
	import { initAuth, token, logout } from "$lib/stores/auth.ts";
	import { page } from '$app/state';
	import logoutIcon from '$lib/assets/logout.png';

	let { children } = $props();
	let showLogin = $state(false);

	onMount(() => {
		initAuth();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- FONTS -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<!--	<script src="https://telegram.org/js/telegram-web-app.js"></script>-->
</svelte:head>

<header>
	<div class="top">
		<div class="logo">Salone</div>

		{#if $token}
<!--			<button onclick={logout}>Logout</button>-->
			<button onclick={logout} class="btn">
				<img src={logoutIcon} alt="logout" class="icon" />
			</button>
		{:else}
			<button onclick={() => (showLogin = true)}>login</button>
		{/if}
	</div>
	<nav class="nav">
		<a class:nav-active={page.url.pathname === "/"} href="/">Home</a>
		{#if $token}
			<a class:nav-active={page.url.pathname.startsWith("/admin")} href="/admin">
				Admin
			</a>
		{/if}

	</nav>
</header>

<main>
	<div class="background">
		<div class="main">
			{@render children()}
		</div>
	</div>
</main>

<LoginModal
	bind:open={showLogin}
	onClose={() => (showLogin = false)}
/>

<footer>
	<div class="social-media">
		<div class="title">Перейти в соцсети</div>
		<div class="links">
			<a href="https://www.instagram.com/salonelimassol/">
				<img class="link" src="/images/social.png" alt="Instagram" />
			</a>
		</div>
	</div>
</footer>

<style>
	header {
		position: relative;
	}

	.main {
		max-width: 550px;
		margin: 35px auto 0;
		padding: 0 25px;
	}
	.top {
		width: 100%;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		button {
			height: 18px;
			margin-left: auto;
			border: none;
			background: transparent;
			cursor: pointer;
			img {
				width: 18px;
				height: 18px;
				object-fit: contain;
				transition: transform 0.25s ease;
				transform: scale(1);
			}
			img:hover {
				transform: scale(1.2);
			}
		}
	}
	.top button:hover {
		color: #2263ae;
		text-decoration: underline;
	}
	.logo {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 28px;
	}
	.nav {
		display: flex;
		text-align: center;
		gap: 20px;
		margin: 0 0 0 25px;
		a {
			text-decoration: none;
			font-size: 15px;
			color: black;
		}
	}
	.nav a.nav-active {
		color: #7e7e7e;
	}

	footer {
		margin: 40px 0 0 0;
		padding: 20px 0;
		border-top: 1px solid #e5e5e5;
	}

	footer .social-media {
		margin: 0 auto;
		max-width: 750px;
		text-align: center;
	}

	.links {
		margin: 15px 0 0 0;
	}

	.links .link {
		width: 45px;
	}
</style>
