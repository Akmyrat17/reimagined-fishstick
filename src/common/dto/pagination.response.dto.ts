export class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export class PaginationResponse<T> {
    data: T[];
    meta: PaginationMeta;

    constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        };
    }
}

export class UsersPaginationResponse extends PaginationResponse<any> {
    constructor(data: any[], total: number, page: number, limit: number) {
        super(data, total, page, limit);
    }
}