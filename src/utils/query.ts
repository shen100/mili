export const parseCountResult = (countResult): number => {
    const count = countResult && countResult.length && countResult[0] && parseInt(countResult[0].count, 10) || 0;
    return count;
};