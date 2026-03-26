/**
 * PvP Feed Fetcher for Albion Online Tools
 * Fetches latest kill data from Albion Online Data Project API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(__dirname, '../src/data/pvp-feed.json');
const KILLBOARD_API = 'https://europe.albion-online-data.com/api/v2/stats/kills';

async function fetchKillboard(page = 0, limit = 20) {
    return new Promise((resolve, reject) => {
        const url = `${KILLBOARD_API}?page=${page}&limit=${limit}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function loadExistingFeed() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.log('No existing feed found');
    }
    return { kills: [], lastUpdate: null };
}

function saveFeed(feed) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(feed, null, 2));
    console.log(`PvP Feed saved with ${feed.kills.length} kills`);
}

async function main() {
    console.log('Starting PvP Feed Fetcher...');

    const feed = loadExistingFeed();

    try {
        const kills = await fetchKillboard(0, 30);

        const formattedKills = kills.map(kill => ({
            id: kill.EventId || kill.KillId,
            killer: {
                name: kill.Killer?.Name || 'Unknown',
                guild: kill.Killer?.GuildName || null,
                alliance: kill.Killer?.AllianceName || null,
                avatar: kill.Killer?.Avatar?.toLowerCase() === '00000000-0000-0000-0000-000000000000'
                    ? 'https://render.albiononline.com/v2/item/T4_MELEE@4.png?count=1'
                    : `https://render.albiononline.com/v2/avatar/${kill.Killer?.Avatar}.png?size=85&quality=90`,
                equipment: kill.Killer?.Equipment || {},
                fame: kill.Killer?.Fame || 0
            },
            victim: {
                name: kill.Victim?.Name || 'Unknown',
                guild: kill.Victim?.GuildName || null,
                alliance: kill.Victim?.AllianceName || null,
                avatar: kill.Victim?.Avatar?.toLowerCase() === '00000000-0000-0000-0000-000000000000'
                    ? 'https://render.albiononline.com/v2/item/T4_MELEE@4.png?count=1'
                    : `https://render.albiononline.com/v2/avatar/${kill.Victim?.Avatar}.png?size=85&quality=90`,
                equipment: kill.Victim?.Equipment || {},
                fame: kill.Victim?.Fame || 0
            },
            date: kill.TimeStamp || kill.Timestamp || new Date().toISOString(),
            location: {
                zone: kill.Location?.Zone || 'Unknown',
                region: kill.Location?.Region || 'Unknown'
            },
            totalFame: kill.TotalFame || 0,
            groupSize: kill.GroupMemberCount || 1,
           击杀类型: kill.AuctionDataType || 'Regular'
        }));

        feed.kills = formattedKills;
        feed.lastUpdate = new Date().toISOString();

    } catch (error) {
        console.error('API Error:', error.message);

        if (feed.kills.length === 0) {
            feed.kills = [
                {
                    id: '1',
                    killer: { name: 'TestKiller', guild: 'TestGuild', alliance: null, avatar: '', equipment: {}, fame: 5000 },
                    victim: { name: 'TestVictim', guild: null, alliance: null, avatar: '', equipment: {}, fame: 3000 },
                    date: new Date().toISOString(),
                    location: { zone: 'Martlock', region: 'Hybrasyl' },
                    totalFame: 8000,
                    groupSize: 1
                }
            ];
        }
    }

    saveFeed(feed);
}

main();
