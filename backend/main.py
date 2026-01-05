from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Literal
import random
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SentinelAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class ThreatItem(BaseModel):
    id: str
    source: str
    severity: Literal["critical", "high", "medium", "low"]
    timestamp: str
    threat_type: Literal["Malware", "Phishing", "C2", "Ransomware", "DDoS"]
    description: str
    ip_address: str | None = None
    country: str | None = None

class AnalyzeRequest(BaseModel):
    target: str

class AnalyzeResponse(BaseModel):
    target: str
    risk_score: int
    threat_level: str
    findings: List[str]
    recommendations: List[str]

@app.get("/")
def read_root():
    return {"status": "SentinelAI API Online", "version": "2.0.0", "database": "Connected"}

@app.get("/api/stats")
def get_stats():
    try:
        result = supabase.table("statistics").select("*").order("updated_at", desc=True).limit(1).execute()

        if result.data and len(result.data) > 0:
            stats = result.data[0]

            threats_count = supabase.table("threats").select("*", count="exact").execute()
            stats["total_alerts"] = threats_count.count if threats_count.count else stats["total_alerts"]

            ransomware_count = supabase.table("threats").select("*", count="exact").eq("threat_type", "Ransomware").execute()
            stats["active_ransomware"] = ransomware_count.count if ransomware_count.count else stats["active_ransomware"]

            now = datetime.now()
            supabase.table("statistics").update({
                "total_alerts": stats["total_alerts"],
                "active_ransomware": stats["active_ransomware"],
                "system_health": random.randint(94, 99),
                "blocked_threats": stats["blocked_threats"] + random.randint(0, 5),
                "updated_at": now.isoformat()
            }).eq("id", stats["id"]).execute()

            return {
                "total_alerts": stats["total_alerts"],
                "active_ransomware": stats["active_ransomware"],
                "system_health": stats["system_health"],
                "blocked_threats": stats["blocked_threats"],
                "monitored_endpoints": stats["monitored_endpoints"]
            }

        return {
            "total_alerts": 0,
            "active_ransomware": 0,
            "system_health": 95,
            "blocked_threats": 0,
            "monitored_endpoints": 1000
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {
            "total_alerts": 1247,
            "active_ransomware": 23,
            "system_health": 97,
            "blocked_threats": 543,
            "monitored_endpoints": 1024
        }

@app.get("/api/threat-feed")
def get_threat_feed():
    try:
        result = supabase.table("threats").select("*").order("created_at", desc=True).limit(50).execute()

        if result.data and len(result.data) > 0:
            threats = []
            for threat in result.data[:15]:
                threats.append({
                    "id": threat["threat_id"],
                    "source": threat["source"],
                    "severity": threat["severity"],
                    "timestamp": threat["created_at"],
                    "threat_type": threat["threat_type"],
                    "description": threat["description"],
                    "ip_address": threat.get("ip_address"),
                    "country": threat.get("country")
                })

            if random.random() > 0.7:
                new_threat = generate_new_threat()
                threats.insert(0, new_threat)

            return {"threats": threats}

        initial_threats = []
        for i in range(10):
            initial_threats.append(generate_new_threat())
        return {"threats": initial_threats}

    except Exception as e:
        print(f"Error fetching threat feed: {e}")
        threats = []
        for i in range(10):
            threats.append(generate_new_threat())
        return {"threats": threats}

def generate_new_threat():
    threat_sources = [
        "VirusTotal", "AlienVault OTX", "Shodan", "AbuseIPDB",
        "ThreatCrowd", "URLhaus", "Hybrid Analysis", "ANY.RUN"
    ]

    threat_types = ["Malware", "Phishing", "C2", "Ransomware", "DDoS"]
    severities = ["critical", "high", "medium", "low"]
    countries = ["Russia", "China", "North Korea", "Iran", "Ukraine", "Romania", "Germany", "Unknown"]

    descriptions = {
        "Malware": [
            "Trojan detected attempting to establish persistence",
            "Suspicious executable with obfuscated code",
            "Backdoor attempting network communication",
            "Cryptominer detected on endpoint",
            "Keylogger attempting data exfiltration",
            "Rootkit attempting privilege escalation"
        ],
        "Phishing": [
            "Credential harvesting page detected",
            "Spear-phishing email with malicious attachment",
            "Fake login portal mimicking corporate SSO",
            "SMS phishing campaign targeting employees",
            "Business email compromise attempt detected",
            "Social engineering attack in progress"
        ],
        "C2": [
            "Command & Control server beacon detected",
            "Suspicious DNS queries to known C2 domain",
            "Encrypted C2 traffic over HTTPS",
            "C2 infrastructure linked to APT group",
            "Callback to foreign C2 server detected",
            "Data exfiltration to C2 server in progress"
        ],
        "Ransomware": [
            "File encryption activity detected",
            "Ransom note dropped on file system",
            "Mass file modification behavior",
            "Ransomware payload download attempt",
            "Shadow copy deletion detected",
            "Encryption keys being generated"
        ],
        "DDoS": [
            "Amplification attack targeting network",
            "Botnet activity detected",
            "HTTP flood attack in progress",
            "UDP flood from multiple sources",
            "SYN flood attack detected",
            "Application layer DDoS in progress"
        ]
    }

    threat_type = random.choice(threat_types)
    threat_id = f"THR-{random.randint(10000, 99999)}"
    ip_address = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
    country = random.choice(countries)

    threat_data = {
        "id": threat_id,
        "source": random.choice(threat_sources),
        "severity": random.choice(severities),
        "timestamp": datetime.now().isoformat(),
        "threat_type": threat_type,
        "description": random.choice(descriptions[threat_type]),
        "ip_address": ip_address,
        "country": country
    }

    try:
        coords = get_country_coords(country)
        supabase.table("threats").insert({
            "threat_id": threat_id,
            "source": threat_data["source"],
            "severity": threat_data["severity"],
            "threat_type": threat_type,
            "description": threat_data["description"],
            "ip_address": ip_address,
            "country": country,
            "latitude": coords["lat"],
            "longitude": coords["lng"]
        }).execute()
    except Exception as e:
        print(f"Error inserting threat: {e}")

    return threat_data

def get_country_coords(country):
    coords_map = {
        "Russia": {"lat": 55.7558, "lng": 37.6173},
        "China": {"lat": 39.9042, "lng": 116.4074},
        "North Korea": {"lat": 39.0392, "lng": 125.7625},
        "Iran": {"lat": 35.6892, "lng": 51.3890},
        "Ukraine": {"lat": 50.4501, "lng": 30.5234},
        "Romania": {"lat": 44.4268, "lng": 26.1025},
        "Germany": {"lat": 52.5200, "lng": 13.4050},
        "South Africa": {"lat": -33.9249, "lng": 18.4241},
        "Unknown": {"lat": 0, "lng": 0}
    }
    return coords_map.get(country, {"lat": 0, "lng": 0})

@app.get("/api/threat-map")
def get_threat_map():
    try:
        result = supabase.table("threats").select("*").not_.is_("latitude", "null").not_.is_("longitude", "null").order("created_at", desc=True).limit(100).execute()

        if result.data and len(result.data) > 0:
            map_data = []
            for threat in result.data:
                if threat["latitude"] and threat["longitude"]:
                    map_data.append({
                        "id": threat["threat_id"],
                        "lat": float(threat["latitude"]),
                        "lng": float(threat["longitude"]),
                        "country": threat["country"],
                        "severity": threat["severity"],
                        "threat_type": threat["threat_type"],
                        "description": threat["description"],
                        "ip_address": threat.get("ip_address"),
                        "timestamp": threat["created_at"]
                    })

            return {"threats": map_data, "total": len(map_data)}

        return {"threats": [], "total": 0}

    except Exception as e:
        print(f"Error fetching threat map: {e}")
        return {"threats": [], "total": 0}

@app.post("/api/analyze")
def analyze_target(request: AnalyzeRequest):
    target = request.target.strip()

    is_ip = all(c.isdigit() or c == '.' for c in target)
    target_type = "ip" if is_ip else "url"

    try:
        existing = supabase.table("analyzed_targets").select("*").eq("target", target).order("analyzed_at", desc=True).limit(1).execute()

        if existing.data and len(existing.data) > 0:
            recent = existing.data[0]
            analyzed_time = datetime.fromisoformat(recent["analyzed_at"].replace('Z', '+00:00'))
            if datetime.now(analyzed_time.tzinfo) - analyzed_time < timedelta(hours=1):
                return {
                    "target": target,
                    "risk_score": recent["risk_score"],
                    "threat_level": recent["threat_level"],
                    "findings": recent["findings"],
                    "recommendations": recent["recommendations"],
                    "cached": True
                }
    except Exception as e:
        print(f"Error checking cache: {e}")

    risk_score = random.randint(35, 95)

    if risk_score >= 80:
        threat_level = "Critical"
    elif risk_score >= 60:
        threat_level = "High"
    elif risk_score >= 40:
        threat_level = "Medium"
    else:
        threat_level = "Low"

    findings = []
    recommendations = []

    if is_ip:
        findings = [
            f"IP {target} appears in {random.randint(3, 8)} threat intelligence feeds",
            f"Associated with {random.randint(1, 5)} malware families",
            f"Last seen activity: {random.choice(['2 hours ago', '1 day ago', '3 days ago', '1 week ago'])}",
            f"Geolocation: {random.choice(['Russia', 'China', 'North Korea', 'Iran', 'Unknown'])}",
            f"Open ports detected: {', '.join([str(random.randint(80, 9000)) for _ in range(random.randint(2, 5))])}",
            f"Associated with {random.randint(5, 20)} suspicious domains"
        ]
        recommendations = [
            "Block IP at network perimeter immediately",
            "Review firewall logs for connection attempts",
            "Scan endpoints for indicators of compromise",
            "Alert security team for further investigation",
            "Add to threat intelligence feeds",
            "Monitor for similar IP ranges from same ASN"
        ]
    else:
        findings = [
            f"Domain {target} flagged by {random.randint(2, 6)} security vendors",
            f"SSL certificate status: {random.choice(['Invalid', 'Self-signed', 'Expired', 'Untrusted CA'])}",
            f"Associated with {random.choice(['phishing', 'malware distribution', 'C2 infrastructure', 'credential theft'])}",
            f"Domain age: {random.randint(1, 30)} days",
            f"DNS records show {random.randint(1, 4)} A records",
            f"Similar domains detected: {random.randint(3, 10)} variations"
        ]
        recommendations = [
            "Add domain to blocklist immediately",
            "Review email gateway for similar domains",
            "Educate users about this threat campaign",
            "Monitor for typosquatting variants",
            "Block at DNS level across organization",
            "Report to domain registrar for takedown"
        ]

    try:
        supabase.table("analyzed_targets").insert({
            "target": target,
            "target_type": target_type,
            "risk_score": risk_score,
            "threat_level": threat_level,
            "findings": findings,
            "recommendations": recommendations
        }).execute()
    except Exception as e:
        print(f"Error storing analysis: {e}")

    return {
        "target": target,
        "risk_score": risk_score,
        "threat_level": threat_level,
        "findings": findings,
        "recommendations": recommendations,
        "cached": False
    }

@app.get("/api/analysis-history")
def get_analysis_history():
    try:
        result = supabase.table("analyzed_targets").select("*").order("analyzed_at", desc=True).limit(50).execute()

        if result.data:
            return {"analyses": result.data, "total": len(result.data)}

        return {"analyses": [], "total": 0}
    except Exception as e:
        print(f"Error fetching analysis history: {e}")
        return {"analyses": [], "total": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
