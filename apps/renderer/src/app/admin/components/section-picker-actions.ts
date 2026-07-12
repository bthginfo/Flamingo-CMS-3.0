export type SectionPickerActionResult = void | boolean;

/**
 * Normalizes sync and async picker owner actions. Explicit `false` and thrown
 * failures keep the picker open; void/true mean the owner completed the action.
 */
export async function didSectionPickerActionSucceed(
  action: () => SectionPickerActionResult | Promise<SectionPickerActionResult>,
): Promise<boolean> {
  try {
    return (await action()) !== false;
  } catch {
    return false;
  }
}
