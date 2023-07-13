import {Notice, TextFileView, WorkspaceLeaf} from "obsidian";

import * as React from "react";
import Sugar from "./sugar";
import {SugarReactView} from './sugar-react';
import {createRoot} from "react-dom/client";
import SugarPlugin from "src/main";
import {resolve_tfile} from "./util";

export const SUGAR_VIEW_TYPE = "sugar-view";
export const FILE_EXTENSIONS = [".sugar"]
export const SUGAR_ICON = 'mountain'

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
	setViewData(data: string, clear?: boolean): void {
		if (clear) {
			this.data = "";
		}
		this.data = data;
	}

	getViewData(): string {
		return this.data;
	}

	getViewType(): string {
		return SUGAR_VIEW_TYPE;
	}

	clear(): void {
		this.data = "";
	}

	getDisplayText(): string {
		return "Sugar View";
	}

	getIcon(): string {
		return SUGAR_ICON;
	}

	async onOpen(): Promise<void> {
		const root = createRoot(this.containerEl.children[1]);
		root.render(
			<React.StrictMode>
				<SugarReactView />,
			</React.StrictMode>
		);
		new Notice("Sugar View Opened");
		this.onLoadFile(resolve_tfile(this.path));
	}

	async onClose() {
		if (this.plugin.settings.debug) {
			console.log("closing sugar view")
		}
		this.leaf.detach();
	}
}
