import React, { FC } from 'react';
import { objectToQueryString } from '../objectToQueryString';
import { Link } from 'react-router-dom';

type Props = {
    id?: string,
    queryParams: object,
    pathname?: string,
    disabled?: boolean
}

export const RouterButton: FC<Props> = ({
    id,
    queryParams,
    pathname,
    children,
    disabled = false
}) => {
    let className = 'button';
    if (disabled) {
        className += ' disabled';
    }
    return (
        <Link
            id={ id }
            className={ className }
            to={
                {
                    pathname: pathname,
                    search: objectToQueryString(queryParams)
                }
            }>
            { children }
        </Link>
    );
};
