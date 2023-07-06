
/**
 * This is the interface for the settings of the plugin, Sugar.
 **/
export interface SugarSettings {
	show_hidden: boolean;
	no_extension_markdown_default: boolean;
	debug: boolean;
}

/**
 * Default settings for the plugin, Sugar.
 * It is used when the plugin is first installed.
 **/
export const DEFAULT_SETTINGS: SugarSettings = {
	show_hidden: true,
	no_extension_markdown_default: true,
	debug: false,
};
