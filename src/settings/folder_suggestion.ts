/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/settings/folder_suggestion.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Tuesday, July 11th 2023, 6:05:47 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { TAbstractFile, TFolder } from "obsidian";
import { TextInputSuggest } from "./suggestion_handler";

export class FolderSuggest extends TextInputSuggest<TFolder> {
	getSuggestions(inputStr: string): TFolder[] {
		const abstractFiles = app.vault.getAllLoadedFiles();
		const folders: TFolder[] = [];
		const lowerCaseInputStr = inputStr.toLowerCase();

		abstractFiles.forEach((folder: TAbstractFile) => {
			if (
				folder instanceof TFolder &&
				folder.path.toLowerCase().contains(lowerCaseInputStr) &&
				folder.path != "/"
			) {
				folders.push(folder);
			}
		});

		return folders;
	}

	renderSuggestion(file: TFolder, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFolder): void {
		this.inputEl.value = file.path;
		this.inputEl.trigger("input");
		this.close();
	}
}
