'use client';

import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionPickerModal } from '@/app/admin/components/section-picker-modal';
import type { ComposerGoalId, ExperienceFamilyId } from '@/app/admin/components/page-composer-recipes';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';

type ComposerPreviewProps = {
  industry: string;
  existingSectionTypes: string[];
  hasBooking: boolean;
  hasShop: boolean;
  initialGoal: ComposerGoalId;
  initialFamily?: ExperienceFamilyId;
};

function ComposerPreview({
  industry,
  existingSectionTypes,
  hasBooking,
  hasShop,
  initialGoal,
  initialFamily,
}: ComposerPreviewProps) {
  const [currentTypes, setCurrentTypes] = useState(existingSectionTypes);
  const sectionTypes = useMemo(
    () => getSectionTypesForIndustry(industry, { hasBooking, hasShop }),
    [hasBooking, hasShop, industry],
  );

  async function addSection(type: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setCurrentTypes((current) => current.includes(type) ? current : [...current, type]);
    return true;
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <SectionPickerModal
        sectionTypes={sectionTypes}
        existingSectionTypes={currentTypes}
        onSelect={addSection}
        onClose={() => undefined}
        industry={industry}
        styleVariant="classic"
        initialMode="guided"
        initialGoal={initialGoal}
        initialFamily={initialFamily}
      />
    </div>
  );
}

const meta = {
  title: 'Admin/Page Composer',
  component: ComposerPreview,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  args: {
    industry: 'tradesman',
    existingSectionTypes: [],
    hasBooking: true,
    hasShop: true,
    initialGoal: 'enquiries',
  },
  argTypes: {
    initialGoal: {
      control: 'select',
      options: ['enquiries', 'trust', 'sell', 'portfolio', 'bookings', 'community'],
    },
    initialFamily: {
      control: 'select',
      options: ['expertise', 'local', 'transformation', 'hospitality', 'planning', 'products'],
    },
  },
} satisfies Meta<typeof ComposerPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyPage: Story = {
  args: {
    industry: 'tradesman',
    existingSectionTypes: [],
    initialGoal: 'enquiries',
    initialFamily: 'local',
  },
};

export const PartiallyComplete: Story = {
  args: {
    industry: 'consulting',
    existingSectionTypes: ['hero', 'serviceTabs', 'proofWall'],
    initialGoal: 'trust',
    initialFamily: 'expertise',
  },
};

export const LockedCapability: Story = {
  args: {
    industry: 'hotel',
    existingSectionTypes: ['hero'],
    hasBooking: false,
    initialGoal: 'bookings',
    initialFamily: 'planning',
  },
};
