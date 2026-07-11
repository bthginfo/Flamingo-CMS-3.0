import type { PublishResult } from './actions/publish';

function issueLabel(issue: NonNullable<PublishResult['repairQueue']>[number]): string {
  const location = issue.location ? `${issue.location}: ` : '';
  return `${location}${issue.message || issue.code || 'Inhalt prüfen'}`;
}

export function getPublishFailureDescription(result: PublishResult): string | undefined {
  const queue = result.repairQueue || [];
  if (queue.length === 0) return result.code && result.code !== 'PUBLISH_PREFLIGHT_FAILED' ? result.code : undefined;

  const first = issueLabel(queue[0]);
  return queue.length === 1 ? first : `${first} (+${queue.length - 1} weitere Hinweise)`;
}
