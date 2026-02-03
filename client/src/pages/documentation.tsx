import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

// This would typically come from an API or file import. 
// For this generation, I'll embed the standard setup guide content.
const SETUP_GUIDE = `
## Integration Guide

This guide explains how to integrate the License Manager verification into your application. We support multiple languages including **TypeScript**, **Java**, **Go**, and **Rust**.

### API Endpoint

**POST** \`/api/licenses/verify\`

### Language Examples

#### TypeScript / Node.js
\`\`\`typescript
async function verifyLicense(key: string) {
  const response = await fetch('/api/licenses/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
  return await response.json();
}
\`\`\`

#### Java / Spring
\`\`\`java
public class LicenseService {
    public boolean verify(String key) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> map = new HashMap<>();
        map.put("key", key);
        ResponseEntity<String> response = restTemplate.postForEntity(
            "https://your-api.com/api/licenses/verify", map, String.class);
        return response.getStatusCode().is2xxSuccessful();
    }
}
\`\`\`

#### Go / Fiber
\`\`\`go
func VerifyLicense(key string) bool {
    payload := strings.NewReader(fmt.Sprintf(\`{"key": "%s"}\`, key))
    res, _ := http.Post("https://your-api.com/api/licenses/verify", "application/json", payload)
    return res.StatusCode == 200
}
\`\`\`

#### Rust / Actix
\`\`\`rust
pub async fn verify_license(key: &str) -> Result<bool, reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client.post("https://your-api.com/api/licenses/verify")
        .json(&serde_json::json!({ "key": key }))
        .send()
        .await?;
    Ok(res.status().is_success())
}
\`\`\`
`;

export default function DocumentationPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integration Docs</h2>
        <p className="text-muted-foreground mt-2">How to connect your applications.</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown>{SETUP_GUIDE}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
