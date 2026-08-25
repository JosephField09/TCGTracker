export function normalisePokemonName(cardName: string): string {
    return cardName
        .toLowerCase()
        .replace(/\b(tag team|vmax|vstar|mega|ex|gx|v)\b|[&♀♂]/gi, " ")
        .replace(/[^a-z\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim()
        .replace(/-+/g, "-");
}