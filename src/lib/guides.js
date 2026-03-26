/**
 * Guides Module - Build Guides & AI Assistant
 */

const Guides = {
    GEMINI_API_KEY: 'AIzaSyDbtMelUpkggeB5wMa0gIkd8r2c94EPV-4',
    builds: [],

    init() {
        this.setupFilters();
        this.setupAI();
        this.loadBuilds();
    },

    setupFilters() {
        document.querySelectorAll('.guide-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.guide-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterBuilds(btn.dataset.weapon);
            });
        });
    },

    setupAI() {
        const askBtn = document.getElementById('askAI');
        const sendBtn = document.getElementById('sendQuestion');
        const input = document.getElementById('aiQuestion');

        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.askQuestion(input.value));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.askQuestion(input.value);
            });
        }
    },

    async askQuestion(question) {
        if (!question.trim()) return;

        const chatBox = document.getElementById('aiChatBox');
        if (!chatBox) return;

        chatBox.innerHTML += `
            <div class="user-message">
                <div class="message-content">${question}</div>
            </div>
        `;

        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'ai-message';
        loadingMsg.innerHTML = '<i class="fas fa-robot"></i><p>Düşünüyor...</p>';
        chatBox.appendChild(loadingMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Sen Albion Online hakkında uzman bir oyun asistanısın. Türkçe yanıt ver.\n\nSoru: ${question}`
                            }]
                        }]
                    })
                }
            );

            const data = await response.json();
            const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Üzgünüm, şu anda cevap veremiyorum.';

            loadingMsg.innerHTML = `<i class="fas fa-robot"></i><p>${answer}</p>`;

        } catch (error) {
            console.error('AI Error:', error);
            loadingMsg.innerHTML = `<i class="fas fa-robot"></i><p>Bağlantı hatası. Lütfen tekrar deneyin.</p>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    },

    loadBuilds() {
        this.builds = this.getDefaultBuilds();
        this.renderBuilds(this.builds);
    },

    getDefaultBuilds() {
        return [
            {
                id: 1,
                title: 'Greatsword Tank',
                weapon: 'sword',
                category: 'pvp',
                desc: 'Yüksek survivability ve orta hasar. Grup savaşları için ideal.',
                ip: 1200,
                tier: 6,
                difficulty: 'Orta',
                image: 'https://via.placeholder.com/400x200?text=Greatsword+Tank'
            },
            {
                id: 2,
                title: 'Frost Staff Burst',
                weapon: 'staff',
                category: 'pvp',
                desc: 'Yüksek burst hasar. Squishy hedefler için mükemmel.',
                ip: 1150,
                tier: 6,
                difficulty: 'Zor',
                image: 'https://via.placeholder.com/400x200?text=Frost+Burst'
            },
            {
                id: 3,
                title: 'Bow Support',
                weapon: 'bow',
                category: 'pve',
                desc: 'Uzaktan hasar ve CC. Solo PvE için etkili.',
                ip: 1100,
                tier: 5,
                difficulty: 'Kolay',
                image: 'https://via.placeholder.com/400x200?text=Bow+Support'
            },
            {
                id: 4,
                title: 'Dagger Burst',
                weapon: 'dagger',
                category: 'pvp',
                desc: 'Hızlı ve ölümcül. Tecrübeli oyuncular için.',
                ip: 1180,
                tier: 7,
                difficulty: 'Çok Zor',
                image: 'https://via.placeholder.com/400x200?text=Dagger+Burst'
            }
        ];
    },

    renderBuilds(builds) {
        const grid = document.getElementById('guidesGrid');
        if (!grid) return;

        grid.innerHTML = builds.map(build => `
            <div class="guide-card" data-weapon="${build.weapon}">
                <div class="guide-image" style="background-image: url('${build.image}')">
                    <span class="guide-badge ${build.category}">${this.getCategoryLabel(build.category)}</span>
                </div>
                <div class="guide-content">
                    <div class="guide-weapon">
                        <i class="fas fa-${this.getWeaponIcon(build.weapon)}"></i>
                        <span>${this.getWeaponName(build.weapon)}</span>
                    </div>
                    <h3 class="guide-title">${build.title}</h3>
                    <p class="guide-desc">${build.desc}</p>
                    <div class="guide-meta">
                        <span><i class="fas fa-crown"></i> T${build.tier}</span>
                        <span><i class="fas fa-tachometer-alt"></i> ${build.difficulty}</span>
                    </div>
                    <div class="guide-stats">
                        <div class="stat-item">
                            <div class="value">${build.ip}</div>
                            <div class="label">IP</div>
                        </div>
                        <div class="stat-item">
                            <div class="value">${build.tier}.0</div>
                            <div class="label">Tier</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    filterBuilds(weapon) {
        const cards = document.querySelectorAll('.guide-card');
        cards.forEach(card => {
            if (weapon === 'all' || card.dataset.weapon === weapon) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    },

    getCategoryLabel(cat) {
        const labels = { pvp: 'PvP', pve: 'PvE', meta: 'Meta', gathering: 'Gathering' };
        return labels[cat] || cat;
    },

    getWeaponIcon(weapon) {
        const icons = {
            sword: 'sword', spear: 'bullseye', bow: 'bullseye', staff: 'magic',
            dagger: 'cut', axe: 'axe', hammer: 'gavel', crossbow: 'crosshairs'
        };
        return icons[weapon] || 'sword';
    },

    getWeaponName(weapon) {
        const names = {
            sword: 'Kılıç', spear: 'Mızrak', bow: 'Yay', staff: 'Asa',
            dagger: 'Hançer', axe: 'Balta', hammer: 'Çekiç', crossbow: 'Tüfek'
        };
        return names[weapon] || weapon;
    }
};

document.addEventListener('DOMContentLoaded', () => Guides.init());
