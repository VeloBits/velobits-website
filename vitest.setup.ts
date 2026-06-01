import "@testing-library/jest-dom";
import { vi } from "vitest";

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
