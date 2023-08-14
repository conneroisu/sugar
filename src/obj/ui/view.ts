import { Modal } from "obsidian";
import SugarPlugin from "../../main";
import SugarOperation from "./sugar_operation.svelte";

export const VIEW_TYPE = "sugar-operation";

export class SugarOperationView extends Modal {
	view: SugarOperation;
	plugin: SugarPlugin;


	async onOpen() {
		this.view = new SugarOperation({
			target: this.contentEl,
		});
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();	
	}
}
