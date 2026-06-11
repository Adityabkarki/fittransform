export interface DietItem {
  id: string;
  time: string;
  name: string;
  note: string;
  p: number;
  supp?: boolean;
}

export const DIET: DietItem[] = [
  { id: "breakfast", time: "9–10 AM", name: "Dal bhat + 3 boiled eggs", note: "Light on rice (≤1.5 cup), heavy on dal & veg", p: 30 },
  { id: "d3", time: "9–10 AM", name: "Vitamin D3 + Omega-3", note: "With breakfast — needs fat to absorb", p: 0, supp: true },
  { id: "khaja", time: "2–3 PM", name: "Khaja: curd + roasted chana (or whey + fruit)", note: "Don't skip — fuels the 8 PM session", p: 15 },
  { id: "pregym", time: "6:30–7 PM", name: "Pre-gym: banana or 2 roti", note: "Light, ~1 hr before training", p: 4 },
  { id: "whey", time: "9:15 PM", name: "Whey (1 scoop) + Creatine 3–5g", note: "Right after the workout, with water. Creatine even on rest days", p: 25, supp: true },
  { id: "dinner", time: "10–11 PM", name: "Dal bhat dinner — DOUBLE dal", note: "Keep it moderate if apnea is suspected", p: 25 },
  { id: "proteinAdd", time: "with dinner", name: "Protein add-on: chicken / paneer / soya chunks", note: "Aim 3+ days/week. Soya 50g dry = 26g protein, cheapest option", p: 30 },
];

export const PROTEIN_TARGET = 145;
