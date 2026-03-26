/**
 * PvP Module - Kill Feed & Player Stats
 */

const PvP = {
    currentServer: 'europe',
    kills: [],

    init() {
        this.setupFilters();
        this.loadFeed();
    },

    setupFilters() {
        const serverSelect = document.getElementById('pvpServer');
        const playerSearch = document.getElementById('playerSearch');

        if (serverSelect) {
            serverSelect.addEventListener('change', (e) => {
                this.currentServer = e.target.value;
                this.loadFeed();
            });
        }

        if (playerSearch) {
            playerSearch.addEventListener('input', (e) => {
                this.filterKills(e.target.value);
            });
        }
    },

    async loadFeed() {
        const container = document.getElementById('killsList');
        if (!container) return;

        container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><span>Yükleniyor...</span></div>';

        try {
            const response = await fetch('../data/pvp-feed.json');
            if (response.ok) {
                const data = await response.json();
                this.kills = data.kills || [];
            } else {
                throw new Error('API error');
            }
        } catch (error) {
            console.log('Using mock data');
            this.kills = this.getMockKills();
        }

        this.renderKills();
    },

    getMockKills() {
        return [
            {
                id: '1',
                killer: { name: 'ShadowBlade', guild: 'DarkOrder', avatar: '', fame: 12500 },
                victim: { name: 'NoobMaster', guild: 'NewbieSquad', avatar: '', fame: 3500 },
                date: new Date().toISOString(),
                location: { zone: 'Thetford', region: 'Royal Continent' },
                totalFame: 16000
            },
            {
                id: '2',
                killer: { name: 'BloodMoon', guild: 'Warriors', avatar: '', fame: 8900 },
                victim: { name: 'CasualPlayer', guild: null, avatar: '', fame: 2100 },
                date: new Date(Date.now() - 300000).toISOString(),
                location: { zone: 'Bridgewatch', region: 'Steppe' },
                totalFame: 11000
            },
            {
                id: '3',
                killer: { name: 'DragonSlayer', guild: 'Legendary', avatar: '', fame: 45000 },
                victim: { name: 'PvpNewbie', guild: 'TestGuild', avatar: '', fame: 890 },
                date: new Date(Date.now() - 600000).toISOString(),
                location: { zone: 'Caerleon', region: 'Royalmarch' },
                totalFame: 45890
            }
        ];
    },

    renderKills() {
        const container = document.getElementById('killsList');
        const countEl = document.getElementById('feedCount');

        if (!container) return;

        if (this.kills.length === 0) {
            container.innerHTML = '<p class="no-data">Ölüm bulunamadı</p>';
            return;
        }

        if (countEl) countEl.textContent = `${this.kills.length} ölüm`;

        container.innerHTML = this.kills.map(kill => `
            <div class="kill-card">
                <div class="kill-avatar">
                    <img src="${kill.killer.avatar || 'https://via.placeholder.com/60'}" alt="${kill.killer.name}">
                </div>
                <div class="kill-info">
                    <div class="kill-player">
                        <span class="kill-name">${kill.killer.name}</span>
                        ${kill.killer.guild ? `<span class="kill-guild">[${kill.killer.guild}]</span>` : ''}
                    </div>
                    <div class="kill-details">
                        <span><i class="fas fa-skull"></i> ${kill.victim.name}</span>
                        ${kill.victim.guild ? `<span>[${kill.victim.guild}]</span>` : ''}
                    </div>
                    <div class="kill-location">
                        <i class="fas fa-map-marker-alt"></i> ${kill.location.zone} - ${kill.location.region}
                    </div>
                </div>
                <div class="kill-vs">
                    <div class="vs-icon">VS</div>
                    <span class="vs-time">${this.formatTime(kill.date)}</span>
                </div>
                <div class="kill-fame">
                    <div class="fame-value">${this.formatFame(kill.totalFame)}</div>
                    <div class="fame-label">Fame</div>
                </div>
            </div>
        `).join('');
    },

    filterKills(query) {
        if (!query) {
            this.renderKills();
            return;
        }

        const filtered = this.kills.filter(kill =>
            kill.killer.name.toLowerCase().includes(query.toLowerCase()) ||
            kill.victim.name.toLowerCase().includes(query.toLowerCase()) ||
            kill.killer.guild?.toLowerCase().includes(query.toLowerCase()) ||
            kill.victim.guild?.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('killsList');
        if (container) {
            container.innerHTML = filtered.length > 0
                ? filtered.map(kill => `<!-- kill card -->${kill.killer.name} vs ${kill.victim.name}</div>`).join('')
                : '<p class="no-data">Sonuç bulunamadı</p>';
        }
    },

    formatTime(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Az önce';
        if (diff < 3600) return Math.floor(diff / 60) + ' dk önce';
        if (diff < 86400) return Math.floor(diff / 3600) + ' saat önce';
        return Math.floor(diff / 86400) + ' gün önce';
    },

    formatFame(fame) {
        if (fame >= 1000) return (fame / 1000).toFixed(1) + 'K';
        return fame.toString();
    }
};

document.addEventListener('DOMContentLoaded', () => PvP.init());
