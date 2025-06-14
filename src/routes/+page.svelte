<script lang="ts">
	import { onMount } from 'svelte';
	import DataControls from '$lib/components/DataControls.svelte';
	import PriceTable from '$lib/components/PriceTable.svelte';
	import CalculationContainers from '$lib/components/CalculationContainers.svelte';
	import TotalBoxes from '$lib/components/TotalBoxes.svelte';
	import { tableStore, containersStore, optionsStore } from '$lib/stores';

	onMount(() => {
		// Load data from localStorage on mount
		tableStore.loadFromStorage();
		containersStore.loadFromStorage();
		optionsStore.loadFromStorage();
	});
</script>

<svelte:head>
	<title>Ürün Fiyat Tablosu</title>
	<meta name="description" content="Dinamik ürün fiyat tablosu ve maliyet hesaplama uygulaması" />
</svelte:head>

<main class="min-h-screen bg-gray-50 p-1">
	<!-- Data Controls -->
	<DataControls />
	
	<div class="flex flex-wrap gap-2 mt-2">
		<!-- Left side - Price Table (full width on mobile, flexible on desktop) -->
		<div class="flex-1 min-w-0">
			<PriceTable />
		</div>
		
		<!-- Right side - Calculation Containers -->
		<div class="w-full lg:w-auto lg:flex-shrink-0">
			<CalculationContainers />
		</div>
	</div>
	
	<!-- Total Boxes -->
	<div class="mt-4">
		<TotalBoxes />
	</div>
</main>
