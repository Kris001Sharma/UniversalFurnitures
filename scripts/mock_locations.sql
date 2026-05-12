/* 
  Mock Locations Script
  This script sets the last known latitude and longitude for all agents (sales and delivery)
  and clients to randomized locations around the admin hub (Bharatpur: 27.6687, 84.4264).
  
  Run this in your Supabase SQL Editor.
*/

-- Update Agents
UPDATE public.user_profiles 
SET 
  last_known_latitude = 27.6687 + (random() * 0.05 - 0.025),
  last_known_longitude = 84.4264 + (random() * 0.05 - 0.025)
WHERE role IN ('SALES', 'DELIVERY');

-- Update Clients
UPDATE public.clients
SET 
  latitude = 27.6687 + (random() * 0.05 - 0.025),
  longitude = 84.4264 + (random() * 0.05 - 0.025);
