from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Literal
import random

app = FastAPI(title="SentinelAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ThreatItem(BaseModel):
    id: str
    source: str
    severity: Literal["critical", "high", "medium", "low"]
    timestamp: str
    threat_type: Literal["Malware", "Phishing", "C2", "Ransomware", "DDoS"]
    description: str

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
    return {"status": "SentinelAI API Online", "version": "1.0.0"}

@app.get("/api/stats")
def get_stats():
    return {
        "total_alerts": random.randint(1200, 1500),
        "active_ransomware": random.randint(15, 35),
        "system_health": random.randint(94, 99),
        "blocked_threats": random.randint(450, 650),
        "monitored_endpoints": random.randint(800, 1200)
    }

@app.get("/api/threat-feed")
def get_threat_feed():
    threat_sources = [
        "VirusTotal", "AlienVault OTX", "Shodan", "AbuseIPDB",
        "ThreatCrowd", "URLhaus", "Hybrid Analysis", "ANY.RUN"
    ]

    threat_types = ["Malware", "Phishing", "C2", "Ransomware", "DDoS"]
    severities = ["critical", "high", "medium", "low"]

    descriptions = {
        "Malware": [
            "Trojan detected attempting to establish persistence",
            "Suspicious executable with obfuscated code",
            "Backdoor attempting network communication",
            "Cryptominer detected on endpoint"
        ],
        "Phishing": [
            "Credential harvesting page detected",
            "Spear-phishing email with malicious attachment",
            "Fake login portal mimicking corporate SSO",
            "SMS phishing campaign targeting employees"
        ],
        "C2": [
            "Command & Control server beacon detected",
            "Suspicious DNS queries to known C2 domain",
            "Encrypted C2 traffic over HTTPS",
            "C2 infrastructure linked to APT group"
        ],
        "Ransomware": [
            "File encryption activity detected",
            "Ransom note dropped on file system",
            "Mass file modification behavior",
            "Ransomware payload download attempt"
        ],
        "DDoS": [
            "Amplification attack targeting network",
            "Botnet activity detected",
            "HTTP flood attack in progress",
            "UDP flood from multiple sources"
        ]
    }

    threats = []
    for i in range(15):
        threat_type = random.choice(threat_types)
        threats.append({
            "id": f"THR-{random.randint(10000, 99999)}",
            "source": random.choice(threat_sources),
            "severity": random.choice(severities),
            "timestamp": datetime.now().isoformat(),
            "threat_type": threat_type,
            "description": random.choice(descriptions[threat_type])
        })

    return {"threats": threats}

@app.post("/api/analyze")
def analyze_target(request: AnalyzeRequest):
    target = request.target

    is_ip = all(c.isdigit() or c == '.' for c in target)

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
            f"Last seen activity: {random.choice(['2 hours ago', '1 day ago', '3 days ago'])}",
            f"Geolocation: {random.choice(['Russia', 'China', 'North Korea', 'Unknown'])}"
        ]
        recommendations = [
            "Block IP at network perimeter",
            "Review firewall logs for connection attempts",
            "Scan endpoints for indicators of compromise",
            "Alert security team for further investigation"
        ]
    else:
        findings = [
            f"Domain {target} flagged by {random.randint(2, 6)} security vendors",
            f"SSL certificate status: {random.choice(['Invalid', 'Self-signed', 'Expired'])}",
            f"Associated with {random.choice(['phishing', 'malware distribution', 'C2 infrastructure'])}",
            f"Domain age: {random.randint(1, 30)} days"
        ]
        recommendations = [
            "Add domain to blocklist immediately",
            "Review email gateway for similar domains",
            "Educate users about this threat campaign",
            "Monitor for typosquatting variants"
        ]

    return {
        "target": target,
        "risk_score": risk_score,
        "threat_level": threat_level,
        "findings": findings,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
