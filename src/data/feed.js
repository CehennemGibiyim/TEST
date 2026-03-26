/**
 * Feed Data Loader
 * Loads news feed from JSON
 */

const FeedData = {
    async load() {
        try {
            const response = await fetch('data/feed.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log('Feed load error:', e);
        }
        return { items: [], lastUpdate: null };
    },

    async getLatest(count = 10) {
        const data = await this.load();
        return data.items.slice(0, count);
    },

    async getByCategory(category) {
        const data = await this.load();
        return data.items.filter(item => item.category === category);
    }
};
