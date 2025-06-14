# Svelte Study 1 - Basit Store ve Arayüz Örneği

Bu proje Svelte öğrenmek için basit bir başlangıç çalışmasıdır. Ana projemizdeki fiyat tablosu uygulamasından ilham alınarak basit bir ürün listesi ve hesaplama örneği yapılmıştır.

## 🎯 Öğrenilecek Konular

- Svelte Store kullanımı
- Reactive statements ($:)
- Event handling
- Component yapısı
- Basit styling

## 📝 Uygulama Örneği

### 1. Store Oluşturma (`src/lib/stores.js`)

```javascript
import { writable, derived } from 'svelte/store';

// Ürün listesi store'u
export const products = writable([
  { id: 1, name: 'Elma', price: 5 },
  { id: 2, name: 'Armut', price: 8 },
  { id: 3, name: 'Muz', price: 12 }
]);

// Seçilen ürün store'u
export const selectedProduct = writable(null);

// Miktar store'u
export const quantity = writable(1);

// Toplam fiyat (derived store - otomatik hesaplanan)
export const totalPrice = derived(
  [selectedProduct, quantity],
  ([$selectedProduct, $quantity]) => {
    if (!$selectedProduct) return 0;
    return $selectedProduct.price * $quantity;
  }
);
```

### 2. Ana Component (`src/routes/+page.svelte`)

```svelte
<script>
  import { products, selectedProduct, quantity, totalPrice } from '$lib/stores.js';
  
  function selectProduct(product) {
    selectedProduct.set(product);
  }
  
  function updateQuantity(event) {
    quantity.set(parseInt(event.target.value) || 1);
  }
</script>

<div class="container">
  <h1>🛒 Basit Ürün Hesaplayıcı</h1>
  
  <!-- Ürün Listesi -->
  <div class="product-list">
    <h2>Ürünler:</h2>
    {#each $products as product}
      <button 
        class="product-btn {$selectedProduct?.id === product.id ? 'selected' : ''}"
        on:click={() => selectProduct(product)}
      >
        {product.name} - {product.price}₺
      </button>
    {/each}
  </div>
  
  <!-- Miktar Seçimi -->
  {#if $selectedProduct}
    <div class="quantity-section">
      <h3>Seçilen: {$selectedProduct.name}</h3>
      <label>
        Miktar:
        <input 
          type="number" 
          min="1" 
          value={$quantity}
          on:input={updateQuantity}
        />
      </label>
    </div>
  {/if}
  
  <!-- Toplam -->
  <div class="total-section">
    <h2>Toplam: {$totalPrice}₺</h2>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    color: #2563eb;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .product-list {
    margin-bottom: 20px;
  }
  
  .product-btn {
    display: block;
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .product-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .product-btn.selected {
    border-color: #2563eb;
    background: #dbeafe;
    font-weight: bold;
  }
  
  .quantity-section {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  .quantity-section h3 {
    color: #1e40af;
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    margin-left: 10px;
    width: 80px;
  }
  
  .total-section {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border: 2px solid #10b981;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin-top: 20px;
  }
  
  .total-section h2 {
    color: #047857;
    margin: 0;
    font-size: 24px;
  }
</style>

## 🚀 Çalıştırma

```bash
npm install
npm run dev
```

## 📚 Svelte Kavramları Bu Örnekte

1. **Store**: `writable()` ve `derived()` store'lar
2. **Reactivity**: `$store` syntax ile reactive değerler
3. **Event Handling**: `on:click`, `on:input`
4. **Conditional Rendering**: `{#if}` blokları
5. **Loops**: `{#each}` ile liste render etme
6. **Component Styling**: Scoped CSS styles

## 🎯 Sonraki Adımlar

- Yeni ürün ekleme özelliği
- LocalStorage ile veri saklama
- Component'leri ayırma
- Tailwind CSS ekleme

Bu basit örnek, ana projemizdeki karmaşık store yapısının temellerini göstermektedir!
