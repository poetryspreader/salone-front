<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { page } from '$app/state';

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- FONTS -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
<!--	<script src="https://telegram.org/js/telegram-web-app.js"></script>-->
</svelte:head>

<header>
	<div class="logo">
		Salone
	</div>
	<nav class="nav">
		<a class:nav-active={page.url.pathname === "/"} href="/">Home</a>
		<a class:nav-active={page.url.pathname === "/tips"} href="/tips">Tips</a>
		<a class:nav-active={page.url.pathname === "/schedule"} href="/schedule">Schedule</a>
	</nav>
</header>

<main>
	<div class="main">
		{@render children()}
	</div>
</main>

<style>
	.main {
		margin: 0 25px;
	}
	.logo {
		width: 100%;
		text-align: center;
		margin: 20px auto;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 28px;
		font-family: "Google Sans Flex", sans-serif;
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
</style>
