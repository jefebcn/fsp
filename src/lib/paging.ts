export const PER_PAGE = 12;
export const pageCount = (n: number) => Math.max(1, Math.ceil(n / PER_PAGE));
export const slice = <T,>(list: T[], page: number) => list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
