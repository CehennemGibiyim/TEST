/**
 * Market Module - Price Tracking & Analysis
 */

const Market = {
    API_BASE: 'https://europe.albion-online-data.com/api/v2/stats',
    currentServer: 'europe',
    currentCity: 'Thetford',
    priceChart: null,

    init() {
        this.setupControls();
        this.loadPopularItems();
        this.initChart();
        this.setupCalculator();
    },

    setupControls() {
        const serverSelect = document.getElementById('serverSelect');
        const locationSelect = document.getElementById('locationSelect');
        const searchInput = document.getElementById('itemSearch');
        const searchBtn = document.getElementById('searchBtn');

        if (serverSelect) {
            serverSelect.addEventListener('change', (e) => {
                this.currentServer = e.target.value;
                this.loadPopularItems();
            });
        }

        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                this.loadPopularItems();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchItem();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchItem());
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterItems(btn.dataset.tier);
            });
        });

        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChart(parseInt(btn.dataset.time));
            });
        });
    },

    async loadPopularItems() {
        const grid = document.getElementById('itemsGrid');
        if (!grid) return;

        grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><span>Yükleniyor...</span></div>';

        const popularItems = [
            'T4_MELEE_ALLTHICYNSWORD', 'T4_ARMOR_PLATE_SET1', 'T4_CAPE',
            'T5_MELEE_CLAW', 'T5_ARMOR_PLATE_SET2', 'T5_OFFHAND_SHIELD'
        ];

        try {
            const promises = popularItems.map(item => this.fetchItemPrice(item));
            const results = await Promise.allSettled(promises);

            let html = '';
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    const data = result.value;
                    const price = this.formatPrice(data.price);
                    const change = data.price_change_ratio > 0 ? 'up' : 'down';
                    const changeText = (data.price_change_ratio * 100).toFixed(1) + '%';

                    html += `
                        <div class="item-card" data-tier="${popularItems[index].split('_')[0]}">
                            <div class="item-image">
                                <img src="https://render.albiononline.com/v2/item/${popularItems[index]}.png?size=80&quality=80"
                                     alt="${data.name}" onerror="this.src='https://via.placeholder.com/80?text=?'">
                            </div>
                            <div class="item-name">${data.name || popularItems[index]}</div>
                            <div class="item-price">
                                <span class="current">${price}</span>
                                <span class="change ${change}">
                                    <i class="fas fa-arrow-${change === 'up' ? 'up' : 'down'}"></i>
                                    ${changeText}
                                </span>
                            </div>
                        </div>
                    `;
                }
            });

            grid.innerHTML = html || '<p class="no-data">Eşya bulunamadı</p>';
        } catch (error) {
            console.error('Market error:', error);
            grid.innerHTML = '<p class="no-data">Veriler yüklenemedi</p>';
        }
    },

    async fetchItemPrice(itemId) {
        const url = `${this.API_BASE}/prices/${itemId}.json?locations=${this.currentCity}&qualities=1`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        return data[0];
    },

    async searchItem() {
        const searchInput = document.getElementById('itemSearch');
        const query = searchInput.value.trim();
        if (!query) return;

        const grid = document.getElementById('itemsGrid');
        grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><span>Aranıyor...</span></div>';

        try {
            const data = await this.fetchItemPrice(query.toUpperCase());
            if (data) {
                grid.innerHTML = `
                    <div class="item-card">
                        <div class="item-image">
                            <img src="https://render.albiononline.com/v2/item/${query}.png?size=120&quality=90">
                        </div>
                        <div class="item-name">${data.name || query}</div>
                        <div class="item-price">
                            <span class="current">${this.formatPrice(data.price)}</span>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            grid.innerHTML = '<p class="no-data">Eşya bulunamadı</p>';
        }
    },

    filterItems(tier) {
        const cards = document.querySelectorAll('.item-card');
        cards.forEach(card => {
            if (tier === 'all' || card.dataset.tier?.toLowerCase() === tier) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    },

    initChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;

        this.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                datasets: [{
                    label: 'Fiyat',
                    data: [12500, 13200, 12800, 14500, 15200, 14800, 15500],
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#8b949e' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8b949e' }
                    }
                }
            }
        });
    },

    updateChart(days) {
        const labels = [];
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            labels.push(`Gün ${days - i}`);
            data.push(Math.floor(Math.random() * 5000) + 12000);
        }
        this.priceChart.data.labels = labels;
        this.priceChart.data.datasets[0].data = data;
        this.priceChart.update();
    },

    setupCalculator() {
        const buyInput = document.getElementById('buyPrice');
        const sellInput = document.getElementById('sellPrice');

        if (buyInput && sellInput) {
            const calc = () => {
                const buy = parseInt(buyInput.value) || 0;
                const sell = parseInt(sellInput.value) || 0;
                const profit = sell - buy;
                const percent = buy > 0 ? ((profit / buy) * 100).toFixed(1) : 0;

                document.getElementById('profitValue').textContent = this.formatPrice(profit);
                document.getElementById('profitPercent').textContent = percent + '%';
            };

            buyInput.addEventListener('input', calc);
            sellInput.addEventListener('input', calc);
        }
    },

    formatPrice(price) {
        if (price >= 1000000000) return (price / 1000000000).toFixed(1) + 'G';
        if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
        if (price >= 1000) return (price / 1000).toFixed(1) + 'K';
        return price.toString();
    }
};

document.addEventListener('DOMContentLoaded', () => Market.init());
