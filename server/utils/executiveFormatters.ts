export function formatExecutiveCurrency(amount: number): string {
  if (amount === 0) {
    return 'No active deals in this category';
  }
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    return `$${millions.toFixed(2)}M`;
  }
  if (amount >= 1000) {
    const thousands = Math.round(amount / 1000);
    return `$${thousands.toLocaleString('en-US')}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatExecutiveText(text: string): string {
  if (!text) return text;

  let formatted = text;

  // 1. Replace zero-value currency expressions like "$0.0k", "$0.00k", "$0k", "0.0k", "0.00k"
  formatted = formatted.replace(/\$0\.0+k|\$0k|0\.0+k\b/gi, 'No active deals in this category');

  // 2. Convert values of 1000k or more ($1000k, $15795.0k, $7425.0k) to Millions ($XX.XXM)
  // and values under 1000k to $XXk with proper comma separators
  formatted = formatted.replace(/\$([0-9,]+(?:\.[0-9]+)?)k\b/gi, (match, numStr) => {
    const cleanNum = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(cleanNum)) return match;

    if (cleanNum === 0) {
      return 'No active deals in this category';
    }

    if (cleanNum >= 1000) {
      const millions = cleanNum / 1000;
      return `$${millions.toFixed(2)}M`;
    } else {
      const valueInK = Math.round(cleanNum);
      return `$${valueInK.toLocaleString('en-US')}k`;
    }
  });

  // 3. Match raw large currency values if present, e.g., $15795000 or $15,795,000
  formatted = formatted.replace(/\$([0-9]{1,3}(?:,[0-9]{3})+|\d{7,})\b/g, (match, numStr) => {
    const rawVal = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(rawVal)) return match;
    if (rawVal >= 1000000) {
      const millions = rawVal / 1000000;
      return `$${millions.toFixed(2)}M`;
    } else if (rawVal >= 1000) {
      const thousands = Math.round(rawVal / 1000);
      return `$${thousands.toLocaleString('en-US')}k`;
    }
    return match;
  });

  return formatted;
}
