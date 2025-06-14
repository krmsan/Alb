<script lang="ts">
	import { totalsStore, containersStore, optionsStore } from '$lib/stores';
	console.log($totalsStore);

	function updatePremium(event: Event) {
		const value = (event.target as HTMLSelectElement).value as any;
		optionsStore.updatePremium(value);
		optionsStore.saveToStorage();
	}

	function updateFee(event: Event) {
		const value = (event.target as HTMLInputElement).value as any;
		optionsStore.updateFee(value);
		optionsStore.saveToStorage();
	}

	// Box indicator colors (using new theme variables)
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

<div class="flex gap-2 justify-center">
	{$totalsStore.containerTotals}
	<!-- Resources Total Box -->
	<div class="flex-1 max-w-md p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-lg shadow-lg">
		<h4 class="text-sm font-bold text-green-700 mb-3 text-center">🔨 Kaynaklar</h4>
		
		<!-- Box Indicators for Resources (first 2 containers) -->
		<div class="flex justify-center items-center gap-2 mb-3">
			{#each $containersStore.slice(0, 2) as container, index}
				{#if index > 0}
					<span class="text-sm font-bold text-gray-600">+</span>
				{/if}
				<div class="w-4 h-4 {boxIndicatorColors[index]} border-2 border-current rounded flex items-center justify-center text-xs font-bold text-white">
					{index + 1}
				</div>
			{/each}
		</div>

		<div class="text-center">
			<div class="text-lg font-bold text-green-700 border-t-2 border-green-500 pt-2">
				Kaynaklar Fiyatı: {$totalsStore.resources.toFixed(2)}
			</div>
		</div>
	</div>

	<!-- Total Cost Box -->
	<div class="flex-1 max-w-lg p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500 rounded-lg shadow-lg">
		<div class="flex justify-between items-start gap-4">
			<!-- Left side - Total info -->
			<div class="flex-1">
				<h4 class="text-sm font-bold text-yellow-700 mb-3 text-center">💰 Toplam Maliyet</h4>
				
				<!-- Box Indicators for All Containers -->
				<div class="flex justify-center items-center gap-1 mb-3 flex-wrap">
					{#each $containersStore as container, index}
						{#if index > 0}
							<span class="text-xs font-bold text-gray-600">+</span>
						{/if}
						<div class="w-4 h-4 {boxIndicatorColors[index]} border-2 border-current rounded flex items-center justify-center text-xs font-bold text-white">
							{index + 1}
						</div>
					{/each}
				</div>

				<div class="text-center">
					<div class="text-lg font-bold text-yellow-700 border-t-2 border-yellow-500 pt-2">
						Toplam Maliyet: {$totalsStore.grand.toFixed(2)}
					</div>
				</div>
			</div>

			<!-- Right side - Premium and Fee options -->
			<div class="w-32 border-l-2 border-yellow-400 pl-3">
				<!-- Premium Selection -->
				<div class="mb-3">
					<label class="block text-xs font-bold text-yellow-700 mb-2">💰 Vergi:</label>
					<select 
						class="w-full p-1 text-xs border border-yellow-500 rounded bg-white focus:outline-none focus:border-yellow-600"
						value={$optionsStore.premium}
						onchange={updatePremium}
					>
						<option value="">Vergisiz</option>
						<option value="premium">Premium (+%4)</option>
						<option value="non-premium">Premium Değil (+%8)</option>
					</select>
				</div>

				<!-- Fee Selection -->
				<div>
					<label class="block text-xs font-bold text-yellow-700 mb-2">💳 İşlem Ücreti:</label>
					<div class="space-y-1">
						<label class="flex items-center cursor-pointer">
							<input 
								type="radio" 
								name="fee" 
								value="" 
								checked={$optionsStore.fee === ''}
								onchange={updateFee}
								class="mr-2"
							/>
							<span class="text-xs">Ücretsiz</span>
						</label>
						<label class="flex items-center cursor-pointer">
							<input 
								type="radio" 
								name="fee" 
								value="fee" 
								checked={$optionsStore.fee === 'fee'}
								onchange={updateFee}
								class="mr-2"
							/>
							<span class="text-xs">Fee (+%2.5)</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</div> 