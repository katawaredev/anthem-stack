import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import {
  getTranslationConfig,
  TranslationProvider,
} from "packages/translation";

function hydrate() {
  getTranslationConfig().then((translationConfig) => {
    React.startTransition(() => {
      hydrateRoot(
        document,
        <React.StrictMode>
          <TranslationProvider config={translationConfig}>
            <RemixBrowser />
          </TranslationProvider>
        </React.StrictMode>
      );
    });
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
