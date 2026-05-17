/**
 * Tenant provisioning: creates all necessary DB records for a new tenant.
 */
import { getDb } from './db';
import { tenants, tenantDomains, adminSecrets, globalSettings, navigation, footer, pages, pageSections, publishedSnapshots } from '@flamingo/db';
import { hashPassword } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { addDomainToRenderer, createStandaloneProject, addDomainToProject, triggerProjectDeployment } from './vercel';

export type ProvisionInput = {
  name: string;
  slug: string;
  industry: 'tradesman' | 'restaurant' | 'salon' | 'hotel' | 'tourism' | 'consulting' | 'medical' | 'fitness' | 'wedding' | 'cafe' | 'bar';
  domain?: string;
  password: string;
  companyName: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  phone?: string;
  email?: string;
  address?: string;
  deploymentMode?: 'shared' | 'standalone';
};

export type ProvisionResult = {
  tenantId: string;
  slug: string;
  domain?: string;
  domainConfigured?: boolean;
  adminUrl: string;
  rendererUrl: string;
  warning?: string;
};

type DefaultPage = {
  title: string;
  slug: string;
  sortOrder: number;
  sections: Array<{
    type: string;
    data: Record<string, unknown>;
    sortOrder?: number;
    container?: string;
    spacingTop?: string;
    spacingBottom?: string;
    anchorId?: string;
  }>;
};

type ProvisioningDefaults = {
  brand: { primaryColor: string; secondaryColor: string; accentColor: string };
  navigationItems: Array<{ label: string; href: string; type: string }>;
  navigationCta: { label: string; href: string };
  footerColumns: Array<{ title: string; items: Array<{ text: string; href?: string }> }>;
  footerCta: { label: string; href: string };
  pages: DefaultPage[];
};

export async function provisionTenant(input: ProvisionInput): Promise<ProvisionResult> {
  const db = getDb();
  const defaults = getProvisioningDefaults(input);

  // Clean up zombie tenant from a previous failed attempt (stuck in 'provisioning')
  const [existing] = await db.select().from(tenants).where(eq(tenants.slug, input.slug)).limit(1);
  if (existing) {
    if (existing.status === 'provisioning') {
      // Safe to delete — was never fully provisioned
      await db.delete(tenants).where(eq(tenants.id, existing.id));
    } else {
      throw new Error(`Ein Tenant mit dem Slug "${input.slug}" existiert bereits.`);
    }
  }

  // 1. Create tenant
  const deploymentMode = input.deploymentMode || 'shared';
  const [tenant] = await db.insert(tenants).values({
    name: input.name,
    slug: input.slug,
    industry: input.industry,
    activeStyle: 'classic',
    status: 'provisioning',
    deploymentMode,
  }).returning();

  const tenantId = tenant.id;

  // 2. Admin secret
  const passwordHash = await hashPassword(input.password);
  await db.insert(adminSecrets).values({ tenantId, passwordHash });

  // 3. Global settings
  await db.insert(globalSettings).values({
    tenantId,
    brand: {
      companyName: input.companyName,
      tagline: input.tagline || '',
      primaryColor: input.primaryColor || defaults.brand.primaryColor,
      secondaryColor: input.secondaryColor || defaults.brand.secondaryColor,
      accentColor: input.accentColor || defaults.brand.accentColor,
    },
    contact: {
      phone: input.phone || '',
      email: input.email || '',
      address: input.address || '',
    },
  });

  // 4. Default navigation
  await db.insert(navigation).values({
    tenantId,
    items: defaults.navigationItems,
    cta: defaults.navigationCta,
  });

  // 5. Default footer
  await db.insert(footer).values({
    tenantId,
    columns: defaults.footerColumns,
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: defaults.footerCta,
  });

  // 6. Default pages + sections
  for (const pageDefinition of defaults.pages) {
    const [page] = await db.insert(pages).values({
      tenantId,
      title: pageDefinition.title,
      slug: pageDefinition.slug,
      type: 'free',
      status: 'published',
      visible: true,
      sortOrder: pageDefinition.sortOrder,
    }).returning();

    await db.insert(pageSections).values(pageDefinition.sections.map((section, index) => ({
      tenantId,
      pageId: page.id,
      type: section.type,
      sortOrder: section.sortOrder ?? index,
      visible: true,
      data: section.data,
      container: section.container,
      spacingTop: section.spacingTop,
      spacingBottom: section.spacingBottom,
      anchorId: section.anchorId,
    })));
  }

  // 7. Publish initial snapshot
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId));
  const snapshot = {
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder),
    })),
    collections: [],
    generatedAt: new Date().toISOString(),
  };
  const snapshotJson = JSON.stringify(snapshot);
  const checksum = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  await db.insert(publishedSnapshots).values({
    tenantId,
    version: 1,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    isActive: true,
    createdBy: 'provisioning',
  });

  // 8. Domain provisioning
  let domainConfigured = false;
  let vercelProjectId: string | undefined;
  let standaloneError: string | undefined;

  if (deploymentMode === 'standalone') {
    // Create a dedicated Vercel project for this tenant
    try {
      const standaloneResult = await createStandaloneProject(input.slug, tenantId);
      vercelProjectId = standaloneResult.projectId;
    } catch (err) {
      standaloneError = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('Standalone project creation failed:', standaloneError);
    }

    // Store the Vercel test domain as preview
    const vercelDomain = vercelProjectId
      ? `flamingo-${input.slug}.vercel.app`
      : undefined;

    if (vercelDomain) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: vercelDomain,
        type: 'preview',
        verified: true,
      });
      domainConfigured = true;

      // Trigger initial deployment
      try {
        await triggerProjectDeployment(`flamingo-${input.slug}`);
        console.log(`  ✅ Standalone project: flamingo-${input.slug}`);
      } catch (err) {
        console.error('Standalone deployment trigger failed:', err);
      }
    }

    // Optional: add custom domain if provided
    if (input.domain && vercelProjectId) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: input.domain,
        type: 'primary',
        verified: false,
      });
      try {
        const customResult = await addDomainToProject(vercelProjectId, input.domain);
        if (customResult.verified) {
          await db.update(tenantDomains)
            .set({ verified: true })
            .where(eq(tenantDomains.domain, input.domain));
        }
      } catch (err) {
        console.error('Custom domain provisioning failed:', err);
      }
    }
  } else {
    // Shared mode: use shared renderer with slug-based routing
    // Only add custom domain if explicitly provided
    if (input.domain) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: input.domain,
        type: 'primary',
        verified: false,
      });

      try {
        const result = await addDomainToRenderer(input.domain);
        if (result.verified) {
          await db.update(tenantDomains)
            .set({ verified: true })
            .where(eq(tenantDomains.domain, input.domain));
        }
        domainConfigured = result.configured;
      } catch (err) {
        console.error('Custom domain provisioning failed:', err);
      }
    }
    domainConfigured = true;
  }

  // 9. Activate tenant
  const updateData: Record<string, unknown> = { status: 'active', updatedAt: new Date() };
  if (vercelProjectId) updateData.vercelProjectId = vercelProjectId;

  await db.update(tenants)
    .set(updateData as any)
    .where(eq(tenants.id, tenantId));

  const standaloneUrl = vercelProjectId ? `https://flamingo-${input.slug}.vercel.app` : undefined;

  const rendererBaseUrl = process.env.RENDERER_URL || 'https://flamingo-renderer.vercel.app';
  const sharedUrl = input.domain ? `https://${input.domain}` : `${rendererBaseUrl}/${input.slug}`;

  return {
    tenantId,
    slug: input.slug,
    domain: input.domain,
    domainConfigured,
    adminUrl: standaloneUrl ? `${standaloneUrl}/admin` : `${rendererBaseUrl}/${input.slug}/admin`,
    rendererUrl: standaloneUrl || sharedUrl,
    warning: standaloneError ? `Standalone-Projekt Fehler: ${standaloneError}` : undefined,
  };
}

function getProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  if (input.industry === 'medical') return getMedicalProvisioningDefaults(input);
  if (input.industry === 'salon') return getSalonProvisioningDefaults(input);
  if (input.industry === 'tourism') return getTourismProvisioningDefaults(input);
  if (input.industry === 'hotel') return getHotelProvisioningDefaults(input);
  if (input.industry === 'restaurant') return getRestaurantProvisioningDefaults(input);
  return getGenericProvisioningDefaults(input);
}

function getGenericProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];

  return {
    brand: { primaryColor: '#1a5276', secondaryColor: '#2e86c1', accentColor: '#f39c12' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Kontakt', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
    pages: [
      {
        title: 'Startseite',
        slug: 'startseite',
        sortOrder: 0,
        sections: [{
          type: 'hero',
          data: {
            headline: `Willkommen bei ${input.companyName}`,
            subline: input.tagline || 'Wir freuen uns auf Sie.',
            primaryCta: { label: 'Kontakt', href: '/kontakt' },
          },
        }],
      },
      {
        title: 'Kontakt',
        slug: 'kontakt',
        sortOrder: 1,
        sections: [{
          type: 'contact',
          data: {
            headline: 'Kontakt aufnehmen',
            formEnabled: true,
          },
        }],
      },
    ] satisfies DefaultPage[],
  };
}

function getMedicalProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const company = input.companyName;
  const phone = input.phone || '+49 221 123456';
  const email = input.email || 'praxis@example.de';
  const address = input.address || 'Parkallee 12, 50667 Koeln';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  return {
    brand: { primaryColor: '#0f4c5c', secondaryColor: '#66a6ad', accentColor: '#2f80ed' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Leistungen', href: '/leistungen', type: 'link' },
      { label: 'Team', href: '/team', type: 'link' },
      { label: 'Patienteninfo', href: '/patienteninfo', type: 'link' },
      { label: 'Termine', href: '/termine', type: 'link' },
      { label: 'Praxis', href: '/praxis', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Termin buchen', href: '/termine' },
    footerColumns: [
      { title: 'Kontakt', items: [{ text: phone, href: phoneHref }, { text: email, href: `mailto:${email}` }, { text: address }] },
      { title: 'Praxis', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Team', href: '/team' }, { text: 'Patienteninfo', href: '/patienteninfo' }] },
      { title: 'Termine', items: [{ text: 'Termin buchen', href: '/termine' }, { text: 'Sprechzeiten', href: '/termine' }, { text: 'Notfallhinweise', href: '/termine' }] },
    ],
    footerCta: { label: 'Termin buchen', href: '/termine' },
    pages: getMedicalPages(company, input.tagline, phone, email, address, phoneHref),
  };
}

function getMedicalPages(company: string, tagline: string | undefined, phone: string, email: string, address: string, phoneHref: string): DefaultPage[] {
  return [
    { title: 'Startseite', slug: 'startseite', sortOrder: 0, sections: [medicalHeroData(company, tagline), medicalServicesData(), medicalDoctorTeamData(), medicalAppointmentData(phoneHref), medicalPatientInfoData(), medicalOpeningHoursData(), medicalContactData(phone, email, address, phoneHref)] },
    { title: 'Leistungen', slug: 'leistungen', sortOrder: 1, sections: [medicalHeroSimple('Leistungen', 'Untersuchungen, Vorsorge und Betreuung im Ueberblick.', 'Versorgung'), medicalServicesData(), medicalTreatmentData(), medicalDiagnosticsData(), medicalFaqData()] },
    { title: 'Team', slug: 'team', sortOrder: 2, sections: [medicalHeroSimple('Team', 'Aerztinnen, Aerzte und Praxisteam mit festen Ansprechpartnern.', 'Team'), medicalDoctorTeamData(), medicalPracticeTeamData(), medicalCertificationsData()] },
    { title: 'Patienteninfo', slug: 'patienteninfo', sortOrder: 3, sections: [medicalHeroSimple('Patienteninfo', 'Vorbereitung, Formulare und Hinweise fuer Ihren Termin.', 'Info'), medicalPatientInfoData(), medicalInsuranceData(), medicalDownloadsData(), medicalFaqData()] },
    { title: 'Termine', slug: 'termine', sortOrder: 4, sections: [medicalHeroSimple('Termin vereinbaren', 'Online, telefonisch oder per Rueckruf.', 'Termin'), medicalAppointmentData(phoneHref), medicalOpeningHoursData(), medicalEmergencyData(), medicalContactData(phone, email, address, phoneHref)] },
    { title: 'Praxis', slug: 'praxis', sortOrder: 5, sections: [medicalHeroSimple('Praxis', 'Raeume, Ausstattung und Haltung unserer Versorgung.', 'Praxis'), medicalGalleryData(), medicalEquipmentData(), medicalValuesData(), medicalContactData(phone, email, address, phoneHref)] },
    { title: 'Kontakt', slug: 'kontakt', sortOrder: 6, sections: [medicalContactData(phone, email, address, phoneHref), medicalOpeningHoursData(), medicalEmergencyData(), medicalFaqData()] },
  ];
}

function medicalHeroData(company: string, tagline: string | undefined) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline: company, subline: tagline || 'Hausarztmedizin, Diagnostik und Praevention mit klarer Terminstruktur.', badgeText: 'Praxis', bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85', specialtyLabel: 'Allgemeinmedizin', emergencyHint: 'Akutsprechstunde taeglich 8:00-9:00', trustItems: ['Online-Termine', 'Kassen & Privat', 'Barrierearme Praxis'], primaryCta: { label: 'Termin buchen', href: '/termine' }, emergencyCta: { label: 'Akutfall', href: '/termine' }, secondaryCta: { label: 'Leistungen', href: '/leistungen' } } };
}
function medicalHeroSimple(headline: string, subline: string, badgeText: string) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline, subline, badgeText, bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85', specialtyLabel: 'Praxis', emergencyHint: 'Bei akuten Beschwerden bitte morgens melden', trustItems: ['Online-Termine', 'Persoenliche Betreuung'], primaryCta: { label: 'Termin buchen', href: '/termine' }, emergencyCta: { label: 'Akutfall', href: '/termine' }, secondaryCta: { label: 'Kontakt', href: '/kontakt' } } };
}
function medicalServicesData() {
  return { type: 'serviceOverview', data: { headline: 'Leistungen', subline: 'Medizinische Versorgung fuer Alltag, Vorsorge und akute Beschwerden.', badgeText: 'Versorgung', items: [{ title: 'Hausarztmedizin', text: 'Akute Beschwerden, Verlaufskontrollen und langfristige Betreuung.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=80', icon: 'stethoscope', category: 'Allgemein', cta: { label: 'Mehr erfahren', href: '/leistungen' } }, { title: 'Praevention', text: 'Check-ups, Impfberatung und individuelle Vorsorge.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80', icon: 'shield-check', category: 'Vorsorge', cta: { label: 'Termin buchen', href: '/termine' } }], ctaPrimary: { label: 'Termin vereinbaren', href: '/termine' } } };
}
function medicalTreatmentData() {
  return { type: 'treatmentDetail', data: { headline: 'Behandlungsdetails', subline: 'Ablauf, Voraussetzungen und Hinweise vor dem Termin.', badgeText: 'Ablauf', treatments: [{ title: 'Gesundheits-Check-up', text: 'Strukturierte Vorsorge mit Labor, Anamnese und persoenlicher Besprechung.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80', durationLabel: 'ca. 45 Minuten', requirementLabel: 'nuechtern nach Absprache', noticeText: 'Bitte Versicherungskarte und Medikamentenplan mitbringen.', steps: ['Anamnese', 'Untersuchung', 'Labor', 'Besprechung'], cta: { label: 'Check-up buchen', href: '/termine' } }] } };
}
function medicalDiagnosticsData() {
  return { type: 'diagnostics', data: { headline: 'Diagnostik', subline: 'Schnelle Untersuchungen direkt in der Praxis.', badgeText: 'Diagnostik', items: [{ title: 'EKG & Belastungs-EKG', text: 'Herz-Kreislauf-Diagnostik bei Beschwerden, Vorsorge oder Verlaufskontrollen.', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&q=80', benefitLabel: 'direkt vor Ort', methodLabel: 'EKG', cta: { label: 'Anfragen', href: '/termine' } }] } };
}
function medicalDoctorTeamData() {
  return { type: 'doctorTeam', data: { headline: 'Aerzteteam', subline: 'Fachaerztliche Betreuung mit festen Ansprechpartnern.', badgeText: 'Team', doctors: [{ name: 'Dr. Lena Hoffmann', title: 'Fachaerztin fuer Allgemeinmedizin', specialty: 'Praevention & Innere Medizin', bio: 'Betreut Patientinnen und Patienten mit Schwerpunkt Vorsorge, Diabetes und Herz-Kreislauf.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80', languages: ['Deutsch', 'Englisch'], appointmentCta: { label: 'Termin bei Dr. Hoffmann', href: '/termine' } }] } };
}
function medicalPracticeTeamData() {
  return { type: 'practiceTeam', data: { headline: 'Praxisteam', subline: 'Organisation, Diagnostik und Empfang arbeiten eng zusammen.', badgeText: 'Praxis', members: [{ name: 'Mara Schmitz', role: 'Praxismanagerin', bio: 'Koordiniert Termine, Rueckrufe und Befundkommunikation.', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=900&q=80' }] } };
}
function medicalCertificationsData() {
  return { type: 'certifications', data: { headline: 'Qualifikationen', subline: 'Standards, Fortbildungen und Mitgliedschaften.', badgeText: 'Qualitaet', items: [{ icon: 'shield-check', title: 'DMP Diabetes', text: 'Strukturierte Versorgung und regelmaessige Verlaufskontrollen.', metaLabel: 'Zertifiziert' }, { icon: 'graduation-cap', title: 'Regelmaessige Fortbildung', text: 'Aktuelle Leitlinien und qualifizierte Versorgung.', metaLabel: 'Fortbildung' }] } };
}
function medicalPatientInfoData() {
  return { type: 'patientInfo', data: { headline: 'Patienteninfo', subline: 'Gut vorbereitet zum Termin.', badgeText: 'Vorbereitung', introText: 'Viele Anliegen lassen sich schneller klaeren, wenn die wichtigsten Unterlagen bereitliegen.', cards: [{ icon: 'clipboard-list', title: 'Bitte mitbringen', text: 'Unterlagen fuer den ersten Besuch.', items: ['Versicherungskarte', 'Medikamentenplan', 'Vorbefunde'] }, { icon: 'clock', title: 'Terminablauf', text: 'Bitte planen Sie etwas Vorlauf fuer Anmeldung und Unterlagen ein.', items: ['10 Minuten frueher da sein', 'Akute Anliegen anmelden'] }] } };
}
function medicalInsuranceData() {
  return { type: 'insuranceInfo', data: { headline: 'Kassen & Privat', subline: 'Transparente Hinweise zu Abrechnung und Leistungen.', badgeText: 'Versicherung', items: [{ title: 'Gesetzlich versichert', text: 'Hausarztmedizin und medizinisch notwendige Diagnostik nach Kassenleistung.', image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=900&q=80', typeLabel: 'GKV', notice: 'Individuelle Gesundheitsleistungen werden vorher besprochen.', cta: { label: 'Frage stellen', href: '/kontakt' } }] } };
}
function medicalDownloadsData() {
  return { type: 'downloadForms', data: { headline: 'Downloads', subline: 'Formulare und Informationen vor dem Termin.', badgeText: 'Formulare', items: [{ title: 'Anamnesebogen', text: 'Vor dem Ersttermin ausfuellen und mitbringen.', fileLabel: 'PDF', fileHref: '/downloads/anamnese.pdf', metaLabel: 'Erstbesuch' }] } };
}
function medicalAppointmentData(phoneHref: string) {
  return { type: 'appointmentCta', data: { headline: 'Termin vereinbaren', subline: 'Online, telefonisch oder per Rueckruf.', badgeText: 'Termin', introText: 'Bitte waehlen Sie je nach Anliegen Terminart und Dringlichkeit.', onlineCta: { label: 'Online buchen', href: '/termine' }, phoneCta: { label: 'Anrufen', href: phoneHref }, callbackCta: { label: 'Rueckruf anfragen', href: '/kontakt' }, externalCta: { label: 'Videosprechstunde', href: '/termine' }, notes: ['Akute Beschwerden morgens anmelden', 'Befunde bitte vorab senden'] } };
}
function medicalOpeningHoursData() {
  return { type: 'openingHours', data: { headline: 'Sprechzeiten', subline: 'Regulaere Termine und Akutsprechstunde.', badgeText: 'Zeiten', days: [{ label: 'Mo-Fr', hours: '08:00-13:00', note: 'Sprechstunde' }, { label: 'Mo, Di, Do', hours: '15:00-18:00', note: 'Termine' }], acuteCareText: 'Akutsprechstunde taeglich 8:00-9:00 nach telefonischer Anmeldung.', holidayNote: 'Urlaubsvertretung wird auf der Startseite bekannt gegeben.', ctaPrimary: { label: 'Termin buchen', href: '/termine' } } };
}
function medicalEmergencyData() {
  return { type: 'emergencyInfo', data: { headline: 'Notfallhinweise', subline: 'Wohin Sie sich ausserhalb der Sprechzeiten wenden koennen.', badgeText: 'Akut', introText: 'Bei lebensbedrohlichen Symptomen bitte sofort den Notruf waehlen.', items: [{ title: 'Lebensbedrohlicher Notfall', text: 'Bei Atemnot, Brustschmerz oder Bewusstlosigkeit.', phoneLabel: '112', phoneHref: 'tel:112' }, { title: 'Aerztlicher Bereitschaftsdienst', text: 'Ausserhalb unserer Sprechzeiten.', phoneLabel: '116117', phoneHref: 'tel:116117' }], ctaPrimary: { label: 'Sprechzeiten ansehen', href: '/termine' } } };
}
function medicalGalleryData() {
  return { type: 'practiceGallery', data: { headline: 'Praxis-Galerie', subline: 'Einblicke in Empfang, Wartebereich und Behandlung.', badgeText: 'Praxis', images: [{ src: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80', alt: 'Praxisempfang', caption: 'Empfang', category: 'Ankommen' }, { src: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f1e4?w=900&q=80', alt: 'Behandlungszimmer', caption: 'Behandlung', category: 'Praxis' }] } };
}
function medicalEquipmentData() {
  return { type: 'equipmentHighlights', data: { headline: 'Ausstattung', subline: 'Moderne Diagnostik fuer schnelle Entscheidungen.', badgeText: 'Technik', items: [{ title: 'Ultraschall', text: 'Abklaerung direkt in der Praxis.', image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=900&q=80', category: 'Diagnostik', benefitLabel: 'schnell verfuegbar', cta: { label: 'Termin anfragen', href: '/termine' } }] } };
}
function medicalValuesData() {
  return { type: 'valuesGrid', data: { headline: 'Praxiswerte', subline: 'Medizin, die erklaert und begleitet.', badgeText: 'Haltung', items: [{ icon: 'heart-pulse', title: 'Verstaendlich', text: 'Befunde und Optionen werden klar erklaert.' }, { icon: 'clock', title: 'Planbar', text: 'Terminarten und Rueckrufe sind strukturiert.' }] } };
}
function medicalContactData(phone: string, email: string, address: string, phoneHref: string) {
  return { type: 'locationContact', data: { headline: 'Kontakt & Anfahrt', subline: 'Ihre Praxis in zentraler Lage.', badgeText: 'Kontakt', introText: 'Fuer Termine, Rezepte und Befundfragen erreichen Sie uns telefonisch oder per Formular.', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=900&q=80', mapEmbedUrl: '', formEnabled: true, namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', messagePlaceholder: 'Nachricht', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'phone', label: 'Telefon', value: phone }, { icon: 'mail', label: 'E-Mail', value: email }, { icon: 'map-pin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: phoneHref }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } } };
}
function medicalFaqData() {
  return { type: 'faq', data: { headline: 'FAQ', subline: 'Haeufige Fragen vor dem Praxisbesuch.', badgeText: 'Fragen', items: [{ question: 'Kann ich Rezepte online anfragen?', answer: 'Wiederholungsrezepte koennen nach vorheriger Behandlung ueber das Kontaktformular angefragt werden.' }, { question: 'Was mache ich bei akuten Beschwerden?', answer: 'Bitte melden Sie sich morgens telefonisch, damit wir die Dringlichkeit einschaetzen koennen.' }], ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' } } };
}

function getSalonProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const company = input.companyName;
  const phone = input.phone || '+49 221 123456';
  const email = input.email || 'hello@example-salon.de';
  const address = input.address || 'Rosenstrasse 8, 50667 Koeln';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  return {
    brand: { primaryColor: '#7a2c55', secondaryColor: '#e7a5c4', accentColor: '#c2185b' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Leistungen', href: '/leistungen', type: 'link' },
      { label: 'Preise', href: '/preise', type: 'link' },
      { label: 'Team', href: '/team', type: 'link' },
      { label: 'Galerie', href: '/galerie', type: 'link' },
      { label: 'Buchung', href: '/buchung', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Termin buchen', href: '/buchung' },
    footerColumns: [
      { title: 'Kontakt', items: [{ text: phone, href: phoneHref }, { text: email, href: `mailto:${email}` }, { text: address }] },
      { title: 'Salon', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Preise', href: '/preise' }, { text: 'Team', href: '/team' }] },
      { title: 'Buchung', items: [{ text: 'Online buchen', href: '/buchung' }, { text: 'Gutscheine', href: '/preise' }, { text: 'Galerie', href: '/galerie' }] },
    ],
    footerCta: { label: 'Termin buchen', href: '/buchung' },
    pages: getSalonPages(company, input.tagline, phone, email, address, phoneHref),
  };
}

function getSalonPages(company: string, tagline: string | undefined, phone: string, email: string, address: string, phoneHref: string): DefaultPage[] {
  return [
    { title: 'Startseite', slug: 'startseite', sortOrder: 0, sections: [salonHeroData(company, tagline), salonServicesData(), salonPriceData(), salonTeamData(), salonGalleryData(), salonTestimonialsData(), salonBookingData(phoneHref)] },
    { title: 'Leistungen', slug: 'leistungen', sortOrder: 1, sections: [salonHeroSimple('Leistungen', 'Services fuer Haar, Beauty und Pflege.', 'Services'), salonServicesData(), salonTreatmentData(), salonBeforeAfterData(), salonFaqData()] },
    { title: 'Preise', slug: 'preise', sortOrder: 2, sections: [salonHeroSimple('Preise', 'Transparente Orientierung fuer deine Terminplanung.', 'Preise'), salonPriceData(), salonPackagesData(), salonBookingData(phoneHref)] },
    { title: 'Team', slug: 'team', sortOrder: 3, sections: [salonHeroSimple('Team', 'Spezialistinnen fuer Cut, Color und Pflege.', 'Team'), salonTeamData(), salonExpertiseData(), salonTestimonialsData()] },
    { title: 'Galerie', slug: 'galerie', sortOrder: 4, sections: [salonHeroSimple('Galerie', 'Looks, Studio und Transformationen.', 'Einblicke'), salonGalleryData(), salonBeforeAfterData(), salonBookingData(phoneHref)] },
    { title: 'Buchung', slug: 'buchung', sortOrder: 5, sections: [salonHeroSimple('Termin buchen', 'Online, telefonisch oder per WhatsApp.', 'Buchung'), salonBookingData(phoneHref), salonOpeningHoursData(), salonContactData(phone, email, address, phoneHref), salonFaqData()] },
    { title: 'Kontakt', slug: 'kontakt', sortOrder: 6, sections: [salonContactData(phone, email, address, phoneHref), salonOpeningHoursData(), salonFaqData()] },
  ];
}

function salonHeroData(company: string, tagline: string | undefined) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline: company, subline: tagline || 'Haare, Beauty und Treatments in ruhiger Studio-Atmosphaere.', badgeText: 'Salon', bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85', trustItems: ['Online buchbar', 'Farbexpertise', '4.9 Sterne'], primaryCta: { label: 'Termin buchen', href: '/buchung' }, secondaryCta: { label: 'Preise ansehen', href: '/preise' }, bookingHint: 'Neue Termine diese Woche', ratingText: '4.9 / 5 Google' } };
}
function salonHeroSimple(headline: string, subline: string, badgeText: string) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline, subline, badgeText, bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85', trustItems: ['Beratung inklusive', 'Online buchbar'], primaryCta: { label: 'Termin buchen', href: '/buchung' }, secondaryCta: { label: 'Kontakt', href: '/kontakt' }, bookingHint: 'Termine nach Verfuegbarkeit', ratingText: '4.9 / 5' } };
}
function salonServicesData() {
  return { type: 'serviceMenu', data: { headline: 'Leistungen', subline: 'Services fuer Haar, Beauty und kleine Auszeiten.', badgeText: 'Services', categories: [{ title: 'Hair', text: 'Cut, Styling und Farbe.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Haare', services: ['Cut', 'Color', 'Glossing'], cta: { label: 'Buchen', href: '/buchung' } }], ctaPrimary: { label: 'Alle Services', href: '/leistungen' } } };
}
function salonPriceData() {
  return { type: 'priceList', data: { headline: 'Preise', subline: 'Transparente Orientierung fuer die Terminplanung.', badgeText: 'Preisliste', categories: [{ title: 'Hair', text: 'Beratung inklusive.', items: [{ name: 'Cut & Styling', description: 'Waschen, Schnitt, Foehnen.', durationLabel: '60 Min.', priceLabel: 'ab 69', note: 'nach Laenge', cta: { label: 'Termin', href: '/buchung' } }] }], footnote: 'Alle Preise sind ab-Preise und werden im Termin final besprochen.', ctaPrimary: { label: 'Termin buchen', href: '/buchung' } } };
}
function salonTreatmentData() {
  return { type: 'treatmentDetail', data: { headline: 'Treatments', subline: 'Details zu Ablauf, Ergebnis und Pflege.', badgeText: 'Behandlungen', treatments: [{ title: 'Glossing Ritual', text: 'Mehr Glanz und frische Nuance.', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', resultLabel: 'Glanz', durationLabel: '45 Min.', priceLabel: 'ab 49', steps: ['Beratung', 'Glossing', 'Pflege'], careTips: ['Sulfatarmes Shampoo'], cta: { label: 'Anfragen', href: '/buchung' } }] } };
}
function salonPackagesData() {
  return { type: 'packages', data: { headline: 'Pakete & Specials', subline: 'Kombinationen, Gutscheine und Saison-Angebote.', badgeText: 'Specials', packages: [{ title: 'Fresh Start', text: 'Cut, Pflege und Styling.', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80', priceLabel: 'ab 119', validUntilLabel: 'bis September', includes: ['Cut', 'Treatment', 'Styling'], cta: { label: 'Buchen', href: '/buchung' } }], ctaPrimary: { label: 'Special sichern', href: '/buchung' } } };
}
function salonTeamData() {
  return { type: 'teamShowcase', data: { headline: 'Team', subline: 'Spezialistinnen fuer Cut, Color und Pflege.', badgeText: 'Menschen', members: [{ name: 'Mara', role: 'Color Specialist', bio: 'Balayage, Glossing und weiche Farbverlaeufe.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80', specialties: ['Balayage', 'Glossing'], bookingCta: { label: 'Bei Mara buchen', href: '/buchung' } }] } };
}
function salonExpertiseData() {
  return { type: 'expertiseGrid', data: { headline: 'Expertise', subline: 'Methoden, Marken und Spezialisierungen.', badgeText: 'Skills', items: [{ icon: 'sparkles', title: 'Balayage', text: 'Natuerliche Farbverlaeufe mit Beratung.', metaLabel: 'Color' }, { icon: 'leaf', title: 'Pflege', text: 'Rituale fuer Haar und Kopfhaut.', metaLabel: 'Care' }] } };
}
function salonBeforeAfterData() {
  return { type: 'beforeAfter', data: { headline: 'Vorher & Nachher', subline: 'Transformationen aus dem Studio.', badgeText: 'Looks', items: [{ title: 'Soft Blonde', text: 'Sanfte Aufhellung mit Glossing.', beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80', category: 'Color', caption: 'Ergebnis nach 2.5 Stunden', cta: { label: 'Aehnlichen Look buchen', href: '/buchung' } }] } };
}
function salonGalleryData() {
  return { type: 'gallery', data: { headline: 'Galerie', subline: 'Salon, Looks und Details.', badgeText: 'Einblicke', images: [{ src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', alt: 'Salon', caption: 'Studio', category: 'Salon' }, { src: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&q=80', alt: 'Styling', caption: 'Styling', category: 'Hair' }] } };
}
function salonTestimonialsData() {
  return { type: 'testimonials', data: { headline: 'Bewertungen', subline: 'Stimmen unserer Kundinnen und Kunden.', badgeText: 'Feedback', ratingValue: '4.9 von 5', ratingCount: '184 Bewertungen', items: [{ quote: 'Sehr ruhige Beratung und genau die Farbe, die ich wollte.', name: 'Lena K.', context: 'Balayage', rating: 5, sourceLabel: 'Google' }], ctaPrimary: { label: 'Termin buchen', href: '/buchung' } } };
}
function salonOpeningHoursData() {
  return { type: 'openingHours', data: { headline: 'Oeffnungszeiten', subline: 'Termine nach Verfuegbarkeit.', badgeText: 'Zeiten', days: [{ label: 'Di-Fr', hours: '10:00-19:00', note: 'Termine' }, { label: 'Sa', hours: '09:00-15:00', note: 'nach Buchung' }], bookingNote: 'Online-Termine sind jederzeit moeglich.', ctaPrimary: { label: 'Buchen', href: '/buchung' } } };
}
function salonBookingData(phoneHref: string) {
  return { type: 'bookingCta', data: { headline: 'Termin buchen', subline: 'Online, telefonisch oder per WhatsApp.', badgeText: 'Buchung', introText: 'Wir bestaetigen Anfragen persoenlich und planen genug Zeit fuer Beratung ein.', onlineCta: { label: 'Online buchen', href: '/buchung' }, phoneCta: { label: 'Anrufen', href: phoneHref }, whatsappCta: { label: 'WhatsApp', href: 'https://wa.me/49221123456' }, notes: ['Bitte 24h vorher absagen', 'Color-Termine mit Beratung'] } };
}
function salonContactData(phone: string, email: string, address: string, phoneHref: string) {
  return { type: 'locationContact', data: { headline: 'Kontakt & Standort', subline: 'Dein Salon vor Ort.', badgeText: 'Kontakt', introText: 'Fragen zu Leistungen, Gutscheinen oder Terminen beantworten wir persoenlich.', image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=900&q=80', mapEmbedUrl: '', formEnabled: true, namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', messagePlaceholder: 'Nachricht', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'phone', label: 'Telefon', value: phone }, { icon: 'mail', label: 'E-Mail', value: email }, { icon: 'map-pin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: phoneHref }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } } };
}
function salonFaqData() {
  return { type: 'faq', data: { headline: 'FAQ', subline: 'Haeufige Fragen vor dem Termin.', badgeText: 'Fragen', items: [{ question: 'Wie lange dauert eine Farbberatung?', answer: 'Plane je nach Wunsch 15 bis 30 Minuten ein.' }], ctaPrimary: { label: 'Frage stellen', href: '/kontakt' } } };
}

function getTourismProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const company = input.companyName;
  const phone = input.phone || '+49 221 123456';
  const email = input.email || 'info@example-tourismus.de';
  const address = input.address || 'Marktplatz 1, 50667 Koeln';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  return {
    brand: { primaryColor: '#2f6f4e', secondaryColor: '#79a85a', accentColor: '#f3b43f' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
      { label: 'Orte', href: '/orte', type: 'link' },
      { label: 'Veranstaltungen', href: '/veranstaltungen', type: 'link' },
      { label: 'Unterkuenfte', href: '/unterkuenfte', type: 'link' },
      { label: 'Planung', href: '/planung', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Besuch planen', href: '/planung' },
    footerColumns: [
      { title: 'Kontakt', items: [{ text: phone, href: phoneHref }, { text: email, href: `mailto:${email}` }, { text: address }] },
      { title: 'Entdecken', items: [{ text: 'Erlebnisse', href: '/erlebnisse' }, { text: 'Orte', href: '/orte' }, { text: 'Veranstaltungen', href: '/veranstaltungen' }] },
      { title: 'Planung', items: [{ text: 'Unterkuenfte', href: '/unterkuenfte' }, { text: 'Anreise', href: '/planung' }, { text: 'Broschueren', href: '/planung' }] },
    ],
    footerCta: { label: 'Infomaterial anfragen', href: '/kontakt' },
    pages: getTourismPages(company, input.tagline, phone, email, address, phoneHref),
  };
}

function getTourismPages(company: string, tagline: string | undefined, phone: string, email: string, address: string, phoneHref: string): DefaultPage[] {
  return [
    {
      title: 'Startseite',
      slug: 'startseite',
      sortOrder: 0,
      sections: [
        tourismHeroData(company, tagline),
        tourismHighlightsData(),
        tourismExperiencesData(),
        tourismSeasonData(),
        tourismEventsData(),
        tourismContactData(phone, email, address, phoneHref),
      ],
    },
    { title: 'Erlebnisse', slug: 'erlebnisse', sortOrder: 1, sections: [tourismHeroSimple('Erlebnisse', 'Aktivitaeten, Touren und Programme fuer Gaeste.', 'Erleben'), tourismExperiencesData(), tourismRoutesData(), tourismFaqData()] },
    { title: 'Orte', slug: 'orte', sortOrder: 2, sections: [tourismHeroSimple('Orte & Sehenswuerdigkeiten', 'Aussichtspunkte, Kulturorte und kleine Entdeckungen.', 'Orte'), tourismPlacesData(), tourismSightsData(), tourismGalleryData()] },
    { title: 'Veranstaltungen', slug: 'veranstaltungen', sortOrder: 3, sections: [tourismHeroSimple('Veranstaltungen', 'Termine, Festivals und saisonale Hoehepunkte.', 'Kalender'), tourismEventsData(), tourismSeasonData()] },
    { title: 'Unterkuenfte', slug: 'unterkuenfte', sortOrder: 4, sections: [tourismHeroSimple('Unterkuenfte', 'Gastgeber fuer Wochenende, Urlaub und Gruppen.', 'Bleiben'), tourismAccommodationData(), tourismContactData(phone, email, address, phoneHref)] },
    { title: 'Planung', slug: 'planung', sortOrder: 5, sections: [tourismHeroSimple('Besuch planen', 'Anreise, Downloads und Informationen fuer Ihren Aufenthalt.', 'Planung'), tourismVisitorInfoData(), tourismDownloadsData(), tourismFaqData()] },
    { title: 'Kontakt', slug: 'kontakt', sortOrder: 6, sections: [tourismContactData(phone, email, address, phoneHref), tourismPlacesData()] },
  ];
}

function tourismHeroData(company: string, tagline: string | undefined) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline: company, subline: tagline || 'Wandern, Wasser, Kultur und kleine Orte mit grossem Ausblick.', badgeText: 'Tourismus', bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85', locationLabel: 'DACH-Region', seasonLabel: 'Ganzjaehrig entdecken', trustItems: ['Familienfreundlich', 'Routen & Touren', 'Events jede Saison'], primaryCta: { label: 'Erlebnisse ansehen', href: '/erlebnisse' }, secondaryCta: { label: 'Besuch planen', href: '/planung' } } };
}

function tourismHeroSimple(headline: string, subline: string, badgeText: string) {
  return { type: 'hero', container: 'full', spacingTop: 'none', spacingBottom: 'none', data: { headline, subline, badgeText, bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85', locationLabel: 'Naturregion Silbersee', seasonLabel: 'Ganzjaehrig', trustItems: ['Persoenlich beraten', 'Regionale Tipps'], primaryCta: { label: 'Kontakt', href: '/kontakt' }, secondaryCta: { label: 'Planung', href: '/planung' } } };
}

function tourismHighlightsData() {
  return { type: 'destinationHighlights', data: { headline: 'Highlights der Region', subline: 'Orte, die den Charakter der Destination zeigen.', badgeText: 'Entdecken', items: [{ title: 'Silbersee-Ufer', text: 'Promenade, Badestellen und Sonnenuntergaenge am Wasser.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', category: 'Natur', cta: { label: 'Mehr erfahren', href: '/orte' } }, { title: 'Altstadtbogen', text: 'Gassen, kleine Laeden und regionale Gastronomie.', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80', category: 'Kultur', cta: { label: 'Route ansehen', href: '/orte' } }, { title: 'Panoramaweg', text: 'Leichte Hoehenroute mit Blick auf See und Tal.', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80', category: 'Aktiv', cta: { label: 'Tour planen', href: '/erlebnisse' } }], ctaPrimary: { label: 'Alle Highlights', href: '/orte' } } };
}

function tourismExperiencesData() {
  return { type: 'experienceGrid', data: { headline: 'Erlebnisse & Aktivitaeten', subline: 'Von kurzen Familienausfluegen bis zu gefuehrten Tagesprogrammen.', badgeText: 'Erleben', items: [{ title: 'Gefuehrte Seerunde', text: 'Leichte Tour mit Naturguide, Aussichtspunkten und Picknickplatz.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80', durationLabel: '3 Stunden', audienceLabel: 'Familien', difficultyLabel: 'leicht', priceLabel: 'ab 18', cta: { label: 'Anfragen', href: '/kontakt' } }, { title: 'Kulturabend im Kurpark', text: 'Open-Air-Musik, regionale Kueche und lokale Produzenten.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', durationLabel: 'Abend', audienceLabel: 'Alle', difficultyLabel: 'barrierearm', priceLabel: 'frei', cta: { label: 'Termine', href: '/veranstaltungen' } }], ctaPrimary: { label: 'Alle Erlebnisse', href: '/erlebnisse' } } };
}

function tourismSeasonData() {
  return { type: 'seasonTeaser', data: { headline: 'Jede Saison ein anderer Blick', subline: 'Inhalte fuer Kampagnen, Saisonseiten und aktuelle Angebote.', badgeText: 'Saison', seasons: [{ title: 'Fruehling', text: 'Bluetenwege und erste Terrassen.', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80', periodLabel: 'Maerz-Mai', cta: { label: 'Tipps', href: '/planung' } }, { title: 'Sommer', text: 'See, Rad und lange Abende.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', periodLabel: 'Juni-August', cta: { label: 'Sommer planen', href: '/planung' } }] } };
}

function tourismEventsData() {
  return { type: 'eventsCalendar', data: { headline: 'Veranstaltungen', subline: 'Aktuelle Termine fuer Gaeste und Einheimische.', badgeText: 'Kalender', events: [{ title: 'See in Flammen', text: 'Sommerabend mit Musik, Food-Staenden und Lichtshow.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', dateLabel: '18. Juli', timeLabel: '18:00', locationLabel: 'Uferpark', category: 'Festival', priceLabel: 'frei', cta: { label: 'Details', href: '/veranstaltungen' } }], fallbackText: 'Neue Termine folgen in Kuerze.' } };
}

function tourismPlacesData() {
  return { type: 'placesMap', data: { headline: 'Orte & Karte', subline: 'Sehenswerte Punkte fuer Tagesgaeste und Urlauber.', badgeText: 'Orientierung', mapEmbedUrl: '', mapFallbackText: 'Karten-Embed im CMS hinterlegen', places: [{ title: 'Aussichtspunkt Nordhang', text: 'Kurzer Weg, weiter Blick, perfekt zum Sonnenaufgang.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', distanceLabel: '4.2 km', address: 'Nordhangweg', cta: { label: 'Route', href: '/planung' } }], ctaPrimary: { label: 'Besuch planen', href: '/planung' } } };
}

function tourismSightsData() {
  return { type: 'sightseeingList', data: { headline: 'Sehenswuerdigkeiten', subline: 'Kultur, Aussicht und kleine Entdeckungen.', badgeText: 'Orte', items: [{ title: 'Heimatmuseum', text: 'Regionale Geschichte in einem alten Speicherhaus.', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80', openingText: 'Mi-So', category: 'Museum', cta: { label: 'Info', href: '/kontakt' } }] } };
}

function tourismRoutesData() {
  return { type: 'tourRoutes', data: { headline: 'Routen & Touren', subline: 'Ausgearbeitete Wege fuer verschiedene Ansprueche.', badgeText: 'Unterwegs', routes: [{ title: 'Panoramaweg Silbersee', text: 'Rundtour mit Aussicht, Waldstuecken und Einkehrmoeglichkeit.', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80', lengthLabel: '12 km', durationLabel: '3.5 h', difficultyLabel: 'mittel', startLabel: 'Kurpark', highlights: ['Seeufer', 'Aussicht', 'Wald'], cta: { label: 'Route ansehen', href: '/erlebnisse' } }], ctaPrimary: { label: 'Alle Routen', href: '/erlebnisse' } } };
}

function tourismAccommodationData() {
  return { type: 'accommodationGrid', data: { headline: 'Unterkuenfte', subline: 'Gastgeber fuer Wochenenden, Familienurlaub und Gruppen.', badgeText: 'Bleiben', items: [{ title: 'Seehaus Pension', text: 'Kleine Pension nahe Uferpromenade.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', typeLabel: 'Pension', priceLabel: 'ab 89', amenities: ['Fruehstueck', 'Fahrradraum'], cta: { label: 'Anfragen', href: '/kontakt' } }] } };
}

function tourismVisitorInfoData() {
  return { type: 'visitorInfo', data: { headline: 'Besuch planen', subline: 'Alles Wichtige fuer Anreise und Aufenthalt.', badgeText: 'Info', introText: 'Diese Inhalte sind komplett ueber das CMS pflegbar.', blocks: [{ icon: 'train', title: 'Anreise', text: 'Bahnhof und Buslinien verbinden die Region.', items: ['Bahnhof 8 Min.', 'Parkplatz P1', 'Radverleih'] }, { icon: 'accessibility', title: 'Barrierefreiheit', text: 'Viele Angebote sind stufenarm erreichbar.', items: ['Promenade', 'Tourismusbuero', 'WC'] }] } };
}

function tourismDownloadsData() {
  return { type: 'downloadGuides', data: { headline: 'Karten & Broschueren', subline: 'Digitale Guides und Materialien.', badgeText: 'Downloads', items: [{ title: 'Freizeitkarte', text: 'Routen, Orte und Gastgeber im Ueberblick.', fileLabel: 'PDF herunterladen', fileHref: '#', metaLabel: 'PDF' }] } };
}

function tourismGalleryData() {
  return { type: 'gallery', data: { headline: 'Galerie', subline: 'Bilder fuer Stimmung und Orientierung.', badgeText: 'Einblicke', images: [{ src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80', alt: 'Landschaft', caption: 'Weite Landschaft', category: 'Natur' }, { src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80', alt: 'Ort', caption: 'Historischer Ortskern', category: 'Kultur' }] } };
}

function tourismFaqData() {
  return { type: 'faq', data: { headline: 'Haeufige Fragen', subline: 'Antworten fuer die Reiseplanung.', badgeText: 'FAQ', items: [{ question: 'Wann ist die beste Reisezeit?', answer: 'Die Region ist ganzjaehrig attraktiv. Sommer eignet sich fuer See und Rad, Herbst fuer Wandern.' }], ctaPrimary: { label: 'Frage stellen', href: '/kontakt' } } };
}

function tourismContactData(phone: string, email: string, address: string, phoneHref: string) {
  return { type: 'tourismContact', data: { headline: 'Tourismusbuero', subline: 'Persoenliche Beratung fuer Gaeste, Gruppen und Gastgeber.', badgeText: 'Kontakt', introText: 'Wir helfen bei Unterkunft, Programmen, Routen und Infomaterial.', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&q=80', formEnabled: true, namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', messagePlaceholder: 'Nachricht', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'phone', label: 'Telefon', value: phone }, { icon: 'mail', label: 'E-Mail', value: email }, { icon: 'map-pin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: phoneHref }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } } };
}

function getHotelProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const company = input.companyName;
  const phone = input.phone || '+49 221 123456';
  const email = input.email || 'reservierung@example-hotel.de';
  const address = input.address || 'Lindenallee 7, 50667 Koeln';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  return {
    brand: { primaryColor: '#184236', secondaryColor: '#d7b98a', accentColor: '#b88745' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Zimmer', href: '/zimmer', type: 'link' },
      { label: 'Angebote', href: '/angebote', type: 'link' },
      { label: 'Wellness', href: '/wellness', type: 'link' },
      { label: 'Restaurant', href: '/restaurant', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Verfuegbarkeit pruefen', href: '/kontakt' },
    footerColumns: [
      {
        title: 'Kontakt',
        items: [
          { text: phone, href: phoneHref },
          { text: email, href: `mailto:${email}` },
          { text: address },
        ],
      },
      {
        title: 'Hotel',
        items: [
          { text: 'Zimmer & Suiten', href: '/zimmer' },
          { text: 'Angebote', href: '/angebote' },
          { text: 'Wellness', href: '/wellness' },
        ],
      },
      {
        title: 'Service',
        items: [
          { text: 'Check-in ab 15 Uhr' },
          { text: 'Fruehstueck 7-11 Uhr' },
          { text: 'Direktbucher-Vorteile' },
        ],
      },
    ],
    footerCta: { label: 'Aufenthalt anfragen', href: '/kontakt' },
    pages: getHotelPages(company, input.tagline, phone, email, address, phoneHref),
  };
}

function getRestaurantProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const company = input.companyName;
  const phone = input.phone || '+49 221 123456';
  const email = input.email || 'reservierung@example-restaurant.de';
  const address = input.address || 'Marktgasse 4, 50667 Koeln';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  return {
    brand: { primaryColor: '#6f2f1d', secondaryColor: '#d8a45f', accentColor: '#c9492d' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Speisekarte', href: '/speisekarte', type: 'link' },
      { label: 'Reservierung', href: '/reservierung', type: 'link' },
      { label: 'Events', href: '/events', type: 'link' },
    ],
    navigationCta: { label: 'Tisch reservieren', href: '/reservierung' },
    footerColumns: [
      {
        title: 'Kontakt',
        items: [
          { text: phone, href: phoneHref },
          { text: email, href: `mailto:${email}` },
          { text: address },
        ],
      },
      {
        title: 'Restaurant',
        items: [
          { text: 'Speisekarte', href: '/speisekarte' },
          { text: 'Reservierung', href: '/reservierung' },
          { text: 'Events', href: '/events' },
        ],
      },
    ],
    footerCta: { label: 'Tisch reservieren', href: '/reservierung' },
    pages: [
      {
        title: 'Startseite',
        slug: 'startseite',
        sortOrder: 0,
        sections: [
          {
            type: 'hero',
            container: 'full',
            spacingTop: 'none',
            spacingBottom: 'none',
            data: {
              headline: company,
              subline: input.tagline || 'Saisonale Kueche, gute Drinks und warme Atmosphaere.',
              badgeText: 'Restaurant',
              bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
              trustItems: ['Saisonale Karte', 'Reservierung online', 'Private Feiern'],
              primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
              secondaryCta: { label: 'Speisekarte ansehen', href: '/speisekarte' },
            },
          },
          restaurantMenuData(),
          restaurantOpeningHoursData(),
          restaurantSignatureDishesData(),
          restaurantAmbienceData(),
        ],
      },
      {
        title: 'Speisekarte',
        slug: 'speisekarte',
        sortOrder: 1,
        sections: [restaurantMenuData(), restaurantSignatureDishesData()],
      },
      {
        title: 'Reservierung',
        slug: 'reservierung',
        sortOrder: 2,
        sections: [restaurantReservationData(phone, email, phoneHref), restaurantOpeningHoursData()],
      },
      {
        title: 'Events',
        slug: 'events',
        sortOrder: 3,
        sections: [restaurantEventsData(), restaurantAmbienceData()],
      },
    ],
  };
}

function restaurantMenuData() {
  return {
    type: 'menu',
    data: {
      headline: 'Speisekarte',
      subline: 'Saisonal, klar und mit Produkten aus der Region.',
      badgeText: 'Menu',
      categories: [
        {
          title: 'Vorspeisen',
          description: 'Kleine Teller zum Teilen oder Starten.',
          items: [
            { name: 'Burrata', description: 'Tomate, Basilikum, Olivenoel', price: '14', allergens: ['G'], detailHref: '/speisekarte', detailLabel: 'Details', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' },
            { name: 'Rote Bete Tatar', description: 'Meerrettich, Apfel, Kraeuter', price: '12', allergens: [], detailHref: '/speisekarte', detailLabel: 'Details', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
          ],
        },
        {
          title: 'Hauptgerichte',
          description: 'Hausklassiker und saisonale Teller.',
          items: [
            { name: 'Geschmorte Rinderbacke', description: 'Selleriepueree, Jus, Marktgemuese', price: '28', allergens: ['G', 'L'], detailHref: '/speisekarte', detailLabel: 'Details', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
            { name: 'Hausgemachte Pasta', description: 'Pilze, Parmesan, Kraeuter', price: '21', allergens: ['A', 'G'], detailHref: '/speisekarte', detailLabel: 'Details', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' },
          ],
        },
      ],
      ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
    },
  };
}

function restaurantOpeningHoursData() {
  return {
    type: 'openingHours',
    data: {
      headline: 'Oeffnungszeiten',
      subline: 'Kueche und Bar mit klaren Zeiten.',
      badgeText: 'Zeiten',
      days: [
        { label: 'Mi-Fr', hours: '17:00-23:00', note: 'Kueche bis 21:30' },
        { label: 'Sa', hours: '12:00-23:00', note: 'Lunch und Dinner' },
        { label: 'So', hours: '12:00-20:00', note: 'Sonntagskarte' },
      ],
      kitchenHoursHeadline: 'Kuechenzeiten',
      kitchenHoursText: 'Warme Kueche bis 21:30 Uhr, sonntags bis 19:00 Uhr.',
      holidayNote: 'Feiertage und Sonderoeffnungen koennen separat gepflegt werden.',
      ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
    },
  };
}

function restaurantSignatureDishesData() {
  return {
    type: 'signatureDishes',
    data: {
      headline: 'Signature-Gerichte',
      subline: 'Empfehlungen aus der Kueche.',
      badgeText: 'Empfehlungen',
      dishes: [
        { name: 'Dry Aged Entrecote', description: 'Kraeuterbutter, Jus, Marktgemuese', price: '34', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80', cta: { label: 'Reservieren', href: '/reservierung' } },
        { name: 'Zitronenrisotto', description: 'Gruener Spargel, Parmesan, Kraeuter', price: '22', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80', cta: { label: 'Reservieren', href: '/reservierung' } },
      ],
    },
  };
}

function restaurantReservationData(phone: string, email: string, phoneHref: string) {
  return {
    type: 'reservation',
    data: {
      headline: 'Tisch reservieren',
      subline: 'Reservierungen fuer Dinner, Gruppen und private Feiern.',
      badgeText: 'Reservierung',
      introText: 'Wir bestaetigen Ihre Anfrage persoenlich und klaeren besondere Wuensche direkt.',
      externalBookingCta: { label: 'Online reservieren', href: '/reservierung' },
      phoneCta: { label: 'Anrufen', href: phoneHref },
      partySizeOptions: ['Name', 'Personen', 'Datum und Uhrzeit'],
      timeHint: `Telefonisch erreichbar unter ${phone}.`,
      policyText: `Reservierungsanfragen per E-Mail an ${email} werden persoenlich bestaetigt.`,
      formEnabled: true,
      submitLabel: 'Anfrage senden',
      image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80',
    },
  };
}

function restaurantAmbienceData() {
  return {
    type: 'ambience',
    data: {
      headline: 'Ambiente',
      subline: 'Warm, nahbar und mit Blick in die offene Kueche.',
      badgeText: 'Atmosphaere',
      imagePrimary: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80',
      imageSecondary: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80',
      imageTertiary: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80',
      highlights: [
        { icon: 'wine', title: 'Weinkarte', text: 'Europaeische Winzer und wechselnde Empfehlungen.' },
        { icon: 'heart', title: 'Private Feiern', text: 'Raum fuer Geburtstage, Teams und Familien.' },
      ],
    },
  };
}

function restaurantEventsData() {
  return {
    type: 'events',
    data: {
      headline: 'Events & Feiern',
      subline: 'Private Dinner, Weinabende und saisonale Menues.',
      badgeText: 'Events',
      events: [
        { title: 'Wine Dinner', description: 'Vier Gaenge mit korrespondierenden Weinen.', dateLabel: 'monatlich', timeLabel: '19:00', priceLabel: 'ab 89', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80', cta: { label: 'Anfragen', href: '/reservierung' } },
        { title: 'Private Feier', description: 'Individuelle Menues fuer Gruppen und Familien.', dateLabel: 'auf Anfrage', timeLabel: 'flexibel', priceLabel: 'nach Absprache', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80', cta: { label: 'Planen', href: '/reservierung' } },
      ],
      fallbackText: 'Neue Termine folgen in Kuerze.',
    },
  };
}

function getHotelPages(company: string, tagline: string | undefined, phone: string, email: string, address: string, phoneHref: string): DefaultPage[] {
  return [
    {
      title: 'Startseite',
      slug: 'startseite',
      sortOrder: 0,
      sections: [
        {
          type: 'hero',
          container: 'full',
          spacingTop: 'none',
          spacingBottom: 'none',
          anchorId: 'hero',
          data: {
            headline: company,
            subline: tagline || 'Boutique-Hotel mit ruhigen Zimmern, Spa und Restaurant.',
            badgeText: 'Hotel',
            bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
            trustItems: ['Direktbucher-Vorteile', 'Spa inklusive', 'Fruehstueck im Haus'],
            primaryCta: { label: 'Verfuegbarkeit pruefen', href: '/kontakt' },
            secondaryCta: { label: 'Zimmer ansehen', href: '/zimmer' },
            availabilityHint: 'Flexible Raten auf Anfrage',
            ratingText: '4.8 / 5 Gaestebewertung',
          },
        },
        {
          type: 'bookingStrip',
          anchorId: 'booking',
          data: {
            headline: 'Direkt buchen',
            subline: 'Beste Rate, persoenlicher Service und flexible Optionen.',
            badgeText: 'Verfuegbarkeit',
            arrivalLabel: 'Anreise',
            departureLabel: 'Abreise',
            guestsLabel: 'Gaeste',
            roomLabel: 'Zimmer',
            submitCta: { label: 'Jetzt pruefen', href: '/kontakt' },
            secondaryCta: { label: 'Anrufen', href: phoneHref },
            bookingNote: 'Direktbucher erhalten bevorzugte Zimmerwahl nach Verfuegbarkeit.',
            fields: [
              { label: 'Anreise', value: 'Datum waehlen', type: 'date' },
              { label: 'Abreise', value: 'Datum waehlen', type: 'date' },
              { label: 'Gaeste', value: '2 Erwachsene', type: 'select' },
              { label: 'Zimmer', value: 'Superior', type: 'select' },
            ],
          },
        },
        hotelRoomShowcaseData(),
        hotelAmenitiesData(),
        hotelTestimonialsData(),
      ],
    },
    {
      title: 'Zimmer',
      slug: 'zimmer',
      sortOrder: 1,
      sections: [hotelRoomShowcaseData(), hotelGalleryData()],
    },
    {
      title: 'Angebote',
      slug: 'angebote',
      sortOrder: 2,
      sections: [hotelOffersData(), hotelFaqData()],
    },
    {
      title: 'Wellness',
      slug: 'wellness',
      sortOrder: 3,
      sections: [hotelWellnessData(), hotelLocationData(address)],
    },
    {
      title: 'Restaurant',
      slug: 'restaurant',
      sortOrder: 4,
      sections: [hotelDiningData(), hotelEventSpacesData()],
    },
    {
      title: 'Kontakt',
      slug: 'kontakt',
      sortOrder: 5,
      sections: [hotelContactData(phone, email, address, phoneHref), hotelFaqData()],
    },
  ];
}

function hotelRoomShowcaseData() {
  return {
    type: 'roomShowcase',
    anchorId: 'zimmer',
    data: {
      headline: 'Zimmer & Suiten',
      subline: 'Ruhige Raeume, hochwertige Betten und Details fuer einen leichten Aufenthalt.',
      badgeText: 'Aufenthalt',
      rooms: [
        {
          name: 'Superior Doppelzimmer',
          description: 'Grosses Bett, Sitzecke, Walk-in-Dusche und Blick in den Innenhof.',
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
          galleryImages: ['https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=900&q=80'],
          priceLabel: 'ab 159 / Nacht',
          sizeLabel: '28 qm',
          occupancyLabel: '2 Gaeste',
          bedLabel: 'King Bed',
          features: ['Fruehstueck', 'WLAN', 'Spa-Zugang'],
          detailCta: { label: 'Details', href: '/zimmer' },
          bookingCta: { label: 'Anfragen', href: '/kontakt' },
          highlighted: true,
        },
      ],
      footerText: 'Weitere Kategorien und Sonderwuensche klaeren wir persoenlich.',
    },
  };
}

function hotelAmenitiesData() {
  return {
    type: 'amenities',
    data: {
      headline: 'Alles fuer einen leichten Aufenthalt',
      subline: 'Services, die Gaeste wirklich nutzen.',
      badgeText: 'Ausstattung',
      items: [
        { icon: 'wifi', title: 'Highspeed WLAN', text: 'Im gesamten Haus inklusive.', image: '', mediaType: 'icon' },
        { icon: 'clock', title: 'Late Check-out', text: 'Nach Verfuegbarkeit flexibel moeglich.', image: '', mediaType: 'icon' },
        { icon: 'leaf', title: 'Spa & Sauna', text: 'Taeglich fuer Hotelgaeste geoeffnet.', image: '', mediaType: 'icon' },
      ],
      ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
    },
  };
}

function hotelOffersData() {
  return {
    type: 'offers',
    data: {
      headline: 'Angebote & Arrangements',
      subline: 'Kurzurlaub, Wellness und Business-Aufenthalte.',
      badgeText: 'Specials',
      offers: [
        {
          title: 'Wellness Wochenende',
          description: 'Zwei Naechte, Spa-Zugang, Massage und Dinner.',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80',
          priceLabel: 'ab 349',
          durationLabel: '2 Naechte',
          includes: ['Spa', 'Dinner', 'Massage'],
          validUntilLabel: 'bis September',
          cta: { label: 'Anfragen', href: '/kontakt' },
          detailHref: '/angebote',
          detailLabel: 'Details',
          highlighted: true,
        },
      ],
      fallbackText: 'Neue Angebote folgen in Kuerze.',
    },
  };
}

function hotelWellnessData() {
  return {
    type: 'wellness',
    data: {
      headline: 'Spa & Wellness',
      subline: 'Sauna, Ruhebereiche und Treatments.',
      badgeText: 'Wellness',
      introText: 'Der Spa-Bereich ist fuer Hotelgaeste taeglich geoeffnet.',
      imagePrimary: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85',
      imageSecondary: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
      treatments: [{ title: 'Aroma Massage', text: 'Ruhige Anwendung mit warmen Oelen.', durationLabel: '50 Minuten', priceLabel: '89', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', cta: { label: 'Termin anfragen', href: '/kontakt' } }],
      features: [{ icon: 'heart', title: 'Ruheraum', text: 'Leise Zonen mit Blick ins Gruene.' }],
      ctaPrimary: { label: 'Spa anfragen', href: '/kontakt' },
    },
  };
}

function hotelLocationData(address: string) {
  return {
    type: 'location',
    data: {
      headline: 'Zentral und ruhig gelegen',
      subline: 'Altstadt, Bahnhof und Natur sind schnell erreichbar.',
      badgeText: 'Lage',
      addressText: address,
      mapEmbedUrl: '',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=85',
      transportItems: [{ icon: 'map-pin', label: 'Bahnhof', value: '8 Minuten', text: 'Direkte Verbindung mit Tram und Taxi.' }],
      nearbyItems: [{ title: 'Altstadt', distanceLabel: '1.2 km', text: 'Restaurants, Museen und Promenade.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80' }],
      routeCta: { label: 'Route planen', href: 'https://maps.google.com' },
    },
  };
}

function hotelDiningData() {
  return {
    type: 'hotelDining',
    data: {
      headline: 'Restaurant & Bar',
      subline: 'Fruehstueck, Abendkarte und Drinks am Kamin.',
      badgeText: 'Genuss',
      introText: 'Die Kueche arbeitet saisonal und regional.',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=85',
      openingText: 'Fruehstueck 7-11 Uhr, Bar ab 17 Uhr',
      menus: [{ title: 'Fruehstueck', description: 'Buffet, Eierspeisen und Kaffee.', timeLabel: '7-11 Uhr', priceLabel: 'inklusive', cta: { label: 'Mehr erfahren', href: '/kontakt' } }],
      highlights: [{ title: 'Kaminbar', text: 'Drinks und kleine Teller.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80' }],
      ctaPrimary: { label: 'Tisch anfragen', href: '/kontakt' },
    },
  };
}

function hotelEventSpacesData() {
  return {
    type: 'eventSpaces',
    data: {
      headline: 'Events & Tagungen',
      subline: 'Flexible Raeume fuer Meetings und Feiern.',
      badgeText: 'Raeume',
      spaces: [{ name: 'Salon Linden', description: 'Heller Raum mit Zugang zur Terrasse.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80', capacityLabel: 'bis 60 Personen', sizeLabel: '90 qm', seatingOptions: ['U-Form', 'Dinner', 'Theater'], features: ['Beamer', 'Terrasse', 'Bar'], inquiryCta: { label: 'Anfragen', href: '/kontakt' } }],
      processHeadline: 'So planen wir gemeinsam',
      processSteps: [{ icon: 'clipboard', title: 'Anfrage', text: 'Rahmen und Ziel klaeren.' }],
      ctaPrimary: { label: 'Event anfragen', href: '/kontakt' },
    },
  };
}

function hotelGalleryData() {
  return {
    type: 'gallery',
    data: {
      headline: 'Einblicke ins Haus',
      subline: 'Zimmer, Spa, Restaurant und ruhige Ecken im Ueberblick.',
      badgeText: 'Galerie',
      images: [
        { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80', alt: 'Hotellobby', caption: 'Warme Lobby mit Lounge', category: 'Ankommen' },
        { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80', alt: 'Hotelzimmer', caption: 'Ruhige Zimmer mit klaren Linien', category: 'Zimmer' },
        { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80', alt: 'Hotelpool', caption: 'Spa-Bereich fuer Hotelgaeste', category: 'Wellness' },
      ],
      ctaPrimary: { label: 'Aufenthalt planen', href: '/kontakt' },
    },
  };
}

function hotelTestimonialsData() {
  return {
    type: 'testimonials',
    data: {
      headline: 'Was Gaeste sagen',
      subline: 'Bewertungen und Stimmen aus aktuellen Aufenthalten.',
      badgeText: 'Bewertungen',
      ratingValue: '4.8 von 5',
      ratingCount: '312 Bewertungen',
      sourceLabel: 'Direktbuchung & Portale',
      items: [
        { quote: 'Sehr ruhig, tolles Fruehstueck und ein Team, das wirklich mitdenkt.', name: 'M. Schneider', context: 'Privatreise', rating: 5, stayLabel: 'April 2026' },
        { quote: 'Perfekt fuer unser Offsite. Raum, Technik und Abendessen waren stark organisiert.', name: 'Lea K.', context: 'Business', rating: 5, stayLabel: 'Maerz 2026' },
      ],
      ctaPrimary: { label: 'Jetzt anfragen', href: '/kontakt' },
    },
  };
}

function hotelFaqData() {
  return {
    type: 'faq',
    data: {
      headline: 'Haeufige Fragen',
      subline: 'Antworten zu Check-in, Spa, Parkplatz und Direktbuchung.',
      badgeText: 'FAQ',
      items: [
        { question: 'Ab wann ist der Check-in moeglich?', answer: 'Der Check-in ist ab 15 Uhr moeglich. Fruehere Anreise pruefen wir nach Verfuegbarkeit.' },
        { question: 'Ist Spa-Zugang inklusive?', answer: 'Ja, fuer Hotelgaeste ist der Zugang zu Sauna und Ruhebereich inklusive.' },
        { question: 'Gibt es Parkplaetze?', answer: 'Parkplaetze koennen je nach Verfuegbarkeit direkt mit der Buchung reserviert werden.' },
      ],
      ctaPrimary: { label: 'Weitere Frage stellen', href: '/kontakt' },
    },
  };
}

function hotelContactData(phone: string, email: string, address: string, phoneHref: string) {
  return {
    type: 'contact',
    anchorId: 'kontakt',
    data: {
      headline: 'Direkt Kontakt aufnehmen',
      subline: 'Fuer Buchungen, Events und individuelle Aufenthalte.',
      badgeText: 'Kontakt',
      introText: 'Das Team antwortet persoenlich und klaert Verfuegbarkeit, Zimmerwunsch oder Eventbedarf.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85',
      infoCards: [
        { icon: 'phone', label: 'Telefon', value: phone },
        { icon: 'mail', label: 'E-Mail', value: email },
        { icon: 'map-pin', label: 'Adresse', value: address },
      ],
      contactCta: { label: 'Anrufen', href: phoneHref },
      routeCta: { label: 'Route planen', href: 'https://maps.google.com' },
      formEnabled: true,
      namePlaceholder: 'Name',
      emailPlaceholder: 'E-Mail',
      messagePlaceholder: 'Nachricht',
      submitLabel: 'Anfrage senden',
    },
  };
}
