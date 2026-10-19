/** Move keyboard reading order out of the skipped story as well as scrolling. */
export function focusAfterCinematicStory(story: HTMLElement, reduceMotion: boolean): boolean {
  const section = story.closest('[data-section-id]') || story;
  let next = section.nextElementSibling;
  while (next && !next.matches('[data-section-id]')) next = next.nextElementSibling;
  if (!(next instanceof HTMLElement)) return false;
  const target = next.querySelector<HTMLElement>('h1,h2,h3,[role="heading"]') || next;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  // A compact following section can place its heading less than the header
  // offset below the story. Do not leave part of the skipped story in view.
  const storyBottom = window.scrollY + section.getBoundingClientRect().bottom;
  window.scrollTo({
    top: Math.max(storyBottom, window.scrollY + target.getBoundingClientRect().top - 112),
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
  return true;
}
