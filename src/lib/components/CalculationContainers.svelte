<script lang="ts">
	import { containersStore, tableStore, totalsStore } from '$lib/stores';
	import type { ContainerData } from '$lib/stores';

	$: availableProducts = $tableStore.rows
		.map(row => row[0])
		.filter(product => product && product.trim() !== '');

	function addContainer() {
		containersStore.addContainer();
		containersStore.saveToStorage();
	}

	function removeContainer(id: number) {
		if ($containersStore.length > 1) {
			containersStore.removeContainer(id);
			containersStore.saveToStorage();
		}
	}

	function updateContainer(id: number, field: keyof ContainerData, value: any) {
		containersStore.updateContainer(id, { [field]: value });
		containersStore.saveToStorage();
	}

	function getSubLevelOptions(level: number) {
		if (level <= 3) {
			return [{ value: 0, text: 'En0' }];
		}
		return Array.from({ length: 5 }, (_, i) => ({ 
			value: i, 
			text: `En${i}` 
		}));
	}

	// Color classes for containers (using new theme variables)
	const containerColors = [
		'border-box-1',
		'border-box-2',
		'border-box-3',
		'border-box-4',
		'border-box-5',
		'border-box-6',
		'border-box-7',
		'border-box-8'
	];

	const boxIndicatorColors = [
		'bg-box-1',
		'bg-box-2',
		'bg-box-3',
		'bg-box-4',
		'bg-box-5',
		'bg-box-6',
		'bg-box-7',
		'bg-box-8'
	];
</script>

<div class="flex flex-col gap-2">
	<!-- Dynamic Containers -->
	<div class="flex flex-wrap gap-2">
		{#each $containersStore as container, index (container.id)}
			<div class="w-40 p-3 bg-gray-100 border-2 {containerColors[index] || 'border-gray-500'} rounded-lg shadow-sm">
				<!-- Container Header -->
				<div class="flex justify-between items-center mb-3">
					<span class="text-xs font-bold text-gray-600">Kutu {container.id}</span>
					<div class="flex gap-1">
						{#if index === $containersStore.length - 1 && $containersStore.length < 8}
							<button 
								class="w-4 h-4 border border-green-600 text-green-600 rounded text-xs font-bold hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center"
								onclick={addContainer}
								title="Yeni Kutu Ekle"
							>
								+
							</button>
						{/if}
						{#if $containersStore.length > 1}
							<button 
								class="w-4 h-4 border border-red-600 text-red-600 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
								onclick={() => removeContainer(container.id)}
								title="Kutuyu Sil"
							>
								×
							</button>
						{/if}
					</div>
				</div>

				<!-- Product Selection -->
				<div class="mb-3">
					<label class="block text-xs font-semibold text-gray-600 mb-1">Ürün Seçiniz:</label>
					<select 
						class="w-full p-1 text-xs border border-gray-300 rounded bg-white focus:border-blue-500 focus:outline-none"
						value={container.product}
						onchange={(e) => updateContainer(container.id, 'product', (e.target as HTMLSelectElement).value)}
					>
						<option value="">Seçiniz</option>
						{#each availableProducts as product}
							<option value={product}>{product}</option>
						{/each}
					</select>
				</div>

				<!-- Level Selection -->
				<div class="mb-3">
					<label class="block text-xs font-semibold text-gray-600 mb-1">Seviye Seçiniz (T1 - T8):</label>
					<select 
						class="w-full p-1 text-xs border border-gray-300 rounded bg-white focus:border-blue-500 focus:outline-none"
						value={container.level}
						onchange={(e) => updateContainer(container.id, 'level', parseInt((e.target as HTMLSelectElement).value))}
					>
						{#each Array(8) as _, i}
							<option value={i + 1}>T{i + 1}</option>
						{/each}
					</select>
				</div>

				<!-- Sub Level Selection -->
				<div class="mb-3">
					<label class="block text-xs font-semibold text-gray-600 mb-1">Alt Seviye Seçiniz:</label>
					<select 
						class="w-full p-1 text-xs border border-gray-300 rounded bg-white focus:border-blue-500 focus:outline-none"
						value={container.subLevel}
						onchange={(e) => updateContainer(container.id, 'subLevel', parseInt((e.target as HTMLSelectElement).value))}
					>
						{#each getSubLevelOptions(container.level) as option}
							<option value={option.value}>{option.text}</option>
						{/each}
					</select>
				</div>

				<!-- Quantity Input -->
				<div class="mb-3">
					<label class="block text-xs font-semibold text-gray-600 mb-1">Miktar Giriniz:</label>
					<input 
						type="number" 
						class="w-full p-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
						min="0" 
						value={container.quantity}
						oninput={(e) => updateContainer(container.id, 'quantity', parseFloat((e.target as HTMLInputElement).value) || 0)}
					/>
				</div>

				<!-- Result -->
				<div class="p-2 bg-blue-50 border border-blue-200 rounded text-center">
					<div class="text-xs font-semibold text-gray-600 mb-1">Toplam Fiyat:</div>
					<div class="text-xs font-bold text-blue-600">
						{$totalsStore.containerTotals[index]?.toFixed(2) || '0.00'}
					</div>
				</div>
			</div>
		{/each}

		<!-- Add Container Button (if less than 8 containers) -->
		{#if $containersStore.length < 8}
			<button 
				class="w-40 h-32 border-2 border-dashed border-green-500 bg-green-50 text-green-500 rounded-lg font-bold text-sm hover:bg-green-100 hover:border-green-600 transition-all flex items-center justify-center"
				onclick={addContainer}
			>
				+ Yeni Kutu Ekle
			</button>
		{/if}
	</div>
</div> 