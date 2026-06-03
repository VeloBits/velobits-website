import "@testing-library/jest-dom";
import { vi } from "vitest";

// Server-only suites opt into the node environment (`// @vitest-environment node`),
// where there is no `window`. The DOM mocks below are jsdom-only — skip them there.
if (typeof window !== "undefined") {
  registerDomMocks();
}

function registerDomMocks() {
  // Global IntersectionObserver mock — must use regular function (not arrow) to be a valid constructor
  const _ioObserve = vi.fn();
  const _ioUnobserve = vi.fn();
  const _ioDisconnect = vi.fn();

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: vi.fn(function (callback: IntersectionObserverCallback) {
      setTimeout(() => {
        callback(
          [
            { isIntersecting: true, target: document.createElement("div") },
          ] as unknown as IntersectionObserverEntry[],
          {} as IntersectionObserver
        );
      }, 0);
      return { observe: _ioObserve, unobserve: _ioUnobserve, disconnect: _ioDisconnect };
    }),
  });

  // jsdom doesn't implement matchMedia; mock it so media-query-driven effects don't throw.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
