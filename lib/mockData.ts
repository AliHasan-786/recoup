// lib/mockData.ts
// All fictional data for Lakewood Suites (demo property group)

export type AlertType = 'late_fee' | 'pricing_gap' | 'churn_risk';
export type AlertStatus = 'active' | 'approved' | 'dismissed';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  impact: number; // dollar amount
  impactLabel: string;
  agentSteps: string[];
  guestCount?: number;
  guestNames?: string[];
  property: string;
  detectedAt: Date;
  status: AlertStatus;
  priority: 'high' | 'medium' | 'low';
  metadata: Record<string, string | number>;
}

export interface ScanLog {
  id: string;
  startedAt: Date;
  completedAt: Date;
  recordsScanned: number;
  alertsFound: number;
  totalRecovery: number;
}

export interface DailyRevenue {
  date: string;
  recovered: number;
  missed: number;
}

// ─── Agent Reasoning Scripts ──────────────────────────────────────────────────

export const LATE_FEE_SCRIPTS: string[][] = [
  [
    "Querying checkout records for the last 48 hours...",
    "Parsing 312 checkout events across 3 properties...",
    "Cross-referencing checkout timestamps with PMS billing ledger...",
    "Detected 4 checkouts after 2:00 PM cutoff with no late fee applied.",
    "Guest folios verified: no manual override or waiver logged.",
    "Late fee policy: $50/incident. Total recovery opportunity: $200.",
    "Drafting invoice actions for front desk approval..."
  ],
  [
    "Initiating billing audit for Lakewood Suites Boston...",
    "Loading reservation records: Apr 12–14 (847 records)...",
    "Running billing completeness check against checkout log...",
    "Anomaly detected: 2 extended-stay guests billed for standard rate.",
    "Extended stay policy rate: +$35/night after 3 nights. Applied to 4 nights each.",
    "Total missed billing: $280 across 2 folios.",
    "Flagging for finance team review..."
  ],
  [
    "Scanning yesterday's express checkouts (127 records)...",
    "Matching digital key return times with departure timestamps...",
    "Found 3 instances of unreturned parking passes — $25 fee each.",
    "Checking system for existing charges... none found.",
    "Recovery opportunity: $75 — initiating charge notices..."
  ]
];

export const PRICING_GAP_SCRIPTS: string[][] = [
  [
    "Loading Q2 dynamic pricing matrix for all properties...",
    "Fetching active reservations with check-in dates Apr 15–May 31...",
    "Cross-checking reservation rates against current market pricing...",
    "Detected: 6 bookings made at Q1 rack rate after April 1 repricing.",
    "Rate delta: $24.50/night average. 3-night mean stay = $73.50/booking.",
    "Estimated revenue gap across 6 bookings: $441.",
    "Note: 2 bookings within 24-hour cancellation window — recommend rate adjustment offer."
  ],
  [
    "Analyzing weekend occupancy patterns (last 8 weekends)...",
    "Current Friday-Saturday pricing: $189/night. Competitor avg: $224/night.",
    "Demand signals: property running 94% occupancy on weekends.",
    "Revenue left on table estimate: $2,100/month at current rates.",
    "Recommendation: A/B test $209 weekend rate — projected +$840/month at 90% fill.",
    "Flagging for Revenue Manager review..."
  ]
];

export const CHURN_RISK_SCRIPTS: string[][] = [
  [
    "Scanning loyalty member database (4,820 active members)...",
    "Applying churn risk model: last stay >120 days + no upcoming reservation...",
    "Scoring 847 members on 6 behavioral signals...",
    "High-risk cohort identified: 23 Platinum members, 180+ days since last stay.",
    "Calculating LTV at risk: avg Platinum spend $2,400/year × 23 members = $55,200.",
    "Cross-referencing with email engagement: 18/23 opening marketing emails.",
    "Recommended action: personalized win-back offer for top 5 highest-LTV members."
  ],
  [
    "Analyzing booking cancellation patterns (last 90 days)...",
    "Detected elevated cancellation rate in 'Advance Purchase' segment: 31% (vs 18% baseline).",
    "Correlating with pricing events... spike follows $40 weekend rate increase on Mar 15.",
    "Affected segment: 67 bookings cancelled, 41 have not rebooked.",
    "Estimated lost revenue: $41 × $312 avg booking value = $12,792.",
    "Recommendation: targeted 10% discount recovery campaign for this segment."
  ]
];

// ─── Seed Alerts ──────────────────────────────────────────────────────────────

export const SEED_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    type: 'late_fee',
    title: 'Late Checkout Fees Not Billed',
    description: '4 guests checked out after the 2:00 PM cutoff yesterday. The $50 late fee was not applied to any of the folios.',
    impact: 200,
    impactLabel: '$200 recovery',
    agentSteps: LATE_FEE_SCRIPTS[0],
    guestCount: 4,
    guestNames: ['Marcus T., Room 412', 'Jennifer L., Room 207', 'Aiden R., Room 318', 'Sofia M., Room 501'],
    property: 'Lakewood Suites Boston',
    detectedAt: new Date(Date.now() - 1000 * 60 * 8),
    status: 'active',
    priority: 'high',
    metadata: {
      'Checkout Cutoff': '2:00 PM',
      'Avg Checkout Time': '3:47 PM',
      'Fee Per Incident': '$50',
      'Policy Override': 'None logged',
    }
  },
  {
    id: 'alert-002',
    type: 'pricing_gap',
    title: 'Q1 Rate Applied Post-Repricing',
    description: '6 reservations were booked at the Q1 rack rate after the April 1st pricing update. Current market rate is $24.50/night higher.',
    impact: 441,
    impactLabel: '$441 gap',
    agentSteps: PRICING_GAP_SCRIPTS[0],
    guestCount: 6,
    property: 'Lakewood Suites Cambridge',
    detectedAt: new Date(Date.now() - 1000 * 60 * 25),
    status: 'active',
    priority: 'medium',
    metadata: {
      'Q1 Rate': '$165/night',
      'Current Rate': '$189.50/night',
      'Affected Bookings': '6',
      'Cancellation Window': '2 bookings',
    }
  },
  {
    id: 'alert-003',
    type: 'churn_risk',
    title: 'Platinum Members at Churn Risk',
    description: '5 high-LTV Platinum members haven\'t stayed in 180+ days with no upcoming reservation. Combined annual spend at risk: $12,000.',
    impact: 12000,
    impactLabel: '$12k at risk',
    agentSteps: CHURN_RISK_SCRIPTS[0],
    guestCount: 5,
    guestNames: ['Sarah K. (Platinum, 8 stays/yr)', 'David W. (Platinum, 6 stays/yr)', 'Priya N. (Platinum, 9 stays/yr)', 'James O. (Platinum, 5 stays/yr)', 'Rachel B. (Platinum, 7 stays/yr)'],
    property: 'All Properties',
    detectedAt: new Date(Date.now() - 1000 * 60 * 47),
    status: 'active',
    priority: 'high',
    metadata: {
      'Segment': 'Platinum Loyalty',
      'Days Since Last Stay': '180–240',
      'Avg Annual Value': '$2,400/member',
      'Email Engagement': '4/5 active',
    }
  },
  {
    id: 'alert-004',
    type: 'late_fee',
    title: 'Parking Pass Charges Not Applied',
    description: '3 express checkouts yesterday did not return parking passes. Standard $25 fee was not applied to folios.',
    impact: 75,
    impactLabel: '$75 recovery',
    agentSteps: LATE_FEE_SCRIPTS[2],
    guestCount: 3,
    property: 'Lakewood Suites Boston',
    detectedAt: new Date(Date.now() - 1000 * 60 * 92),
    status: 'approved',
    priority: 'low',
    metadata: {
      'Pass Type': 'Daily Parking',
      'Fee Per Pass': '$25',
      'Pass Return': 'Not confirmed',
    }
  },
  {
    id: 'alert-005',
    type: 'pricing_gap',
    title: 'Weekend Rate Below Market',
    description: 'Competitive analysis shows weekend rates $35/night below comp set average. Property running 94% weekend occupancy, leaving significant revenue on table.',
    impact: 2100,
    impactLabel: '$2.1k/mo gap',
    agentSteps: PRICING_GAP_SCRIPTS[1],
    property: 'Lakewood Suites Providence',
    detectedAt: new Date(Date.now() - 1000 * 60 * 180),
    status: 'dismissed',
    priority: 'medium',
    metadata: {
      'Current Rate': '$189/night',
      'Comp Set Avg': '$224/night',
      'Weekend Occupancy': '94%',
      'Projected Gain': '+$840/mo',
    }
  }
];

// ─── New alert templates for "Scan Now" ──────────────────────────────────────

export const NEW_ALERT_TEMPLATES: Omit<Alert, 'id' | 'detectedAt' | 'status'>[] = [
  {
    type: 'late_fee',
    title: 'Extended Stay Guests Billed at Standard Rate',
    description: '2 guests in extended stays (4+ nights) were billed at the standard nightly rate. Extended stay discount policy reversed — additional charges apply.',
    impact: 280,
    impactLabel: '$280 recovery',
    agentSteps: LATE_FEE_SCRIPTS[1],
    guestCount: 2,
    property: 'Lakewood Suites Cambridge',
    priority: 'high',
    metadata: {
      'Policy': 'Extended stay surcharge after night 3',
      'Rate Delta': '+$35/night',
      'Nights Affected': '4 nights each',
    }
  },
  {
    type: 'churn_risk',
    title: 'Cancellation Spike in Advance Purchase Segment',
    description: 'Advance Purchase bookings show a 31% cancellation rate (vs 18% baseline) since the March rate adjustment. 41 guests have not rebooked.',
    impact: 12792,
    impactLabel: '$12.8k at risk',
    agentSteps: CHURN_RISK_SCRIPTS[1],
    guestCount: 41,
    property: 'All Properties',
    priority: 'high',
    metadata: {
      'Cancellation Rate': '31% (baseline: 18%)',
      'Root Cause': 'Mar 15 rate increase',
      'Avg Booking Value': '$312',
      'Recovery Action': '10% win-back offer',
    }
  }
];

// ─── Revenue Trend Data ───────────────────────────────────────────────────────

export const REVENUE_TREND: DailyRevenue[] = [
  { date: 'Apr 7', recovered: 0, missed: 0 },
  { date: 'Apr 8', recovered: 150, missed: 620 },
  { date: 'Apr 9', recovered: 320, missed: 440 },
  { date: 'Apr 10', recovered: 75, missed: 380 },
  { date: 'Apr 11', recovered: 580, missed: 820 },
  { date: 'Apr 12', recovered: 275, missed: 290 },
  { date: 'Apr 13', recovered: 441, missed: 560 },
  { date: 'Apr 14', recovered: 200, missed: 2841 },
];

// ─── Scan Logs ────────────────────────────────────────────────────────────────

export const SCAN_LOGS: ScanLog[] = [
  {
    id: 'scan-001',
    startedAt: new Date(Date.now() - 1000 * 60 * 8),
    completedAt: new Date(Date.now() - 1000 * 60 * 7),
    recordsScanned: 847,
    alertsFound: 2,
    totalRecovery: 641,
  },
  {
    id: 'scan-002',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 55),
    recordsScanned: 1204,
    alertsFound: 3,
    totalRecovery: 2316,
  },
  {
    id: 'scan-003',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 8 + 1000 * 48),
    recordsScanned: 632,
    alertsFound: 1,
    totalRecovery: 75,
  },
  {
    id: 'scan-004',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 62),
    recordsScanned: 1891,
    alertsFound: 4,
    totalRecovery: 3271,
  },
];
