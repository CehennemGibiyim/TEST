/**
 * Crafting Module
 */

const Crafting = {
    currentTier: 6,
    currentCategory: 'weapons',

    init() {
        this.setupTabs();
        this.setupTierSelector();
        this.setupQualityCalculator();
        this.loadItems();
    },

    setupTabs() {
        document.querySelectorAll('.craft-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.craft-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.dataset.category;
                this.loadItems();
            });
        });
    },

    setupTierSelector() {
        document.querySelectorAll('.tier-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTier = parseInt(btn.dataset.tier);
                this.loadItems();
            });
        });
    },

    loadItems() {
        const select = document.getElementById('itemSelect');
        if (!select) return;

        const items = this.getItemsByCategory(this.currentCategory, this.currentTier);
        select.innerHTML = '<option value="">Eşya Seç...</option>' +
            items.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

        select.addEventListener('change', (e) => {
            const item = items.find(i => i.id === e.target.value);
            if (item) this.showRecipe(item);
        });
    },

    getItemsByCategory(category, tier) {
        const items = {
            weapons: [
                { id: `T${tier}_MELEE_CLAW`, name: `${tier}.0 Penetrator` },
                { id: `T${tier}_MELEE_DAGGER`, name: `${tier}.0 Dagger` },
                { id: `T${tier}_MELEE_SWORD`, name: `${tier}.0 Broadsword` },
                { id: `T${tier}_MELEE_AXE`, name: `${tier}.0 Greataxe` },
                { id: `T${tier}_MELEE_HAMMER`, name: `${tier}.0 Hammer` },
                { id: `T${tier}_MELEE_SPEAR`, name: `${tier}.0 Spear` }
            ],
            armor: [
                { id: `T${tier}_ARMOR_PLATE_SET1`, name: `${tier}.0 Knight Armor` },
                { id: `T${tier}_ARMOR_LEATHER_SET1`, name: `${tier}.0 Hunter Armor` },
                { id: `T${tier}_ARMOR_CLOTH_SET1`, name: `${tier}.0 Mage Robe` }
            ],
            accessories: [
                { id: `T${tier}_2H_BOW`, name: `${tier}.0 Bow` },
                { id: `T${tier}_2H_CROSSBOW`, name: `${tier}.0 Crossbow` },
                { id: `T${tier}_STAFF_FIRE`, name: `${tier}.0 Fire Staff` },
                { id: `T${tier}_STAFF_FROST`, name: `${tier}.0 Frost Staff` }
            ],
            consumables: [
                { id: `T${tier}_POTION`, name: `${tier}.0 Potion` },
                { id: `T${tier}_FOOD_STEW`, name: `${tier}.0 Stew` }
            ]
        };
        return items[category] || [];
    },

    showRecipe(item) {
        document.getElementById('recipeName').textContent = item.name;
        document.getElementById('recipeImage').src =
            `https://render.albiononline.com/v2/item/${item.id}.png?size=200&quality=90`;

        const materials = this.getMaterials(item.id);
        const materialsList = document.getElementById('materialsList');
        materialsList.innerHTML = materials.map(mat => `
            <div class="material-item">
                <div class="material-icon">
                    <img src="https://render.albiononline.com/v2/item/${mat.id}.png?size=40" alt="${mat.name}">
                </div>
                <div class="material-info">
                    <div class="material-name">${mat.name}</div>
                    <div class="material-qty">x${mat.qty}</div>
                </div>
                <div class="material-price">${this.formatPrice(mat.price)}</div>
            </div>
        `).join('');

        const total = materials.reduce((sum, mat) => sum + (mat.price * mat.qty), 0);
        document.getElementById('totalCost').textContent = this.formatPrice(total);
    },

    getMaterials(itemId) {
        return [
            { id: 'T4_METALBAR', name: 'Steel Bar', qty: 8, price: 1500 },
            { id: 'T4_LEATHER', name: 'Leather', qty: 12, price: 800 },
            { id: 'T4_CLOTH', name: 'Cloth', qty: 6, price: 1200 }
        ];
    },

    setupQualityCalculator() {
        const qualityInput = document.getElementById('qualityScore');
        const focusInput = document.getElementById('focusUsed');

        if (qualityInput && focusInput) {
            const calc = () => {
                const quality = parseInt(qualityInput.value) || 0;
                const focus = parseInt(focusInput.value) || 0;

                const focusBonus = focus * 0.001;
                const normal = Math.max(0, 100 - quality / 100 - focusBonus * 10);
                const good = Math.min(30, quality / 500 + focusBonus * 5);
                const outstanding = Math.min(25, quality / 300);
                const excellent = Math.min(20, quality / 200);
                const legendary = Math.max(0, quality / 100 - 50);

                this.updateQualityBars([
                    Math.max(0, 100 - normal - good - outstanding - excellent - legendary),
                    good, outstanding, excellent, legendary
                ]);
            };

            qualityInput.addEventListener('input', calc);
            focusInput.addEventListener('input', calc);
        }
    },

    updateQualityBars(percentages) {
        const bars = document.querySelectorAll('.bar-fill');
        const percents = document.querySelectorAll('.q-percent');
        const labels = ['normal', 'good', 'outstanding', 'excellent', 'legendary'];

        bars.forEach((bar, i) => {
            bar.style.width = percentages[i] + '%';
        });

        percents.forEach((p, i) => {
            p.textContent = percentages[i].toFixed(1) + '%';
        });
    },

    formatPrice(price) {
        if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
        if (price >= 1000) return (price / 1000).toFixed(1) + 'K';
        return price.toString();
    }
};

document.addEventListener('DOMContentLoaded', () => Crafting.init());
