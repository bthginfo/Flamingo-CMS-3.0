export type AdvancedSectionValidationIssue = {
  path: string;
  message: string;
  instruction: string;
};

const ADVANCED_TYPES = new Set([
  'dualWave',
  'cinematicChapters',
  'transformationSequence',
  'xrayReveal',
  'sceneLab',
  'infiniteCanvas',
]);

function isFilled(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value.trim());
}

export function validateAdvancedSectionData(
  type: string,
  data: Record<string, unknown>,
  basePath = 'data',
): AdvancedSectionValidationIssue[] {
  if (!ADVANCED_TYPES.has(type)) return [];
  const issues: AdvancedSectionValidationIssue[] = [];
  const add = (path: string, message: string, instruction: string) => issues.push({ path: `${basePath}.${path}`, message, instruction });
  const requireHeadline = () => {
    if (!isFilled(data.headline)) add('headline', 'A non-empty headline is required.', 'Write one specific, outcome-led headline.');
  };
  const requireRange = (key: string, min: number, max: number) => {
    const value = data[key];
    if (!Array.isArray(value) || value.length < min || value.length > max) {
      add(key, `${key} must contain ${min}–${max} items.`, `Provide exactly ${min}–${max} complete ${key} entries.`);
      return null;
    }
    return value as Array<Record<string, unknown>>;
  };

  requireHeadline();
  if (type === 'dualWave') {
    const items = requireRange('items', 6, 12);
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.title)) add(`items[${index}].title`, 'Every wave item needs a title.', 'Add one concise, unique title.');
    });
  }
  if (type === 'cinematicChapters') {
    const chapters = requireRange('chapters', 3, 6);
    chapters?.forEach((chapter, index) => {
      if (!chapter || !isFilled(chapter.title)) add(`chapters[${index}].title`, 'Every chapter needs a title.', 'Add a short title that advances the story.');
      if (!chapter || !isFilled(chapter.image)) add(`chapters[${index}].image`, 'Every chapter needs an image.', 'Upload or reference one coherent landscape image.');
    });
  }
  if (type === 'transformationSequence') {
    const states = requireRange('states', 3, 6);
    states?.forEach((state, index) => {
      if (!state || !isFilled(state.title)) add(`states[${index}].title`, 'Every state needs a title.', 'Name the concrete phase or change.');
      if (!state || !isFilled(state.image)) add(`states[${index}].image`, 'Every state needs an image.', 'Add a relevant image, preferably from a comparable perspective.');
    });
  }
  if (type === 'xrayReveal') {
    if (!isFilled(data.imageBase)) add('imageBase', 'The base image is required.', 'Provide image A with the final shared crop and dimensions.');
    if (!isFilled(data.imageReveal)) add('imageReveal', 'The reveal image is required.', 'Provide image B with the exact same crop, dimensions and perspective as image A.');
  }
  if (type === 'sceneLab') {
    if (!isFilled(data.baseImage)) add('baseImage', 'The base scene image is required.', 'Provide the fixed scene without option layers.');
    const groups = requireRange('groups', 2, 6);
    groups?.forEach((group, groupIndex) => {
      if (!group || !isFilled(group.label)) add(`groups[${groupIndex}].label`, 'Every option group needs a label.', 'Name the configurable property.');
      const choices = group && Array.isArray(group.choices) ? group.choices as Array<Record<string, unknown>> : [];
      if (choices.length < 2 || choices.length > 8) {
        add(`groups[${groupIndex}].choices`, 'Each group needs 2–8 choices.', 'Provide 2–8 meaningful alternatives for this group.');
      }
      choices.forEach((choice, choiceIndex) => {
        if (!choice || !isFilled(choice.label)) add(`groups[${groupIndex}].choices[${choiceIndex}].label`, 'Every choice needs a label.', 'Add a short visitor-facing option name.');
        if (!choice || !isFilled(choice.image)) add(`groups[${groupIndex}].choices[${choiceIndex}].image`, 'Every choice needs an aligned transparent layer.', 'Provide a transparent layer matching the base image pixel dimensions.');
      });
    });
  }
  if (type === 'infiniteCanvas') {
    const items = requireRange('items', 10, 40);
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.image)) add(`items[${index}].image`, 'Every canvas item needs an image.', 'Upload or reference an optimized image.');
      if (!item || !isFilled(item.alt)) add(`items[${index}].alt`, 'Every canvas image needs alt text.', 'Describe the visible subject in one concise sentence.');
    });
  }

  return issues;
}
