export type PublishAuditIssue = {
  severity?: string;
  code?: string;
  location?: string;
  message?: string;
  repair?: unknown;
};

export type PublishAuditSummary = {
  contentErrors?: number;
  contentWarnings?: number;
  colorErrors?: number;
  colorWarnings?: number;
  qualityWarnings?: number;
  [key: string]: number | undefined;
};

function count(value: number | undefined): number {
  return Number.isFinite(value) && (value || 0) > 0 ? value as number : 0;
}

/**
 * Publishing is blocked by structurally invalid content and unsafe colors.
 * Editorial recommendations remain advisory, even when there are many of them.
 */
export function isStoredContentReadyToPublish(summary: PublishAuditSummary): boolean {
  return count(summary.contentErrors) === 0
    && count(summary.colorErrors) === 0;
}

export function partitionPublishAuditIssues(
  contentIssues: PublishAuditIssue[] = [],
  colorIssues: PublishAuditIssue[] = [],
): { blockers: PublishAuditIssue[]; advisories: PublishAuditIssue[] } {
  return {
    blockers: [
      ...contentIssues.filter(issue => issue.severity === 'error'),
      ...colorIssues.filter(issue => issue.severity === 'error'),
    ],
    advisories: [
      ...contentIssues.filter(issue => issue.severity === 'warning'),
      ...colorIssues.filter(issue => issue.severity === 'warning'),
    ],
  };
}
