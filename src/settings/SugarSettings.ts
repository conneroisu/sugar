/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/settings/SugarSettings.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Tuesday, July 11th 2023, 6:05:47 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

/**
 * This is the interface for the settings of the plugin, Sugar.
 **/
export interface SugarSettings {
	sugar_directory: string;
	hide_sugar_directory: boolean;
	show_hidden: boolean;
	no_extension_markdown_default: boolean;
	debug: boolean;
}

/**
 * Default settings for the plugin, Sugar.
 * It is used when the plugin is first installed.
 **/
export const DEFAULT_SETTINGS: SugarSettings = {
	sugar_directory: "sugar",
	hide_sugar_directory: true,
	show_hidden: true,
	no_extension_markdown_default: true,
	debug: false,
};
