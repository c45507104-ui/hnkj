/*
  # Threat Intelligence Database Schema

  1. New Tables
    - `threats`
      - `id` (uuid, primary key) - Unique threat identifier
      - `threat_id` (text) - Human-readable threat ID (e.g., THR-12345)
      - `source` (text) - Threat intelligence source
      - `severity` (text) - critical, high, medium, low
      - `threat_type` (text) - Malware, Phishing, C2, Ransomware, DDoS
      - `description` (text) - Threat description
      - `ip_address` (text) - Associated IP address
      - `country` (text) - Country of origin
      - `latitude` (numeric) - Geolocation latitude
      - `longitude` (numeric) - Geolocation longitude
      - `created_at` (timestamptz) - Timestamp of threat detection
      
    - `analyzed_targets`
      - `id` (uuid, primary key) - Unique analysis ID
      - `target` (text) - IP address or URL analyzed
      - `target_type` (text) - 'ip' or 'url'
      - `risk_score` (integer) - Risk score 0-100
      - `threat_level` (text) - Critical, High, Medium, Low
      - `findings` (jsonb) - Array of findings
      - `recommendations` (jsonb) - Array of recommendations
      - `analyzed_at` (timestamptz) - Analysis timestamp
      
    - `statistics`
      - `id` (uuid, primary key)
      - `total_alerts` (integer)
      - `active_ransomware` (integer)
      - `system_health` (integer)
      - `blocked_threats` (integer)
      - `monitored_endpoints` (integer)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (SOC dashboard is typically viewed by authenticated security teams)
*/

-- Create threats table
CREATE TABLE IF NOT EXISTS threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_id text NOT NULL,
  source text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  threat_type text NOT NULL CHECK (threat_type IN ('Malware', 'Phishing', 'C2', 'Ransomware', 'DDoS')),
  description text NOT NULL,
  ip_address text,
  country text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

-- Create analyzed_targets table
CREATE TABLE IF NOT EXISTS analyzed_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('ip', 'url')),
  risk_score integer NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  threat_level text NOT NULL CHECK (threat_level IN ('Critical', 'High', 'Medium', 'Low')),
  findings jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  analyzed_at timestamptz DEFAULT now()
);

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_alerts integer DEFAULT 0,
  active_ransomware integer DEFAULT 0,
  system_health integer DEFAULT 95,
  blocked_threats integer DEFAULT 0,
  monitored_endpoints integer DEFAULT 1000,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_threats_created_at ON threats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_country ON threats(country);
CREATE INDEX IF NOT EXISTS idx_analyzed_targets_target ON analyzed_targets(target);
CREATE INDEX IF NOT EXISTS idx_analyzed_targets_analyzed_at ON analyzed_targets(analyzed_at DESC);

-- Enable Row Level Security
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (SOC dashboards are typically accessible to security teams)
CREATE POLICY "Allow public read access to threats"
  ON threats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to threats"
  ON threats FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to analyzed_targets"
  ON analyzed_targets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to analyzed_targets"
  ON analyzed_targets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to statistics"
  ON statistics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public update to statistics"
  ON statistics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial statistics row
INSERT INTO statistics (total_alerts, active_ransomware, system_health, blocked_threats, monitored_endpoints)
VALUES (1247, 23, 97, 543, 1024)
ON CONFLICT DO NOTHING;

-- Insert sample threat data with geolocation
INSERT INTO threats (threat_id, source, severity, threat_type, description, ip_address, country, latitude, longitude) VALUES
('THR-10001', 'VirusTotal', 'critical', 'Ransomware', 'Ransomware payload download attempt', '185.220.101.45', 'Russia', 55.7558, 37.6173),
('THR-10002', 'AlienVault OTX', 'high', 'Malware', 'Trojan detected attempting to establish persistence', '103.224.182.251', 'China', 39.9042, 116.4074),
('THR-10003', 'Shodan', 'critical', 'C2', 'Command & Control server beacon detected', '91.219.236.197', 'Russia', 59.9343, 30.3351),
('THR-10004', 'AbuseIPDB', 'medium', 'Phishing', 'Credential harvesting page detected', '45.142.212.61', 'Germany', 52.5200, 13.4050),
('THR-10005', 'ThreatCrowd', 'high', 'DDoS', 'Botnet activity detected', '114.119.145.145', 'China', 31.2304, 121.4737),
('THR-10006', 'URLhaus', 'critical', 'Malware', 'Suspicious executable with obfuscated code', '178.209.51.221', 'Ukraine', 50.4501, 30.5234),
('THR-10007', 'Hybrid Analysis', 'high', 'Phishing', 'Spear-phishing email with malicious attachment', '217.12.221.244', 'Romania', 44.4268, 26.1025),
('THR-10008', 'ANY.RUN', 'medium', 'Malware', 'Cryptominer detected on endpoint', '156.146.56.136', 'South Africa', -33.9249, 18.4241)
ON CONFLICT DO NOTHING;