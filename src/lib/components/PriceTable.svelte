<script lang="ts">
	import { tableStore } from '$lib/stores';
	import { onMount } from 'svelte';

	let showColumnNamePopup = false;
	let newColumnName = '';
	let editingHeader: { row: number; index: number } | null = null;
	let headerEditValue = '';

	function addRow() {
		tableStore.addRow();
		tableStore.saveToStorage();
	}

	function removeRow() {
		tableStore.removeRow();
		tableStore.saveToStorage();
	}

	function showAddColumnPopup() {
		showColumnNamePopup = true;
		newColumnName = '';
	}

	function confirmAddColumn() {
		if (!newColumnName.trim()) {
			newColumnName = `T${getCurrentTCount()}`;
		}
		
		tableStore.addColumn(newColumnName);
		tableStore.saveToStorage();
		
		showColumnNamePopup = false;
		newColumnName = '';
	}

	function cancelAddColumn() {
		showColumnNamePopup = false;
		newColumnName = '';
	}

	function removeColumn() {
		tableStore.removeColumn();
		tableStore.saveToStorage();
	}

	function getCurrentTCount() {
		return $tableStore.headers.row1.length;
	}

	// Simple input handler
	function handleCellChange(rowIndex: number, colIndex: number, event: Event) {
		const target = event.target as HTMLInputElement;
		tableStore.updateCell(rowIndex, colIndex, target.value);
		tableStore.saveToStorage();
	}

	function startHeaderEdit(row: number, index: number, currentText: string) {
		editingHeader = { row, index };
		headerEditValue = currentText;
	}

	function finishHeaderEdit() {
		if (editingHeader) {
			tableStore.updateHeader(editingHeader.row, editingHeader.index, headerEditValue);
			tableStore.saveToStorage();
		}
		editingHeader = null;
		headerEditValue = '';
	}

	function handleHeaderKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			finishHeaderEdit();
		} else if (event.key === 'Escape') {
			editingHeader = null;
			headerEditValue = '';
		}
	}

	// T-header colors (using new theme variables)
	const tHeaderColors = [
		'bg-table-product text-gray-700',
		'bg-table-t1 text-white',
		'bg-table-t2 text-white',
		'bg-table-t3 text-white',
		'bg-table-t4 text-white',
		'bg-table-t5 text-white',
		'bg-table-t6 text-white',
		'bg-table-t7 text-white',
		'bg-table-t8 text-gray-700'
	];

	// En-header colors (using new theme variables)
	const enHeaderColors = [
		'bg-en-1 text-white',
		'bg-en-2 text-white',
		'bg-en-3 text-white',
		'bg-en-4 text-white',
		'bg-en-5 text-white',
		'bg-en-6 text-white',
		'bg-en-7 text-white',
		'bg-en-8 text-black',
		'bg-en-9 text-white',
		'bg-en-10 text-white',
		'bg-en-11 text-white',
		'bg-en-12 text-white',
		'bg-en-13 text-black',
		'bg-en-14 text-white',
		'bg-en-15 text-white',
		'bg-en-16 text-white',
		'bg-en-17 text-white',
		'bg-en-18 text-black',
		'bg-en-19 text-white',
		'bg-en-20 text-white',
		'bg-en-21 text-white',
		'bg-en-22 text-white',
		'bg-en-23 text-black',
		'bg-en-24 text-gray-700',
		'bg-en-25 text-white',
		'bg-en-26 text-white',
		'bg-en-27 text-white',
		'bg-en-28 text-black'
	];

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey && e.key === 's') {
				e.preventDefault();
				tableStore.saveToStorage();
			}
		});
	});
</script>

<!-- Full width container like original -->
<div class="w-full border-4 border-blue-500 rounded-xl bg-white shadow-xl overflow-hidden">
	<!-- Scroll Hint -->
	<div class="text-center text-xs text-gray-500 italic py-2 bg-gray-50">
		← Tabloyu sağa sola kaydırmak için scroll kullanın →
	</div>

	<!-- Table Container with horizontal scroll -->
	<div class="overflow-x-auto overflow-y-visible" style="scrollbar-width: thin;">
		<table class="w-full min-w-full text-xs border-collapse">
			<thead>
				<!-- First header row -->
				<tr>
					<!-- Ürün Adı with rowspan=2 -->
					<th rowspan="2" class="sticky left-0 z-50 p-2 bg-gray-200 border border-gray-400 font-bold text-gray-700 min-w-24 shadow-lg">
						Ürün Adı
					</th>
					<!-- T-headers -->
					{#each $tableStore.headers.row1.slice(1) as header, index}
						<th 
							class="p-2 font-bold cursor-pointer transition-all hover:scale-105 border border-gray-400 text-center min-w-16 {tHeaderColors[index + 1] || 'bg-gray-600 text-white'}"
							colspan={header.colSpan}
							ondblclick={() => startHeaderEdit(1, index + 1, header.text)}
						>
							{#if editingHeader?.row === 1 && editingHeader?.index === index + 1}
								<input 
									type="text" 
									bind:value={headerEditValue} 
									class="bg-transparent font-bold text-center w-full outline-none"
									onblur={finishHeaderEdit}
									onkeydown={handleHeaderKeydown}
								/>
							{:else}
								{header.text}
							{/if}
						</th>
					{/each}
					<!-- Add Column Button -->
					<th class="bg-gray-100 border-2 border-dashed border-blue-500 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-600 transition-all font-bold text-blue-500 text-xs p-2 min-w-16" 
						rowspan="2"
						onclick={showAddColumnPopup}>
						+ Sütun<br/>Ekle
						<button 
							class="bg-red-500 text-white text-xs px-1 py-0.5 rounded ml-1 hover:bg-red-600"
							onclick={(e) => { e.stopPropagation(); removeColumn(); }}
						>
							Sil
						</button>
					</th>
				</tr>
				
				<!-- Second header row (En-headers) -->
				<tr>
					<!-- Skip first column because of rowspan -->
					{#each $tableStore.headers.row2.slice(1) as header, index}
						<th 
							class="p-2 cursor-pointer transition-all hover:scale-105 border border-gray-400 text-center font-bold min-w-16 {enHeaderColors[index] || 'bg-gray-300'}"
							ondblclick={() => startHeaderEdit(2, index + 1, header.text)}
						>
							{#if editingHeader?.row === 2 && editingHeader?.index === index + 1}
								<input 
									type="text" 
									bind:value={headerEditValue} 
									class="bg-transparent font-bold text-center w-full outline-none"
									onblur={finishHeaderEdit}
									onkeydown={handleHeaderKeydown}
								/>
							{:else}
								{header.text}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each $tableStore.rows as row, rowIndex}
					<tr>
						{#each row as cell, colIndex}
							<td class="p-0 border border-gray-300 bg-gray-50 text-center text-xs {colIndex === 0 ? 'sticky left-0 z-30 bg-gray-100 border-r-2 border-r-blue-500 font-bold shadow-lg min-w-24' : 'min-w-16'}">
								<input 
									type="text" 
									value={cell}
									class="w-full h-full p-1 border-none bg-transparent text-center text-xs outline-none {colIndex === 0 ? 'font-bold' : ''}"
									oninput={(e) => handleCellChange(rowIndex, colIndex, e)}
								/>
							</td>
						{/each}
						<!-- Empty cell for column controls -->
						<td class="p-1 border border-gray-300 bg-gray-50 min-w-16"></td>
					</tr>
				{/each}
				
				<!-- Add Row Button Row -->
				<tr>
					<td 
						class="bg-gray-100 border-2 border-dashed border-green-500 text-center cursor-pointer hover:bg-green-50 hover:border-green-600 transition-all font-bold text-green-500 text-xs p-2"
						colspan={$tableStore.headers.row2.length + 1}
						onclick={addRow}
					>
						+ Yeni Satır Ekle
						<button 
							class="bg-red-500 text-white text-xs px-2 py-0.5 rounded ml-2 hover:bg-red-600"
							onclick={(e) => { e.stopPropagation(); removeRow(); }}
						>
							Son Satırı Sil
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<!-- Column Name Popup -->
{#if showColumnNamePopup}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white border-2 border-blue-500 rounded-lg p-6 min-w-80 shadow-xl">
			<h3 class="text-lg font-bold text-blue-600 mb-4 text-center">📊 Yeni Sütun İsmi</h3>
			<input 
				type="text" 
				bind:value={newColumnName}
				placeholder="Örnek: T9, Seviye9, Özel vb."
				maxlength="20"
				class="w-full p-3 text-sm border-2 border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
				onkeydown={(e) => e.key === 'Enter' && confirmAddColumn()}
			/>
			<div class="flex gap-3 justify-center">
				<button 
					class="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
					onclick={confirmAddColumn}
				>
					✅ Ekle
				</button>
				<button 
					class="px-4 py-2 text-sm font-bold bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
					onclick={cancelAddColumn}
				>
					❌ İptal
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for table */
	div::-webkit-scrollbar {
		height: 12px;
	}
	
	div::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 6px;
	}
	
	div::-webkit-scrollbar-thumb {
		background: #007bff;
		border-radius: 6px;
	}
	
	div::-webkit-scrollbar-thumb:hover {
		background: #0056b3;
	}

	/* Ensure full table width */
	table {
		table-layout: auto;
		border-spacing: 0;
	}
	
	th, td {
		white-space: nowrap;
		font-size: 11px;
	}
	
	th:first-child, td:first-child {
		min-width: 100px;
		width: 100px;
	}
</style> 