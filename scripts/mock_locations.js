import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function mockLocations() {
    try {
        const adminLat = 27.6687;
        const adminLng = 84.4264;

        console.log('Fetching users...');
        const { data: profiles } = await supabase.from('user_profiles').select('id, role').in('role', ['SALES', 'DELIVERY']);
        if (profiles) {
            for (const profile of profiles) {
                const lat = adminLat + (Math.random() * 0.05 - 0.025);
                const lng = adminLng + (Math.random() * 0.05 - 0.025);
                await supabase.from('user_profiles').update({
                    last_known_latitude: lat,
                    last_known_longitude: lng
                }).eq('id', profile.id);
            }
            console.log(`Updated ${profiles.length} user profiles with mock locations.`);
        }

        console.log('Fetching clients...');
        const { data: clients } = await supabase.from('clients').select('id');
        if (clients) {
            for (const client of clients) {
                const lat = adminLat + (Math.random() * 0.05 - 0.025);
                const lng = adminLng + (Math.random() * 0.05 - 0.025);
                await supabase.from('clients').update({
                    latitude: lat,
                    longitude: lng
                }).eq('id', client.id);
            }
            console.log(`Updated ${clients.length} clients with mock locations.`);
        }

        console.log('Done!');
    } catch (e) {
        console.error(e);
    }
}

mockLocations();
