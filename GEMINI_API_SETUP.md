# 🤖 Gemini API Setup Guide

## How to Get Your Gemini API Key

### Step 1: Go to Google AI Studio
1. Visit: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key
1. Click "Create API Key"
2. Give your key a descriptive name (e.g., "DormFlow-Production")
3. Copy the API key (it starts with `AIzaSy...`)

### Step 3: Add to Environment Variables

#### For Local Development:
Add to your `.env` file:
```bash
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456789
```

#### For Vercel Deployment:
Add in Vercel Dashboard → Environment Variables:
- **Variable Name**: `GEMINI_API_KEY`
- **Value**: Your actual API key
- **Environment**: Production

## What Gemini AI Powers in Your App

### 1. **Admin Dashboard Insights** (`/api/ai/facility-insights`)
- Generates 3 bullet-point insights about hostel metrics
- Analyzes occupancy, complaints, and revenue data
- Provides actionable recommendations for admins

### 2. **Notice Auto-Drafting** (`/api/ai/draft-notice`)
- Converts brief ideas into professional notices
- Creates 4-sentence formal announcements
- Maintains professional tone and clarity

### 3. **Complaint Enhancement** (Currently Disabled)
- Enhances informal complaint descriptions
- Converts to professional, detailed descriptions
- **Note**: We removed this feature for better user experience

## API Usage & Limits

### Free Tier Limits:
- **15 requests per minute**
- **1,500 requests per day**
- Perfect for small to medium hostels

### Model Used:
- **Gemini 2.5 Flash** (`gemini-2.5-flash`)
- Fast and cost-effective
- Great for text generation tasks

## Testing the API

### Test Endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/ai/facility-insights \
  -H "Content-Type: application/json" \
  -d '{"data": {"occupancy": 85, "complaints": 12, "revenue": 45000}}'
```

### Expected Response:
```json
{
  "insights": "• Occupancy is at 85% - consider marketing to reach full capacity\n• 12 active complaints require immediate attention to maintain resident satisfaction\n• Revenue of $45,000 indicates healthy financial performance"
}
```

## Troubleshooting

### Common Issues:
1. **Invalid API Key**: Ensure the key is copied correctly without extra spaces
2. **Rate Limit Exceeded**: Upgrade to paid tier if needed
3. **CORS Issues**: Make sure your Vercel domain is allowed

### Error Messages:
- `"Failed to generate insights"`: Check API key validity
- `"Rate limit exceeded"`: Wait and retry, or upgrade plan

## Security Notes

- **Never commit API keys to Git**
- **Use environment variables only**
- **Rotate keys periodically for security**
- **Monitor usage in Google AI Studio**

## Cost Estimation

### Free Tier (Perfect for Start):
- **Cost**: $0
- **Requests**: 1,500/day
- **Suitable for**: Hostels with <100 residents

### Paid Tier (if needed):
- **Cost**: ~$0.00025 per 1,000 characters
- **Typical monthly cost**: $5-20 for medium hostels
- **Pay-as-you-go**: No monthly commitment
