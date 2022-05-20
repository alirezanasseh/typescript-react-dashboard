import React, {useEffect, useState} from 'react';
import {Pagination} from 'react-bootstrap';
import {IPaginationProps} from './types';

export const ListPagination = (props: IPaginationProps) => {
    const {page, pageSize, count} = props.pagination;
    const [items, setItems] = useState<Array<JSX.Element>>();

    const changePage = (number: number) => {
        if (number === page) return;
        props.setPagination({...props.pagination, page: number});
    };

    const paginate = () => {
        const pages = Math.ceil(count / pageSize);

        let ary = [];
        if (pages <= 20) {
            for (let number = 1; number <= pages; number++) {
                ary.push(
                    <Pagination.Item
                        key={number}
                        active={number === page}
                        onClick={() => changePage(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            if (page <= 3) {
                // First pages
                for (let number = 1; number <= page + 2; number++) {
                    ary.push(
                        <Pagination.Item
                            key={number}
                            active={number === page}
                            onClick={() => changePage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                ary.push(<Pagination.Ellipsis/>);
                ary.push(<Pagination.Next onClick={() => changePage(page + 1)}/>);
                ary.push(<Pagination.Last onClick={() => changePage(pages)}/>);
            } else if (pages - page <= 3) {
                // Last pages
                ary.push(<Pagination.First onClick={() => changePage(1)}/>);
                ary.push(<Pagination.Prev onClick={() => changePage(page - 1)}/>);
                ary.push(<Pagination.Ellipsis/>);
                for (let number = page - 2; number <= pages; number++) {
                    ary.push(
                        <Pagination.Item
                            key={number}
                            active={number === page}
                            onClick={() => changePage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
            } else {
                // Middle pages
                ary.push(<Pagination.First onClick={() => changePage(1)}/>);
                ary.push(<Pagination.Prev onClick={() => changePage(page - 1)}/>);
                ary.push(<Pagination.Ellipsis/>);
                for (let number = page - 2; number <= page + 2; number++) {
                    ary.push(
                        <Pagination.Item
                            key={number}
                            active={number === page}
                            onClick={() => changePage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                ary.push(<Pagination.Ellipsis/>);
                ary.push(<Pagination.Next onClick={() => changePage(page + 1)}/>);
                ary.push(<Pagination.Last onClick={() => changePage(pages)}/>);
            }
        }
        setItems(ary);
    };
    useEffect(paginate, [page, pageSize, count]);

    return (
        <div className={'list-pagination-container'}>
            <Pagination>
                {items}
            </Pagination>
        </div>
    );
};