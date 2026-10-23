import type { WeakAreaId, StudyUnit } from "./types";

export interface WeakArea {
  id: WeakAreaId;
  label: string;
  icon: string;
  subtopics: string[];
  tips: string[];
}

export const WEAK_AREAS: WeakArea[] = [
  {
    id: "cloud-concepts",
    label: "Cloud Concepts",
    icon: "Cloud",
    subtopics: [
      "What is Cloud Computing?",
      "Cloud Service Models (IaaS, PaaS, SaaS)",
      "Public, Private & Hybrid Cloud",
      "Consumption-Based Pricing Model",
    ],
    tips: [
      "Think of cloud computing like M-Pesa: instead of buying your own bank, you pay per transaction for the service you actually use.",
      "IaaS is renting an empty shop in a Lagos mall, PaaS is renting a stocked kitchen, SaaS is ordering food from Jumia Food — different levels of done-for-you.",
      "Public cloud is shared office space in Nairobi's CBD, private cloud is your own fenced compound, hybrid is keeping your goat pen at home but renting city storage.",
      "Consumption billing is like paying for electricity on a prepaid meter in Accra — you only pay for the units you actually burn.",
    ],
  },
  {
    id: "azure-architecture",
    label: "Azure Architecture",
    icon: "Network",
    subtopics: [
      "Regions & Availability Zones",
      "Resource Groups & Resource Manager",
      "Availability Sets vs. VM Scale Sets",
      "Core Azure Services (Compute, Storage, Networking)",
    ],
    tips: [
      "Think of Availability Zones like having backup generators in different parts of Nairobi to keep the city running if one area loses power.",
      "A Resource Group is like a folder on your desk at work — all related receipts and files for one project live together so you can find and close them at once.",
      "Availability Sets are like assigning guards to different shifts so a single sickness doesn't leave your Kampala shop unguarded; Scale Sets are cloning the whole shop when demand spikes.",
      "Compute is the kitchen, storage is the pantry, networking is the road that delivers food — Azure gives you all three so your app can cook, store, and ship.",
    ],
  },
  {
    id: "azure-management",
    label: "Azure Management",
    icon: "Settings",
    subtopics: [
      "Azure Portal, CLI & PowerShell",
      "ARM Templates (Infrastructure as Code)",
      "Azure Advisor & Monitor",
      "Azure Policy & Blueprints",
    ],
    tips: [
      "The Portal is your dashboard, the CLI is texting the landlord commands, and PowerShell is writing a formal letter — all reach the same Azure, just different styles for Lagos devs.",
      "ARM templates are like handing a building contractor in Abuja a blueprint so they raise identical shops in every city without you supervising each brick.",
      "Azure Advisor is the village elder who quietly watches your farm and tells you 'your yams need water' or 'you're spending too much on fertilizer'.",
      "Azure Policy is like the estate rules that stop anyone in your Lagos gated community from painting their house neon pink without approval.",
    ],
  },
  {
    id: "azure-security",
    label: "Azure Security",
    icon: "Shield",
    subtopics: [
      "Microsoft Entra ID (Azure AD)",
      "Role-Based Access Control (RBAC)",
      "Network Security Groups & Firewalls",
      "Azure Key Vault & Defender for Cloud",
    ],
    tips: [
      "Entra ID is the bouncer with the guest list at a Nairobi club — your username is your face, MFA is the bouncer double-checking your ID before you enter.",
      "RBAC is like a Lagos market where the treasurer can touch the money, the seller can only sell, and the customer can only buy — each role gets exactly the access it needs.",
      "Network Security Groups are the guards at each gate of a Kampala estate, checking IDs before anyone moves between buildings.",
      "Key Vault is the safe in the back of a Ghanaian shop — passwords and keys live locked away, not scribbled on sticky notes at the counter.",
    ],
  },
  {
    id: "cost-management",
    label: "Cost Management",
    icon: "Wallet",
    subtopics: [
      "Pricing Calculator & TCO Calculator",
      "Cost Analysis & Budgets",
      "Azure Reservations & Spot VMs",
      "Cost Optimization with Azure Advisor",
    ],
    tips: [
      "The Pricing Calculator is like asking three Nairobi matatu conductors the fare before you board — you know the cost before the journey, not after.",
      "Cost Analysis is your monthly bank statement in Accra: it shows exactly which subscription ate your money so you can cut what you don't use.",
      "Reservations are like paying a year of rent upfront in Lagos for a discount; Spot VMs are last-minute matatu seats — cheap, but you might get off early.",
      "Azure Advisor on cost is the friend who nudges you 'bro, that idle VM is like an empty taxi still burning fuel — shut it down.'",
    ],
  },
];

export function buildUnits(areaIds: WeakAreaId[]): StudyUnit[] {
  const units: StudyUnit[] = [];
  for (const id of areaIds) {
    const area = WEAK_AREAS.find((a) => a.id === id);
    if (!area) continue;
    area.subtopics.forEach((subtopic, i) => {
      units.push({ area: area.label, subtopic, tip: area.tips[i] ?? area.tips[0] });
    });
  }
  return units;
}
