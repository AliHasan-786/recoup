import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are an AI revenue recovery agent embedded in a hotel property management system. 
Your job is to analyze hotel data and identify missed revenue opportunities.

When given an alert type and context, generate exactly 6-7 concise reasoning steps that show your investigation process.
Each step should read like a technical log entry — specific, data-driven, and action-oriented.
Steps should build on each other logically, starting from data querying and ending with a clear finding.

Format your response as a JSON array of strings. Each string is one step (max 90 chars).
Do not include any text outside the JSON array.

Example format:
["Step 1 text...", "Step 2 text...", "Step 3 text...", "Step 4 text...", "Step 5 text...", "Step 6 text..."]`;

export async function POST(req: NextRequest) {
  const { alertType, context } = await req.json();

  const userPrompt = buildPrompt(alertType, context);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://recoup.ai',
        'X-Title': 'Recoup — Revenue Recovery Agent',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';
    
    // Parse the JSON array from the response
    let steps: string[] = [];
    try {
      steps = JSON.parse(content);
    } catch {
      // Fall back to splitting by newline if JSON parse fails
      steps = content.split('\n').filter((s: string) => s.trim().length > 0).slice(0, 7);
    }

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    // Return fallback steps so the demo never breaks
    return NextResponse.json({ steps: getFallbackSteps(alertType), fallback: true });
  }
}

function buildPrompt(alertType: string, context: Record<string, string>): string {
  const contextStr = Object.entries(context).map(([k, v]) => `${k}: ${v}`).join(', ');
  
  const prompts: Record<string, string> = {
    late_fee: `Generate reasoning steps for an AI agent investigating late checkout fees at a hotel. Context: ${contextStr}. The agent should query checkout records, cross-reference billing, and calculate the recovery opportunity.`,
    pricing_gap: `Generate reasoning steps for an AI agent detecting a pricing gap at a hotel. Context: ${contextStr}. The agent should analyze market rates, compare against current bookings, and quantify the revenue gap.`,
    churn_risk: `Generate reasoning steps for an AI agent identifying churn-risk guests at a hotel loyalty program. Context: ${contextStr}. The agent should score members on behavioral signals, calculate LTV at risk, and recommend a retention action.`,
  };
  
  return prompts[alertType] ?? prompts.late_fee;
}

function getFallbackSteps(alertType: string): string[] {
  const fallbacks: Record<string, string[]> = {
    late_fee: [
      'Querying checkout records for the past 48 hours...',
      'Parsing 312 checkout events across 3 properties...',
      'Cross-referencing timestamps with billing ledger...',
      'Detected 4 checkouts after 2:00 PM — no late fee applied.',
      'Verified: no manual waiver or policy override logged.',
      'Total recovery opportunity calculated: $200.',
      'Drafting invoice actions — ready for approval.',
    ],
    pricing_gap: [
      'Loading current Q2 pricing matrix for all properties...',
      'Fetching active reservations with future check-in dates...',
      'Cross-referencing booked rates vs. current market rates...',
      'Detected: 6 bookings still at Q1 rack rate post-repricing.',
      'Rate delta: $24.50/night avg, 3-night mean stay.',
      'Total revenue gap across 6 bookings: $441.',
      'Flagging for Revenue Manager review.',
    ],
    churn_risk: [
      'Scanning loyalty member database (4,820 active members)...',
      'Applying churn model: 120+ days inactive, no upcoming booking...',
      'Scoring 847 members across 6 behavioral signals...',
      'High-risk cohort: 23 Platinum members, 180+ days since last stay.',
      'LTV at risk: avg $2,400/yr × 23 members = $55,200.',
      'Email engagement verified: 18/23 opening campaigns.',
      'Recommended: personalized win-back offer for top 5 LTV members.',
    ],
  };
  return fallbacks[alertType] ?? fallbacks.late_fee;
}
