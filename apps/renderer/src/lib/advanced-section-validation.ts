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
  'kineticIdentity',
  'signaturePath',
  'layeredAnatomy',
  'guidedChoice',
  'dayToNight',
  'livingBlueprint',
  'editorialCardMorph',
  'materialAtelier',
  'verticalReelShowcase',
  'aiWorkflowReel',
  'cameraExplodeScroll',
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
  if (type === 'kineticIdentity') {
    const statements = requireRange('statements', 3, 6);
    statements?.forEach((item, index) => {
      if (!item || !isFilled(item.highlight)) add(`statements[${index}].highlight`, 'Every statement needs one focus word or phrase.', 'Add a concise highlight that carries the changing identity statement.');
    });
  }
  if (type === 'signaturePath') {
    const items = requireRange('items', 3, 7);
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.title)) add(`items[${index}].title`, 'Every path station needs a title.', 'Name this station with a concise visitor-facing title.');
    });
  }
  if (type === 'layeredAnatomy') {
    if (!isFilled(data.baseImage)) add('baseImage', 'The base image is required.', 'Upload the aligned base image used by every detail.');
    const mode = data.mode === 'layers' ? 'layers' : 'hotspots';
    const items = requireRange(mode, 2, 8);
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.title)) add(`${mode}[${index}].title`, 'Every anatomy detail needs a title.', 'Add one concise detail title.');
      if (mode === 'hotspots') {
        for (const axis of ['x', 'y'] as const) if (typeof item?.[axis] !== 'number' || Number(item[axis]) < 0 || Number(item[axis]) > 100) add(`${mode}[${index}].${axis}`, `${axis} must be a number from 0 to 100.`, `Set ${axis} to the hotspot position as a percentage.`);
      } else {
        if (!item || !isFilled(item.image)) add(`${mode}[${index}].image`, 'Every Pro layer needs an aligned transparent image.', 'Upload one transparent PNG/WebP matching the base image dimensions.');
        if (!['left', 'right', 'up', 'down'].includes(String(item?.direction || ''))) add(`${mode}[${index}].direction`, 'Every Pro layer needs a valid direction.', 'Choose left, right, up or down.');
      }
    });
  }
  if (type === 'guidedChoice') {
    const questions = requireRange('questions', 2, 6);
    const results = requireRange('results', 2, 6);
    const resultIds = new Set<string>();
    const questionIds = new Set<string>();
    const knownQuestionIds = new Set((questions || []).filter((question) => isFilled(question?.id)).map((question) => String(question.id)));
    results?.forEach((result, index) => {
      if (!result || !isFilled(result.id)) add(`results[${index}].id`, 'Every result needs a stable id.', 'Add a unique lowercase id that does not change after links are configured.');
      else if (resultIds.has(result.id)) add(`results[${index}].id`, 'Result ids must be unique.', 'Change this id and update every answer that targets it.');
      else resultIds.add(result.id);
      if (!result || !isFilled(result.title)) add(`results[${index}].title`, 'Every result needs a title.', 'Add a concise recommendation title.');
    });
    questions?.forEach((question, index) => {
      if (!question || !isFilled(question.id)) add(`questions[${index}].id`, 'Every question needs a stable id.', 'Add a unique stable id.');
      else if (questionIds.has(question.id)) add(`questions[${index}].id`, 'Question ids must be unique.', 'Change this id and update answers that target it.');
      else questionIds.add(question.id);
      if (!question || !isFilled(question.label)) add(`questions[${index}].label`, 'Every question needs a label.', 'Write the visitor-facing question.');
      const answers = question && Array.isArray(question.answers) ? question.answers as Array<Record<string, unknown>> : [];
      if (answers.length < 2 || answers.length > 4) add(`questions[${index}].answers`, 'Every question needs 2–4 answers.', 'Add 2–4 clear and mutually distinct answers.');
      answers.forEach((answer, answerIndex) => {
        if (!answer || !isFilled(answer.label)) add(`questions[${index}].answers[${answerIndex}].label`, 'Every answer needs a label.', 'Add a concise visitor-facing answer.');
        if (data.mode === 'branch') {
          const nextId = isFilled(answer?.nextQuestionId) ? answer.nextQuestionId : '';
          const resultId = isFilled(answer?.resultId) ? answer.resultId : '';
          if (Boolean(nextId) === Boolean(resultId)) add(`questions[${index}].answers[${answerIndex}]`, 'A branch answer needs exactly one target.', 'Select either one next question or one result.');
          if (nextId && !knownQuestionIds.has(nextId)) add(`questions[${index}].answers[${answerIndex}].nextQuestionId`, 'The target question does not exist.', 'Select an existing question.');
          if (resultId && !resultIds.has(resultId)) add(`questions[${index}].answers[${answerIndex}].resultId`, 'The target result does not exist.', 'Select an existing result.');
        } else {
          const scores = Array.isArray(answer?.scores) ? answer.scores as Array<Record<string, unknown>> : [];
          if (!scores.length) add(`questions[${index}].answers[${answerIndex}].scores`, 'Every score answer needs at least one result score.', 'Assign at least one result a score from 0 to 10.');
          scores.forEach((score, scoreIndex) => {
            if (!isFilled(score?.resultId) || !resultIds.has(score.resultId)) add(`questions[${index}].answers[${answerIndex}].scores[${scoreIndex}].resultId`, 'The scored result does not exist.', 'Select an existing result id.');
            if (!Number.isInteger(score?.points) || Number(score.points) < 0 || Number(score.points) > 10) add(`questions[${index}].answers[${answerIndex}].scores[${scoreIndex}].points`, 'Score points must be an integer from 0 to 10.', 'Use an integer between 0 and 10.');
          });
        }
      });
    });
    if (data.mode === 'branch' && questions?.length && results?.length) {
      const byId = new Map(questions.filter((question) => isFilled(question?.id)).map((question) => [String(question.id), question]));
      const visiting = new Set<string>();
      const visited = new Set<string>();
      const reachableResults = new Set<string>();
      let cycleAt = '';
      const visit = (id: string) => {
        if (visiting.has(id)) { cycleAt ||= id; return; }
        if (visited.has(id)) return;
        const question = byId.get(id); if (!question) return;
        visiting.add(id);
        const answers = Array.isArray(question.answers) ? question.answers as Array<Record<string, unknown>> : [];
        for (const answer of answers) {
          if (isFilled(answer?.resultId) && resultIds.has(answer.resultId)) reachableResults.add(answer.resultId);
          if (isFilled(answer?.nextQuestionId)) visit(answer.nextQuestionId);
        }
        visiting.delete(id); visited.add(id);
      };
      visit(String(questions[0]?.id || ''));
      if (cycleAt) add('questions', `Branch flow contains a cycle at "${cycleAt}".`, 'Redirect one answer in the cycle to a result or a question outside the cycle.');
      questions.forEach((question, index) => { if (isFilled(question?.id) && !visited.has(question.id)) add(`questions[${index}]`, 'This question is unreachable from the first question.', 'Link an earlier answer to this question or remove it.'); });
      results.forEach((result, index) => { if (isFilled(result?.id) && !reachableResults.has(result.id)) add(`results[${index}]`, 'This result is unreachable from the first question.', 'Point at least one reachable answer to this result or remove it.'); });
    }
  }
  if (type === 'dayToNight') {
    const scenes = requireRange('scenes', 2, 4);
    scenes?.forEach((scene, index) => {
      if (!scene || !isFilled(scene.time)) add(`scenes[${index}].time`, 'Every scene needs a time label.', 'Add a concise time such as 08:00 or Abend.');
      if (!scene || !isFilled(scene.label)) add(`scenes[${index}].label`, 'Every scene needs an atmosphere label.', 'Name the moment or mood.');
      if (!scene || !isFilled(scene.title)) add(`scenes[${index}].title`, 'Every scene needs a title.', 'Add a short scene headline.');
      if (!scene || !isFilled(scene.image)) add(`scenes[${index}].image`, 'Every scene needs an image.', 'Upload a coordinated scene image or reuse one image with another tint.');
    });
  }
  if (type === 'livingBlueprint') {
    const nodes = requireRange('nodes', 3, 8);
    const ids = new Set<string>();
    nodes?.forEach((node, index) => {
      if (!node || !isFilled(node.id)) add(`nodes[${index}].id`, 'Every blueprint node needs a stable id.', 'Add a unique stable id.');
      else if (ids.has(node.id)) add(`nodes[${index}].id`, 'Blueprint node ids must be unique.', 'Change this duplicate node id.');
      else ids.add(node.id);
      if (!node || !isFilled(node.title)) add(`nodes[${index}].title`, 'Every blueprint node needs a title.', 'Add a concise node title.');
    });
  }
  if (type === 'editorialCardMorph') {
    const items = requireRange('items', 3, 8);
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.title)) add(`items[${index}].title`, 'Every editorial card needs a title.', 'Add a concise case or service title.');
      if (!item || !isFilled(item.image)) add(`items[${index}].image`, 'Every editorial card needs an image.', 'Upload one strong representative image.');
      if (Array.isArray(item?.facts) && item.facts.length > 4) add(`items[${index}].facts`, 'A card may contain at most 4 facts.', 'Keep only the four facts with the greatest visitor value.');
    });
  }
  if (type === 'materialAtelier') {
    const items = requireRange('items', 3, 8);
    if (data.preset !== undefined && !['architectural', 'quiet', 'editorial'].includes(String(data.preset))) {
      add('preset', 'The atelier preset is invalid.', 'Choose architectural, quiet or editorial.');
    }
    items?.forEach((item, index) => {
      if (!item || !isFilled(item.title)) add(`items[${index}].title`, 'Every atelier position needs a title.', 'Add one concise material, service or collection title.');
      if (!item || !isFilled(item.image)) add(`items[${index}].image`, 'Every atelier position needs an image.', 'Add one strong representative image.');
      if (Array.isArray(item?.meta) && item.meta.length > 5) add(`items[${index}].meta`, 'An atelier position may contain at most 5 meta labels.', 'Keep only the five most useful specifications.');
    });
  }
  if (type === 'verticalReelShowcase') {
    const reels = requireRange('reels', 2, 5);
    reels?.forEach((reel, index) => {
      if (!reel || !isFilled(reel.title)) add(`reels[${index}].title`, 'Every reel needs a title.', 'Add a short title that explains the reel.');
      if (!reel || (!isFilled(reel.videoSrc) && !isFilled(reel.poster))) add(`reels[${index}].videoSrc`, 'Every reel needs a video URL or poster image.', 'Add a public HTTPS video URL; use a poster as fallback.');
    });
  }
  if (type === 'aiWorkflowReel') {
    const media = data.media && typeof data.media === 'object' ? data.media as Record<string, unknown> : data;
    if (!isFilled(media.videoSrc) && !isFilled(media.poster)) add('media.videoSrc', 'The workflow needs a video URL or poster image.', 'Add a public HTTPS reel URL or a poster fallback.');
    const steps = requireRange('steps', 3, 6);
    steps?.forEach((step, index) => {
      if (!step || !isFilled(step.title)) add(`steps[${index}].title`, 'Every workflow phase needs a title.', 'Name the concrete production phase.');
      if (!step || !isFilled(step.text)) add(`steps[${index}].text`, 'Every workflow phase needs explanatory copy.', 'Explain what happens in this phase without generic claims.');
    });
  }
  if (type === 'cameraExplodeScroll') {
    const modelUrl = typeof data.modelUrl === 'string' ? data.modelUrl.trim() : '';
    if (modelUrl && !/^https:\/\/.+\.(glb|gltf)(\?|#|$)/i.test(modelUrl)) add('modelUrl', '3D model must be a public HTTPS .glb or .gltf URL.', 'Upload a GLB/GLTF file to media/blob storage or leave this empty for the built-in 3D camera.');
    const parts = requireRange('parts', 4, 7);
    parts?.forEach((part, index) => {
      if (!part || !isFilled(part.label)) add(`parts[${index}].label`, 'Every camera part needs a label.', 'Name the camera or production layer.');
      if (!part || !isFilled(part.text)) add(`parts[${index}].text`, 'Every camera part needs explanatory copy.', 'Explain the role of this layer in one concise sentence.');
      for (const key of ['offsetX', 'offsetY', 'offsetZ'] as const) {
        if (part?.[key] === undefined && key === 'offsetZ') continue;
        if (typeof part?.[key] !== 'number' || Number(part[key]) < -260 || Number(part[key]) > 260) add(`parts[${index}].${key}`, `${key} must be a number from -260 to 260.`, `Set ${key} as a safe offset for the exploded view.`);
      }
    });
  }

  return issues;
}
