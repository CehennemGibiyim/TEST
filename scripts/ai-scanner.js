/**
 * AI News Scanner for Albion Online Tools
 * Uses Gemini API to analyze game data and generate news
 */

const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATA_FILE = path.join(__dirname, '../src/data/feed.json');

async function fetchGeminiNews(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function loadExistingFeed() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.log('No existing feed found, creating new one');
    }
    return { items: [], lastUpdate: null };
}

async function saveFeed(feed) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(feed, null, 2));
    console.log(`Feed saved with ${feed.items.length} items`);
}

async function main() {
    console.log('Starting AI News Scanner...');

    if (!GEMINI_API_KEY) {
        console.log('GEMINI_API_KEY not set, using mock data');
        const feed = {
            items: [
                {
                    id: Date.now().toString(),
                    title: 'Yeni Sezon: Radiant Wilds Güncellemesi',
                    content: 'Albion Online yeni sezonu ile birlikte yeni haritalar, ekipmanlar ve oyun mekanikleri ekledi. Oyuncular artık yeni Radiant Wilds bölgesinde maceralarına devam edebilir.',
                    date: new Date().toISOString(),
                    category: 'update',
                    image: 'https://albiononline.com/assets/news/RadiantWilds.jpg'
                },
                {
                    id: (Date.now() - 1000).toString(),
                    title: 'Dragon Güncellemesi Geliyor',
                    content: 'Yeni dragon bossları ve dragon themed ekipmanlar yakında oyuna ekleniyor. Guildlerinizle birlikte bu zorlu düşmanlara karşı savaşa hazır olun!',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    category: 'update',
                    image: null
                },
                {
                    id: (Date.now() - 2000).toString(),
                    title: 'Crafting Değişiklikleri',
                    content: 'Yeni crafting sistemi ile birlikte bazı tarifler güncellendi. Artık focus kullanımı daha verimli hale getirildi.',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    category: 'guide',
                    image: null
                }
            ],
            lastUpdate: new Date().toISOString()
        };
        await saveFeed(feed);
        return;
    }

    try {
        const feed = await loadExistingFeed();

        const prompt = `Sen Albion Online hakkında güncel haberler ve ipuçları üreten bir yapay zeka asistsin. Türk oyuncular için kısa ve bilgilendirici haberler yaz.

Son güncellemeler hakkında kısa bir haber yaz. Türkçe olarak yanıt ver.
Yanıtını şu JSON formatında ver (sadece JSON, açıklama yok):
{
    "title": "Haber başlığı",
    "content": "Haber içeriği (2-3 cümle)",
    "category": "update veya guide veya tip"
}`;

        const news = await fetchGeminiNews(prompt);

        try {
            const newsData = JSON.parse(news);
            feed.items.unshift({
                id: Date.now().toString(),
                ...newsData,
                date: new Date().toISOString()
            });
            feed.items = feed.items.slice(0, 50);
        } catch (parseError) {
            console.log('Could not parse AI response, using fallback');
        }

        feed.lastUpdate = new Date().toISOString();
        await saveFeed(feed);

    } catch (error) {
        console.error('Error:', error.message);
        const feed = await loadExistingFeed();
        feed.lastUpdate = new Date().toISOString();
        await saveFeed(feed);
    }
}

main();
