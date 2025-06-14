<script lang="ts">
	import { tableStore, containersStore, optionsStore } from '$lib/stores';
	import { browser } from '$app/environment';

	let fileInput: HTMLInputElement;

	function exportData() {
		try {
			const exportData = {
				version: "1.0",
				timestamp: new Date().toISOString(),
				data: {} as any
			};

			// Collect data from localStorage
			if (browser) {
				const priceTableData = localStorage.getItem('priceTableData');
				if (priceTableData) {
					exportData.data.priceTableData = JSON.parse(priceTableData);
				}

				const containerData = localStorage.getItem('containerData');
				if (containerData) {
					exportData.data.containerData = JSON.parse(containerData);
				}

				const premiumFeeOptions = localStorage.getItem('premiumFeeOptions');
				if (premiumFeeOptions) {
					exportData.data.premiumFeeOptions = JSON.parse(premiumFeeOptions);
				}

				const tableHeaders = localStorage.getItem('tableHeaders');
				if (tableHeaders) {
					exportData.data.tableHeaders = JSON.parse(tableHeaders);
				}
			}

			// Create and download file
			const jsonString = JSON.stringify(exportData, null, 2);
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			
			const now = new Date();
			const dateStr = now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
			const filename = `urun-fiyat-verileri-${dateStr}.json`;
			
			// Create temporary download link
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			const exportedItems = Object.keys(exportData.data);
			const message = exportedItems.length > 0 
				? `✅ Veriler başarıyla indirildi!\n\nExport edilen veriler:\n• ${exportedItems.join('\n• ')}`
				: '⚠️ Henüz kaydedilmiş veri bulunamadı.\nTabloda değişiklik yaptıktan sonra tekrar deneyin.';
			
			alert(message);

		} catch (error) {
			console.error('Export error:', error);
			alert('❌ Veri indirme sırasında hata oluştu: ' + (error as Error).message);
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
			alert('❌ Lütfen geçerli bir JSON dosyası seçin!');
			return;
		}

		const reader = new FileReader();
		reader.onload = function(e) {
			try {
				const importedData = JSON.parse(e.target?.result as string);
				
				if (!importedData.data) {
					throw new Error('Geçersiz veri formatı!');
				}

				const confirmation = confirm('⚠️ Bu işlem mevcut tüm verileri değiştirecek. Devam etmek istiyor musunuz?');
				if (!confirmation) return;

				// Update localStorage with imported data
				if (browser) {
					const data = importedData.data;
					
					if (data.hasOwnProperty('priceTableData') && Array.isArray(data.priceTableData)) {
						localStorage.setItem('priceTableData', JSON.stringify(data.priceTableData));
					}
					
					if (data.hasOwnProperty('containerData') && typeof data.containerData === 'object') {
						const containerData = {
							count: parseInt(data.containerData.count) || 4,
							values: data.containerData.values || {}
						};
						localStorage.setItem('containerData', JSON.stringify(containerData));
					}
					
					if (data.hasOwnProperty('premiumFeeOptions') && typeof data.premiumFeeOptions === 'object') {
						const premiumFeeOptions = {
							premium: data.premiumFeeOptions.premium || '',
							fee: data.premiumFeeOptions.fee || ''
						};
						localStorage.setItem('premiumFeeOptions', JSON.stringify(premiumFeeOptions));
					}
					
					if (data.hasOwnProperty('tableHeaders') && typeof data.tableHeaders === 'object') {
						const tableHeaders = {
							row1: Array.isArray(data.tableHeaders.row1) ? data.tableHeaders.row1 : [],
							row2: Array.isArray(data.tableHeaders.row2) ? data.tableHeaders.row2 : []
						};
						localStorage.setItem('tableHeaders', JSON.stringify(tableHeaders));
					}
				}

				alert('✅ Veriler başarıyla yüklendi! Sayfa yenileniyor...');
				setTimeout(() => window.location.reload(), 500);

			} catch (error) {
				console.error('Import error:', error);
				alert('❌ Veri yükleme sırasında hata oluştu: ' + (error as Error).message);
			}
		};

		reader.onerror = () => alert('❌ Dosya okuma hatası!');
		reader.readAsText(file);
		
		// Clear input
		target.value = '';
	}

	function triggerFileInput() {
		fileInput.click();
	}
</script>

<div class="flex justify-center items-center gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg shadow-sm">
	<span class="text-sm font-bold text-gray-600">📊 Veri İşlemleri</span>
	
	<button 
		class="px-4 py-2 text-sm font-bold bg-white border-2 border-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 min-w-32 justify-center"
		onclick={exportData}
	>
		📥 Verileri İndir
	</button>
	
	<input 
		bind:this={fileInput}
		type="file" 
		accept=".json" 
		onchange={handleFileSelect}
		class="hidden"
	/>
	
	<button 
		class="px-4 py-2 text-sm font-bold bg-white border-2 border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 min-w-32 justify-center"
		onclick={triggerFileInput}
	>
		📤 Verileri Yükle
	</button>
</div> 