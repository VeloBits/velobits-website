import { vi } from "vitest";

/**
 * Mock IntersectionObserver — auto-triggers callback with isIntersecting: true
 */
export function mockIntersectionObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  const MockIO = vi.fn(function (callback: IntersectionObserverCallback) {
    // Immediately fire with isIntersecting: true on next tick
    setTimeout(() => {
      callback(
        [{ isIntersecting: true, target: document.createElement("div") }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver
      );
    }, 0);
    return { observe, unobserve, disconnect };
  });

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIO,
  });

  return { observe, unobserve, disconnect, MockIO };
}

/**
 * Mock window.scrollY and fire scroll event
 */
export function simulateScroll(scrollY: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true });
  window.dispatchEvent(new Event("scroll"));
}
