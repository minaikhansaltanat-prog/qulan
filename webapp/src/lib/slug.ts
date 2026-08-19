const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "i", і: "i", к: "k", қ: "q", л: "l", м: "m",
  н: "n", ң: "ng", о: "o", ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ұ: "u", ү: "u", ф: "f", х: "h", һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
