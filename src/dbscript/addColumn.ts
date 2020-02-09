export const addColumn = async (connection) => {
    await connection.manager.query('alter table handbook_chapters add column content text');
};