import {WorkspaceLeaf, Notice, TFile, TextFileView} from "obsidian";
import SugarPlugin from "src/main";
import {App} from "obsidian";

export const SUGAR_VIEW_TYPE = "sugar-view";

export const FILE_EXTENSIONS = ".sugar";

export default class Sugar {
	plugin: SugarPlugin;
	app: App;

	/**  
	* Consdtructs a s Sugar Rock object 
	**/
	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app
	}

	/**
	 * Command to open the sugar view of Type SugarView
	 **/
	async open_oil() {
		// if a sugar view is open in the current workspace, open the previous directory
		// if (this.isOpen) {
		// 	this.go_to_parent();
		// }


		if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length > 0) {
			this.app.workspace.detachLeavesOfType(SUGAR_VIEW_TYPE);
		}
		// create a new leaf if there are no other leaves open
		else if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length === 0) {
			await this.app.workspace.getLeaf(true).setViewState({
				type: SUGAR_VIEW_TYPE,
				active: true,
			});
		}





		return;
	}




	processViewContent() {

		this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).forEach((leaf) => {
			if (leaf.view instanceof SugarView) {
				leaf.openFile
			}
		});
	}


}


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
