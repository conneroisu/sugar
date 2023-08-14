import { App, Modal, Setting } from "obsidian";
import SugarPlugin from "../../main";
import OperationsModal from "./sugar_operation.svelte";
import store from "./store";
import Sugar from '../sugar';

export const VIEW_TYPE = "sugar-operation";

export class SugarOperationView extends Modal {
	view: OperationsModal;
	plugin: SugarPlugin;
	
	onSubmit: () => void;
	sugar: Sugar;

	constructor(app: App, sugar:Sugar) {
		super(app);
		this.sugar = sugar;
	}

	async onOpen() {
		store.plugin.set(this.plugin);

		this.view = new OperationsModal({
			target: this.contentEl,
		});

		const { contentEl } = this;

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Accept")
				.setTooltip("Accept All Operations")
				.setCta()
				.onClick(() => {
					this.close();
					this.accept();
				})
		);
	}

	accept() {
		this.sugar.accept_operations();
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
