/* eslint-disable camelcase */
export type Payload = Record<string, number | string>;

export type Model = {
    id: number;
} & Record<string, any>;

export type Paginated =
{
    total: number;
    last_page: number;
    first_page: number;
    current_page: number;
    data: Model[];
};

export type UnprocessableEntity = Record<string, Record<string, string[]>>;
