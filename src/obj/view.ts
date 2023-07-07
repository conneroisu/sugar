import {Notice, TextFileView, TFile, WorkspaceLeaf} from "obsidian";
import SugarPlugin from "src/main";

import Sugar from "./sugar";

export const SUGAR_VIEW_TYPE = "sugar-view";

export const FILE_EXTENSIONS = ".sugar";

export class SugarView extends TextFileView {
	file: TFile;

	getViewData(): string {
		throw new Error("Method not implemented.");
	}
	plugin: SugarPlugin;
	/** 
	 * Constructs the sugar view 
	 **/
	constructor(leaf: WorkspaceLeaf, sugar: Sugar) {
		super(leaf);
		this.plugin = sugar.plugin;
		this.setViewData("fdaa", false)
	}
	/** 
	 * Get the view type of the sugar view 
	 **/
	getViewType(): string {
		return SUGAR_VIEW_TYPE;
	}
	setViewData(data: string, clear: boolean): void {
		// this.contentEl.createEl()
		this.data = "heelo"
	}


	clear(): void {
		this.data = "";
	}
	getDisplayText(): string {
		return "Sugar View";
	}

	getIcon(): string {
		return "mountain";
	}
	async onOpen(): Promise<void> {
		new Notice("Sugar View Opened");
	}

	async onUnloadFile(file: TFile): Promise<void> {

	}

	async onClose() {}

	canAcceptExtension(extension: string): boolean {
		return FILE_EXTENSIONS.contains(extension);
	}




}
