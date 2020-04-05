
export function compareMinuscules(s1: string, s2: string): number {
    const n1 = s1.toLocaleLowerCase();
    const n2 = s2.toLocaleLowerCase();
    return n1 < n2 ? -1 : n1 === n2 ? 0 : 1;
}
