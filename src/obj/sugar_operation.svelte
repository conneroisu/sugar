<script>
	/*
	 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/obj/sugar_operation.svelte
	 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
	 * Created Date: Sunday, July 23rd 2023, 9:37:36 pm
	 * Author: Conner Ohnesorge
	 * MIT License
	 * Copyright (c) 2023 Conner Ohnesorge
	 */

	let columns = ["Operation", "Details"];
	let data = [
		["CREATE", "john@example.com"],
		["DELETE", "file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["RENAME", "file_name.md → new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
	];
	let newRow = [...columns];

	function addRow() {
		data = [...data, [...newRow]];
		newRow = columns;
	}

	function deleteRow(rowToBeDeleted) {
		data = data.filter((row) => row != rowToBeDeleted);
	}
</script>

<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>

	{#each data as row}
		<tr>
			{#each row as cell}
				<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
			<button on:click={() => deleteRow(row)}> X </button>
		</tr>
	{/each}
</table>

<style>
</style>
