'use client';

import { useTransition } from 'react';
import { updateTenantAction } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const INDUSTRIES = [
  { value: 'tradesman', label: 'Handwerk' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'salon', label: 'Salon' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'tourism', label: 'Tourismus' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'medical', label: 'Medizin' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'wedding', label: 'Hochzeit' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'photography', label: 'Fotografie' },
  { value: 'realestate', label: 'Immobilien' },
  { value: 'tattoo', label: 'Tattoo' },
  { value: 'ecommerce', label: 'E-Commerce' },
] as const;

export function IndustrySelect({ tenantId, currentIndustry }: { tenantId: string; currentIndustry: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newIndustry = e.target.value;
    if (newIndustry === currentIndustry) return;
    startTransition(async () => {
      await updateTenantAction(tenantId, { industry: newIndustry as typeof INDUSTRIES[number]['value'] });
      toast.success(`Branche geändert: ${INDUSTRIES.find(i => i.value === newIndustry)?.label || newIndustry}`);
      router.refresh();
    });
  }

  return (
    <select
      value={currentIndustry}
      onChange={handleChange}
      disabled={pending}
      className="text-xs sm:text-sm bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-900 focus:outline-none capitalize disabled:opacity-50 -mx-1 px-1 rounded"
    >
      {INDUSTRIES.map(i => (
        <option key={i.value} value={i.value}>{i.label}</option>
      ))}
    </select>
  );
}
