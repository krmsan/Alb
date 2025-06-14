import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Types
export interface TableData {
	headers: {
		row1: Array<{ text: string; colSpan: number; className: string }>;
		row2: Array<{ text: string; className: string }>;
	};
	rows: string[][];
}

export interface ContainerData {
	id: number;
	product: string;
	level: number;
	subLevel: number;
	quantity: number;
}

export interface PremiumFeeOptions {
	premium: '' | 'premium' | 'non-premium';
	fee: '' | 'fee';
}

// Store for table data
function createTableStore() {
	const initialHeaders = {
		row1: [
			{ text: 'Ürün Adı', colSpan: 1, className: '' },
			{ text: 'T1', colSpan: 1, className: 't-header' },
			{ text: 'T2', colSpan: 1, className: 't-header' },
			{ text: 'T3', colSpan: 1, className: 't-header' },
			{ text: 'T4', colSpan: 5, className: 't-header' },
			{ text: 'T5', colSpan: 5, className: 't-header' },
			{ text: 'T6', colSpan: 5, className: 't-header' },
			{ text: 'T7', colSpan: 5, className: 't-header' },
			{ text: 'T8', colSpan: 5, className: 't-header' }
		],
		row2: [
			{ text: 'Ürün Adı', className: '' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En1', className: 'en-header' },
			{ text: 'En2', className: 'en-header' },
			{ text: 'En3', className: 'en-header' },
			{ text: 'En4', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En1', className: 'en-header' },
			{ text: 'En2', className: 'en-header' },
			{ text: 'En3', className: 'en-header' },
			{ text: 'En4', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En1', className: 'en-header' },
			{ text: 'En2', className: 'en-header' },
			{ text: 'En3', className: 'en-header' },
			{ text: 'En4', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En1', className: 'en-header' },
			{ text: 'En2', className: 'en-header' },
			{ text: 'En3', className: 'en-header' },
			{ text: 'En4', className: 'en-header' },
			{ text: 'En0', className: 'en-header' },
			{ text: 'En1', className: 'en-header' },
			{ text: 'En2', className: 'en-header' },
			{ text: 'En3', className: 'en-header' },
			{ text: 'En4', className: 'en-header' }
		]
	};

	// Total columns: 1 + 1 + 1 + 1 + 5 + 5 + 5 + 5 + 5 = 29
	const initialRows = [
		['Seciniz', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
		['Plank', '0', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		['Cloth', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		['Leather', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		['Metal Bar', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		...Array(6).fill(null).map(() => Array(29).fill(''))
	];

	const { subscribe, set, update } = writable<TableData>({
		headers: initialHeaders,
		rows: initialRows
	});

	return {
		subscribe,
		set,
		update,
		updateCell: (rowIndex: number, colIndex: number, value: string) => {
			update(data => {
				data.rows[rowIndex][colIndex] = value;
				return data;
			});
		},
		addRow: () => {
			update(data => {
				data.rows.push(Array(29).fill(''));
				return data;
			});
		},
		removeRow: () => {
			update(data => {
				if (data.rows.length > 1) {
					data.rows.pop();
				}
				return data;
			});
		},
		addColumn: (name: string) => {
			update(data => {
				// Add new T-header
				data.headers.row1.push({ text: name, colSpan: 5, className: 't-header' });
				// Add 5 En-headers
				for (let i = 0; i < 5; i++) {
					data.headers.row2.push({ text: `En${i}`, className: 'en-header' });
				}
				// Add cells to all rows
				data.rows.forEach(row => {
					for (let i = 0; i < 5; i++) {
						row.push('');
					}
				});
				return data;
			});
		},
		removeColumn: () => {
			update(data => {
				if (data.headers.row1.length > 4) { // Keep at least T1, T2, T3
					// Remove last T-header
					const lastHeader = data.headers.row1.pop();
					const colSpan = lastHeader?.colSpan || 1;
					
					// Remove corresponding En-headers
					for (let i = 0; i < colSpan; i++) {
						data.headers.row2.pop();
					}
					
					// Remove cells from all rows
					data.rows.forEach(row => {
						for (let i = 0; i < colSpan; i++) {
							row.pop();
						}
					});
				}
				return data;
			});
		},
		updateHeader: (row: number, index: number, text: string) => {
			update(data => {
				if (row === 1) {
					data.headers.row1[index].text = text;
				} else {
					data.headers.row2[index].text = text;
				}
				return data;
			});
		},
		saveToStorage: () => {
			if (browser) {
				update(data => {
					localStorage.setItem('priceTableData', JSON.stringify(data.rows));
					localStorage.setItem('tableHeaders', JSON.stringify(data.headers));
					return data;
				});
			}
		},
		loadFromStorage: () => {
			if (browser) {
				const savedRows = localStorage.getItem('priceTableData');
				const savedHeaders = localStorage.getItem('tableHeaders');
				
				if (savedRows || savedHeaders) {
					try {
						const rows = savedRows ? JSON.parse(savedRows) : initialRows;
						const headers = savedHeaders ? JSON.parse(savedHeaders) : initialHeaders;
						set({ headers, rows });
					} catch (e) {
						console.error('Error loading table data:', e);
					}
				}
			}
		}
	};
}

// Store for calculation containers
function createContainersStore() {
	const { subscribe, set, update } = writable<ContainerData[]>([
		{ id: 1, product: '', level: 1, subLevel: 0, quantity: 1 },
		{ id: 2, product: '', level: 1, subLevel: 0, quantity: 1 },
		{ id: 3, product: '', level: 1, subLevel: 0, quantity: 1 },
		{ id: 4, product: '', level: 1, subLevel: 0, quantity: 1 }
	]);

	return {
		subscribe,
		set,
		update,
		addContainer: () => {
			update(containers => {
				if (containers.length < 8) {
					const newId = Math.max(...containers.map(c => c.id)) + 1;
					containers.push({ 
						id: newId, 
						product: '', 
						level: 1, 
						subLevel: 0, 
						quantity: 1 
					});
				}
				return containers;
			});
		},
		removeContainer: (id: number) => {
			update(containers => containers.filter(c => c.id !== id));
		},
		updateContainer: (id: number, updates: Partial<ContainerData>) => {
			update(containers => {
				const index = containers.findIndex(c => c.id === id);
				if (index !== -1) {
					containers[index] = { ...containers[index], ...updates };
				}
				return containers;
			});
		},
		saveToStorage: () => {
			if (browser) {
				update(containers => {
					const containerData = {
						count: containers.length,
						values: containers.reduce((acc, container, index) => {
							acc[container.id] = {
								product: container.product,
								level: container.level.toString(),
								subLevel: container.subLevel.toString(),
								quantity: container.quantity.toString()
							};
							return acc;
						}, {} as any)
					};
					localStorage.setItem('containerData', JSON.stringify(containerData));
					return containers;
				});
			}
		},
		loadFromStorage: () => {
			if (browser) {
				const saved = localStorage.getItem('containerData');
				if (saved) {
					try {
						const data = JSON.parse(saved);
						if (data.values) {
							const containers = Object.entries(data.values).map(([id, values]: [string, any]) => ({
								id: parseInt(id),
								product: values.product || '',
								level: parseInt(values.level) || 1,
								subLevel: parseInt(values.subLevel) || 0,
								quantity: parseFloat(values.quantity) || 1
							}));
							set(containers);
						}
					} catch (e) {
						console.error('Error loading container data:', e);
					}
				}
			}
		}
	};
}

// Store for premium/fee options
function createOptionsStore() {
	const { subscribe, set, update } = writable<PremiumFeeOptions>({
		premium: '',
		fee: ''
	});

	return {
		subscribe,
		set,
		update,
		updatePremium: (value: PremiumFeeOptions['premium']) => {
			update(options => ({ ...options, premium: value }));
		},
		updateFee: (value: PremiumFeeOptions['fee']) => {
			update(options => ({ ...options, fee: value }));
		},
		saveToStorage: () => {
			if (browser) {
				update(options => {
					localStorage.setItem('premiumFeeOptions', JSON.stringify(options));
					return options;
				});
			}
		},
		loadFromStorage: () => {
			if (browser) {
				const saved = localStorage.getItem('premiumFeeOptions');
				if (saved) {
					try {
						const data = JSON.parse(saved);
						set(data);
					} catch (e) {
						console.error('Error loading options data:', e);
					}
				}
			}
		}
	};
}

// Create stores
export const tableStore = createTableStore();
export const containersStore = createContainersStore();
export const optionsStore = createOptionsStore();

// Derived store for totals calculation
export const totalsStore = derived(
	[tableStore, containersStore, optionsStore],
	([$table, $containers, $options]) => {
		let resourcesTotal = 0;
		let grandTotal = 0;

		$containers.forEach((container, index) => {
			if (!container.product) return;

			// Find product row
			const productRow = $table.rows.find(row => row[0] === container.product);
			if (!productRow) return;

			// Calculate column index
			let columnIndex = 0;
			if (container.level <= 3) {
				columnIndex = container.level;
			} else {
				columnIndex = 3 + (container.level - 4) * 5 + (container.subLevel + 1);
			}

			const price = parseFloat(productRow[columnIndex] || '0');
			const total = price * container.quantity;

			// First 2 containers go to resources total
			if (index < 2) {
				resourcesTotal += total;
			}
			grandTotal += total;
		});

		// Apply premium and fee
		let finalTotal = grandTotal;
		if ($options.premium === 'premium') {
			finalTotal *= 1.04;
		} else if ($options.premium === 'non-premium') {
			finalTotal *= 1.08;
		}

		if ($options.fee === 'fee') {
			finalTotal *= 1.025;
		}

		return {
			resources: resourcesTotal,
			grand: finalTotal,
			containerTotals: $containers.map((container, index) => {
				if (!container.product) return 0;
				const productRow = $table.rows.find(row => row[0] === container.product);
				if (!productRow) return 0;
				
				let columnIndex = 0;
				if (container.level <= 3) {
					columnIndex = container.level;
				} else {
					columnIndex = 3 + (container.level - 4) * 5 + (container.subLevel + 1);
				}
				
				const price = parseFloat(productRow[columnIndex] || '0');
				return price * container.quantity;
			})
		};
	}
); 