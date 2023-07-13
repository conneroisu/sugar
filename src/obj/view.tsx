import {
	Notice, TextFileView, WorkspaceLeaf,
	HoverPopover
} from "obsidian";

import * as React from "react";
import Sugar from "./sugar";
import {SugarReactView} from './sugar-react';
import {createRoot} from "react-dom/client";
import SugarPlugin from "src/main";

export const SUGAR_VIEW_TYPE = "sugar-view";
export const FILE_EXTENSIONS = [".sugar"]
export const SUGAR_ICON = 'mountain'

/** 
 * Sugar View
 **/
export class SugarView extends TextFileView {
	sugar: Sugar;
	path: string;
	plugin: SugarPlugin;

	/** 
	 * Constructs the sugar view 
	 **/
	constructor(leaf: WorkspaceLeaf, sugar: Sugar, path: string) {
		super(leaf);
		this.icon = SUGAR_ICON;
		this.plugin = sugar.plugin;
		this.sugar = sugar;
		this.path = path;
	}
	dom: HTMLElement;
	scrollDOM: HTMLElement;
	contentDOM: HTMLElement;
	hoverPopover: HoverPopover | null;
	setViewData(data: string, clear?: boolean): void {

		if (clear) {
			this.data = "";
		}
		this.data = data;
	}

	/** 
	 * Get the view data of the sugar View 
	 **/
	getViewData(): string {
		return this.data;
	}

	/** 
	 * Get the view type of the sugar view 
	 **/
	getViewType(): string {
		return SUGAR_VIEW_TYPE;
	}


	/** 
	* Clears the sugar View 
	**/
	clear(): void {
		this.data = "";
	}


	getDisplayText(): string {
		return "Sugar View";
	}

	getIcon(): string {
		return SUGAR_ICON;
	}
	/** 
	 * Runs when the sugar view is Opened 
	 **/
	async onOpen(): Promise<void> {
		const root = createRoot(this.containerEl.children[1]);
		root.render(
			<React.StrictMode>
				<SugarReactView />,
			</React.StrictMode>
		);
		new Notice("Sugar View Opened");
		this.onLoadFile(this.plugin.sugar.resolve_tfile(this.path));
	}
	/** 
	* Runs when the sugar view is closed
	**/
	async onClose() {

		if (this.plugin.settings.debug) {
			console.log("closing sugar view")
		}
		this.leaf.detach();
	}
}
