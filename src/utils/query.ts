export const parseCountResult = (countResult): number => {
    const count = countResult && countResult.length && countResult[0] && countResult[0].count || 0;
    return parseInt(count, 10);
};