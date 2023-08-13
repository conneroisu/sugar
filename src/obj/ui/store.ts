import {writable} from "svelte/store";
import type SugarPlugin from "src/main";

const plugin = writable<SugarPlugin>();
export default {plugin};
