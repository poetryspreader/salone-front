import { writable } from "svelte/store";
import { goto } from "$app/navigation";

export const token = writable<string | null>(null);

export function setToken(t: string) {
    localStorage.setItem("token", t);
    token.set(t);
}

export function initAuth() {
    if (typeof window === "undefined") return;

    token.set(localStorage.getItem("token"));
}

export function logout() {
    localStorage.removeItem("token");
    token.set(null);
    void goto("/");
}