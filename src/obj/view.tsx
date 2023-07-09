import {
	Notice, TextFileView, WorkspaceLeaf,
	HoverPopover
} from "obsidian";

import * as React from "react";
// import * as ReactDOM from "react-dom";
//// @ts-expect-error, not typed
// const editorView = view.editor.cm as EditorView;
import Sugar from "./sugar";

export const SUGAR_VIEW_TYPE = "sugar-view";

export const FILE_EXTENSIONS = [".sugar"]

import { SugarReactView } from './sugar-react';
import { createRoot } from "react-dom/client";
import SugarPlugin from "src/main";

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
		this.onLoadFile(this.plugin.sugar.resolve_tfile(this.path));
	}
	dom: HTMLElement;
	scrollDOM: HTMLElement;
	contentDOM: HTMLElement;
	hoverPopover: HoverPopover | null;
	setViewData(data: string, clear: boolean): void {
		if (clear) {
			this.data = "";
		}
		this.data = data;
	}

	getViewData(): string {
		return this.data;
	}

	/** 
	 * Get the view type of the sugar view 
	 **/
	getViewType(): string {
		return SUGAR_VIEW_TYPE;
	}


	clear(): void {
		this.data = "";
	}

	getDisplayText(): string {
		return this.path;
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
	}

	async onClose() {

		if (this.plugin.settings.debug) {
			console.log("closing sugar view")
		}

		this.leaf.detach();
	}


}
