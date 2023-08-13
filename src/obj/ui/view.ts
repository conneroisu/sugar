import { ItemView } from "obsidian";
import store from "./store";
import SugarPlugin from "../../main";
import SugarOperation from "./sugar_operation.svelte";

export const VIEW_TYPE = "sugar-operation";

export class SugarOperationView extends ItemView {
	view: SugarOperation;
	plugin: SugarPlugin;

	getViewType(): string {
		return VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Sugar Operation";
	}

	getIcon(): string {
		return "moutain";
	}

	async onOpen() {
		store.plugin.set(this.plugin);
		this.view = new SugarOperation({
			target: this.contentEl,
			props: {
				variable: 1,
			},
		});
	}

	async onClose() {
		this.view.$destroy();
	}
}
