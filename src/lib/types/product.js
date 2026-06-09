import { writable } from "svelte/store";

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {{en: string, ru: string}} name
 * @property {{en: string, ru: string}} description
 * @property {{en: string, ru: string}} category
 * @property {number} price
 * @property {boolean} available
 * @property {string=} image
 */

/** @type {import('svelte/store').Writable<Product[]>} */
export const products = writable([]);