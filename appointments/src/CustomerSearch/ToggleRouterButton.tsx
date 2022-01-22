import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { objectToQueryString } from '../objectToQueryString';

type Props = {
    id?: string,
    queryParams: object,
    pathname?: string,
    toggled: boolean
}

const ToggleRouterButton: FC<Props> = ({ 
    id,
    queryParams,
    pathname,
    children,
    toggled,
}) => {
    let className = 'toggle-button';
    if (toggled) {
        className += ' toggled';
    }
    return (
        <Link 
            id={ id }
            className={ className }
            to={
                {
                    pathname,
                    search: objectToQueryString(queryParams)
                }
            }
        >
            { children }
        </Link>
    );
};

export default ToggleRouterButton;