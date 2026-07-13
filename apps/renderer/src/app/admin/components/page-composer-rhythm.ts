import { COMPOSER_STAGES, type ComposerStageId } from './page-composer-recipes';

export type PageRhythmSection = {
  stage: ComposerStageId;
  type: string;
};

export type PageRhythmIssue = {
  id: 'missing-stage' | 'stage-order' | 'duplicate-section' | 'immersive-clash' | 'card-run' | 'visual-pressure';
  severity: 'warning' | 'error';
  stages: ComposerStageId[];
  message: string;
};

export type PageRhythmEvaluation = {
  status: 'balanced' | 'review';
  score: number;
  label: string;
  summary: string;
  issues: PageRhythmIssue[];
};

type VisualTexture = 'immersive' | 'cards' | 'rail' | 'editorial' | 'timeline' | 'form' | 'band';

const IMMERSIVE_TYPES = new Set([
  'cinematicHero',
  'glowHero',
  'scrollStory',
  'horizontalScrollShowcase',
  'immersiveCtaBanner',
  'brandShowroom',
]);

const HIGH_PRESSURE_TYPES = new Set([
  ...IMMERSIVE_TYPES,
  'featureShowcase',
  'beforeAfterStoryPro',
  'galleryPro',
]);

const EXPLICIT_TEXTURES: Record<string, VisualTexture> = {
  hero: 'editorial',
  editorialHero: 'editorial',
  collectionHero: 'editorial',
  featureShowcase: 'editorial',
  zigzagShowcase: 'editorial',
  editorialFeatureRail: 'rail',
  testimonialMarquee: 'rail',
  logoMarquee: 'rail',
  socialProofBar: 'band',
  statsCounter: 'band',
  stats: 'band',
  ctaBand: 'band',
  processSteps: 'timeline',
  verticalTimeline: 'timeline',
  timeline: 'timeline',
  contact: 'form',
  smartInquiry: 'form',
  faqContactSplit: 'form',
  consultationBooking: 'form',
  bookingWidget: 'form',
  bookingSlotPicker: 'form',
  bookingDateRange: 'form',
};

function visualTexture(type: string): VisualTexture {
  if (IMMERSIVE_TYPES.has(type)) return 'immersive';
  if (EXPLICIT_TEXTURES[type]) return EXPLICIT_TEXTURES[type];
  if (/(grid|cards|wall|mosaic|packages|products|tabs|showcase)$/i.test(type)) return 'cards';
  return 'editorial';
}

/**
 * Deterministic, side-effect-free quality check for the selected five-stage
 * page sequence. It deliberately evaluates composition only; content quality,
 * add-on availability and publish validation stay in their existing systems.
 */
export function evaluatePageRhythm(sections: readonly PageRhythmSection[]): PageRhythmEvaluation {
  const issues: PageRhythmIssue[] = [];
  const expectedStages = COMPOSER_STAGES.map((stage) => stage.id);
  const actualStages = sections.map((section) => section.stage);
  const missingStages = expectedStages.filter((stage) => !actualStages.includes(stage));

  if (missingStages.length > 0) {
    issues.push({
      id: 'missing-stage',
      severity: 'warning',
      stages: missingStages,
      message: `${missingStages.length} Station${missingStages.length === 1 ? '' : 'en'} fehlen noch für eine vollständige Seitendramaturgie.`,
    });
  }

  const expectedPresentOrder = expectedStages.filter((stage) => actualStages.includes(stage));
  if (actualStages.some((stage, index) => stage !== expectedPresentOrder[index])) {
    issues.push({
      id: 'stage-order',
      severity: 'error',
      stages: actualStages,
      message: 'Die Stationen sollten von Einstieg über Angebot und Belege bis zum Abschluss aufgebaut sein.',
    });
  }

  const duplicateTypes = [...new Set(sections.map((section) => section.type)
    .filter((type, index, all) => all.indexOf(type) !== index))];
  if (duplicateTypes.length > 0) {
    issues.push({
      id: 'duplicate-section',
      severity: 'error',
      stages: sections.filter((section) => duplicateTypes.includes(section.type)).map((section) => section.stage),
      message: 'Eine Sektion übernimmt mehrere Aufgaben. Wählen Sie für mehr Abwechslung eine Alternative.',
    });
  }

  for (let index = 1; index < sections.length; index += 1) {
    const previous = sections[index - 1];
    const current = sections[index];
    if (visualTexture(previous.type) === 'immersive' && visualTexture(current.type) === 'immersive') {
      issues.push({
        id: 'immersive-clash',
        severity: 'warning',
        stages: [previous.stage, current.stage],
        message: 'Zwei immersive Sektionen direkt hintereinander konkurrieren um Aufmerksamkeit. Dazwischen hilft ein ruhigerer Beleg oder Inhalt.',
      });
      break;
    }
  }

  for (let index = 2; index < sections.length; index += 1) {
    const run = sections.slice(index - 2, index + 1);
    if (run.every((section) => visualTexture(section.type) === 'cards')) {
      issues.push({
        id: 'card-run',
        severity: 'warning',
        stages: run.map((section) => section.stage),
        message: 'Drei Karten- oder Grid-Sektionen am Stück wirken monoton. Ein Editorial-, Rail- oder Timeline-Moment schafft Rhythmus.',
      });
      break;
    }
  }

  const highPressureSections = sections.filter((section) => HIGH_PRESSURE_TYPES.has(section.type));
  if (highPressureSections.length >= 4) {
    issues.push({
      id: 'visual-pressure',
      severity: 'warning',
      stages: highPressureSections.map((section) => section.stage),
      message: 'Die Seite hat sehr viele dominante Momente. Reduzieren Sie eine Interaktion, damit die wichtigste Sektion stärker wirkt.',
    });
  }

  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.length - errorCount;
  const score = Math.max(0, 100 - (errorCount * 30) - (warningCount * 12));
  const balanced = issues.length === 0;

  return {
    status: balanced ? 'balanced' : 'review',
    score,
    label: balanced ? 'Rhythmus ausgewogen' : 'Rhythmus prüfen',
    summary: balanced
      ? 'Die fünf Stationen wechseln Wirkung und Dichte klar ab.'
      : issues[0].message,
    issues,
  };
}
