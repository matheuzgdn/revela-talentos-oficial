import { useEffect } from 'react';

const SUSPICIOUS_TEXT_PATTERN = /Ã|â|ðŸ|Â|�/;

const EXACT_REPLACEMENTS = [
  ['�aLTIMAS', 'ÚLTIMAS'],
  ['�altimas', 'Últimas'],
  ['�altimos', 'Últimos'],
  ['�altimo', 'Último'],
  ['�aMEROS', 'NÚMEROS'],
  ['POSI�!ÒO', 'POSIÇÃO'],
  ['INSCRI�!ÒO', 'INSCRIÇÃO'],
  ['REPRODU�!ÒO', 'REPRODUÇÃO'],
  ['FUN�!�"ES', 'FUNÇÕES'],
  ['ATENCI�\u001cN', 'ATENCIÓN'],
  ['Seg�\u001cSex', 'Seg-Sex'],
  [' �\u001d ', ' - '],
  ['�x!��x!� ', ''],
  ['�x}0 ', ''],
  ['�x\u001d� ', ''],
  ['�x\u0018� ', ''],
  ['�x\u0019� ', ''],
  ['�x\u001c� ', ''],
  ['�x� ', ''],
  ['�xR� ', ''],
  ['�x\u00189 ', ''],
  ['�S& ', ''],
  ['�S\u001c ', ''],
  ['�S\u0014 ', ''],
  ['�0 ', ''],
  ['�a� ', ''],
  ['�R ', ''],
];

const textDecoder = typeof TextDecoder !== 'undefined'
  ? new TextDecoder('utf-8', { fatal: false })
  : null;

function applyExactReplacements(value) {
  let nextValue = value;

  for (const [from, to] of EXACT_REPLACEMENTS) {
    nextValue = nextValue.split(from).join(to);
  }

  return nextValue;
}

function suspiciousScore(value) {
  return (value.match(/Ã|â|ðŸ|Â|�/g) || []).length;
}

function decodeLatin1AsUtf8(value) {
  if (!textDecoder || !value) return value;

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
    return textDecoder.decode(bytes);
  } catch {
    return value;
  }
}

export function repairMojibakeText(value) {
  if (typeof value !== 'string' || !value || !SUSPICIOUS_TEXT_PATTERN.test(value)) {
    return value;
  }

  let nextValue = applyExactReplacements(value);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const decoded = applyExactReplacements(decodeLatin1AsUtf8(nextValue));

    if (!decoded || decoded === nextValue) break;
    if (suspiciousScore(decoded) > suspiciousScore(nextValue)) break;

    nextValue = decoded;
  }

  nextValue = applyExactReplacements(nextValue)
    .replace(/(^|\s)�[^\s]{0,4}(?=\s|$)/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return nextValue;
}

function normalizeElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
  if (element.closest('script, style')) return;

  ['placeholder', 'title', 'aria-label', 'alt'].forEach((attributeName) => {
    const currentValue = element.getAttribute(attributeName);

    if (!currentValue || !SUSPICIOUS_TEXT_PATTERN.test(currentValue)) return;

    const repairedValue = repairMojibakeText(currentValue);

    if (repairedValue && repairedValue !== currentValue) {
      element.setAttribute(attributeName, repairedValue);
    }
  });

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    if (
      currentNode.nodeValue &&
      SUSPICIOUS_TEXT_PATTERN.test(currentNode.nodeValue) &&
      currentNode.parentElement &&
      !currentNode.parentElement.closest('script, style')
    ) {
      const repairedValue = repairMojibakeText(currentNode.nodeValue);

      if (repairedValue && repairedValue !== currentNode.nodeValue) {
        currentNode.nodeValue = repairedValue;
      }
    }

    currentNode = walker.nextNode();
  }
}

export default function MojibakeTextGuard() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const runNormalization = (target = document.body) => {
      if (!target) return;
      normalizeElement(target);
    };

    runNormalization();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.parentElement) {
          normalizeElement(mutation.target.parentElement);
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            normalizeElement(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            normalizeElement(node.parentElement);
          }
        });
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
