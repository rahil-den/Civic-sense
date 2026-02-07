export const paginate = (model, query, page = 1, limit = 20) => {
    // Ensuring basic sanity
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap limit at 100
    const skip = (pageNum - 1) * limitNum;

    return {
        skip,
        limit: limitNum,
        page: pageNum
    };
};

export const formatPaginationResponse = (data, total, page, limit) => {
    return {
        data,
        meta: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};
