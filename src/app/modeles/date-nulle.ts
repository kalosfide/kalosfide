export const DATE_NULLE = new Date(1970, 0, 1);

export const DATE_EST_NULLE: (date: Date) => boolean = (date: Date) => {
    const d = new Date(date);
    return d.getDate() === 1 && d.getMonth() === 0 && d.getFullYear() === 1970;
};
