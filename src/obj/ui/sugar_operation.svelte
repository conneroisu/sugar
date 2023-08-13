<script lang="ts">
	import type SugarPlugin from "src/main";

	let plugin: SugarPlugin;
	store.plugin.subscribe((p) => (plugin = p));

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
