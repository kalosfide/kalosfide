
export function groupePar<T, TKey>(liste: T[], propriété: (item: T) => TKey): Map<TKey, T[]> {
    const map = new Map<TKey, T[]>();
    liste.forEach((item: T) => {
        const clé: TKey = propriété(item);
        const avecClé: T[] = map.get(clé);
        if (!avecClé) {
            map.set(clé, [item]);
        } else {
            avecClé.push(item);
        }
    });
    return map;
}
