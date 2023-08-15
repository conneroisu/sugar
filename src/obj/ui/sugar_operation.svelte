<script lang="ts">
	let columns = ["Type", "Details"];
	let data = [
		["CREATE", "john@example.com"],
		["DELETE", "file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["RENAME", "file_name.md → new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
	];
	let newRow = [...columns];

	function getClass(cell: string): string {
		if (cell.toUpperCase() === "CREATE") {
			return "create";
		} else if (cell.toUpperCase() === "DELETE") {
			return "delete";
		} else if (cell.toUpperCase() === "MOVE") {
			return "move";
		} else if (cell.toUpperCase() === "RENAME") {
			return "rename";
		} else {
			return "";
		}
	}
</script>

<div class="mod-cta" />
<h1 class="header">Sugar Operations</h1>
<div class="actionsDiv">
	<table class="actionTable">
		{#each data as row}
			<tr>
				{#each row as cell}
					<td
						contenteditable="false"
						bind:innerHTML={cell}
						class={getClass(cell)}
					/>
				{/each}
			</tr>
		{/each}
	</table>
</div>

<style>
	.mod-cta {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.create {
		color: #00ff00;
	}
	.delete {
		color: #ff0000;
	}
	.move {
		color: #0000ff;
	}
	.rename {
		color: orange;
	}
	.actionTable {
		width: 100%;
		border-collapse: collapse;
		overflow: scroll;
		scrollbar-width: 1em;
	}
	.actionsDiv {
		overflow: scroll;
		scrollbar-width: 2em;
		margin-top: 1.5vh;
		scrollbar-color: #ff0000 #0000ff;
		height: 40vh;
	}
	.header {
		font: 1.2em sans-serif;
	}
</style>
