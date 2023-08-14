import {writable} from "svelte/store";
import SugarPlugin from "../../main";

const plugin = writable<SugarPlugin>();
export default {plugin};
