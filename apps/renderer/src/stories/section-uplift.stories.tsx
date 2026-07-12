import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionRenderer } from '@/components/section-renderer';
import { getStyleCssVars } from '@/lib/styles';

type ReviewSurfaceProps = {
  type: 'faq' | 'timeline' | 'testimonialMarquee';
  data: Record<string, unknown>;
};

function ReviewSurface({ type, data }: ReviewSurfaceProps) {
  return (
    <div data-style="classic" className="min-h-screen bg-[var(--token-page-bg)] py-8" style={getStyleCssVars('tradesman', 'classic') as CSSProperties}>
      <main>
        <SectionRenderer
          industry="tradesman"
          styleVariant="classic"
          section={{
            id: `uplift-${type}`,
            type,
            variant: null,
            visible: true,
            locked: false,
            container: 'default',
            spacingTop: 'm',
            spacingBottom: 'm',
            anchorId: null,
            styleOverrides: null,
            data,
          }}
        />
      </main>
    </div>
  );
}

const meta = {
  title: 'Section Lab/High leverage uplift',
  component: ReviewSurface,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ReviewSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

const SHORT_TESTIMONIAL_ITEMS = [
  { quote: 'Die Beratung war klar, ehrlich und genau auf unser Projekt zugeschnitten.', name: 'Mara Hoffmann', role: 'Altbausanierung', rating: 5 },
  { quote: 'Termine, Kosten und nächste Schritte waren jederzeit transparent.', name: 'Jonas Keller', role: 'Innenausbau', rating: 5 },
  { quote: 'Ein Ansprechpartner, kurze Wege und ein Ergebnis, das im Alltag überzeugt.', name: 'Anika Schulte', role: 'Gewerbeprojekt', rating: 5 },
];

export const EditorialFaq: Story = {
  args: {
    type: 'faq',
    data: {
      badgeText: 'Gut zu wissen',
      headline: 'Klarheit vor dem ersten Termin',
      subline: 'Die wichtigsten Antworten, kompakt und ohne Kleingedrucktes.',
      expandFirst: false,
      items: [
        { question: 'Wie schnell erhalte ich eine erste Rückmeldung?', answer: '<p>In der Regel melden wir uns innerhalb eines Werktags mit einer klaren Einschätzung und den nächsten sinnvollen Schritten.</p>' },
        { question: 'Bekomme ich vorab einen verbindlichen Kostenrahmen?', answer: '<p>Ja. Nach einem kurzen Briefing erhalten Sie einen transparenten Rahmen mit Leistungen, Optionen und möglichen Zusatzkosten.</p>' },
        { question: 'Kann das Projekt in Etappen umgesetzt werden?', answer: '<p>Wir priorisieren gemeinsam die größte Wirkung und planen weitere Ausbaustufen so, dass nichts doppelt gebaut werden muss.</p>' },
        { question: 'Wer ist während der Umsetzung meine Ansprechperson?', answer: '<p>Sie arbeiten durchgehend mit einer verantwortlichen Person, die Entscheidungen, Termine und Qualität zusammenhält.</p>' },
      ],
    },
  },
};

export const CompactTimeline: Story = {
  args: {
    type: 'timeline',
    data: {
      badge: 'Unser Weg',
      headline: 'Erfahrung, die heute weiterhilft',
      subline: 'Vier Meilensteine zeigen, wie aus lokaler Nähe verlässliche Expertise wurde.',
      entries: [
        { year: '1998', title: 'Start als kleiner Meisterbetrieb', text: 'Mit einem klaren Anspruch: saubere Arbeit, nachvollziehbare Angebote und direkte Erreichbarkeit.' },
        { year: '2008', title: 'Spezialisierung auf anspruchsvolle Sanierungen', text: 'Planung und Ausführung wurden in einem festen Team zusammengeführt.' },
        { year: '2018', title: 'Digitale Projektbegleitung', text: 'Kundinnen und Kunden erhalten seitdem transparente Status-Updates und dokumentierte Abnahmen.' },
        { year: 'Heute', title: 'Ein Team für das gesamte Projekt', text: 'Von der ersten Idee bis zur Übergabe bleiben Verantwortung und Kommunikation an einem Ort.' },
      ],
    },
  },
};

export const OverflowSafeTestimonials: Story = {
  args: {
    type: 'testimonialMarquee',
    data: {
      badge: 'Stimmen aus Projekten',
      headline: 'Gute Zusammenarbeit bleibt im Gedächtnis',
      subline: 'Lange, realistische Kundenstimmen prüfen Lesbarkeit, Zoom und reduzierte Bewegung.',
      items: [
        { quote: 'Vom ersten Gespräch bis zur Abnahme wussten wir jederzeit, was als Nächstes passiert. Besonders stark war die ruhige Beratung bei schwierigen Entscheidungen.', name: 'Mara Hoffmann', role: 'Sanierung eines Altbaus', rating: 5 },
        { quote: 'Das Angebot war verständlich, Rückfragen wurden schnell beantwortet und der Terminplan wurde trotz zusätzlicher Wünsche eingehalten.', name: 'Jonas Keller', role: 'Umbau und Innenausbau', rating: 5 },
        { quote: 'Wir hatten mehrere Gewerke zu koordinieren. Hier lief alles über eine verantwortliche Person – das hat uns enorm viel Zeit gespart.', name: 'Anika Schulte', role: 'Gewerbeprojekt', rating: 5 },
        { quote: 'Keine leeren Versprechen, sondern gute Vorschläge und ein Ergebnis, das im Alltag wirklich funktioniert.', name: 'David Neumann', role: 'Modernisierung', rating: 4 },
        { quote: 'Auch nach der Übergabe war das Team erreichbar und hat eine kleine Nachbesserung unkompliziert gelöst.', name: 'Lea Wagner', role: 'Komplettsanierung', rating: 5 },
        { quote: 'Die Mischung aus handwerklicher Qualität und verlässlicher Kommunikation war genau das, was wir gesucht haben.', name: 'Tobias Berger', role: 'Anbau und Fassade', rating: 5 },
      ],
    },
  },
};

export const StaticTestimonialOneItem: Story = {
  args: {
    type: 'testimonialMarquee',
    data: { headline: 'Eine starke Stimme', items: SHORT_TESTIMONIAL_ITEMS.slice(0, 1) },
  },
};

export const StaticTestimonialsTwoItems: Story = {
  args: {
    type: 'testimonialMarquee',
    data: { headline: 'Zwei Perspektiven', items: SHORT_TESTIMONIAL_ITEMS.slice(0, 2) },
  },
};

export const StaticTestimonialsThreeItems: Story = {
  args: {
    type: 'testimonialMarquee',
    data: { headline: 'Vertrauen aus echten Projekten', items: SHORT_TESTIMONIAL_ITEMS },
  },
};
