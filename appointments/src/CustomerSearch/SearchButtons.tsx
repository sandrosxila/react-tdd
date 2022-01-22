import React, { FC, useCallback } from 'react';
import { RouterButton } from './RouterButton';
import ToggleRouterButton from './ToggleRouterButton';

type Customer = {
    id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

type Props = { 
    customers: Customer[],
    searchTerm: string,
    limit?: number,
    lastRowIds: string[],
    pathname: string
}

export const SearchButtons: FC<Props> = ({
    customers,
    searchTerm,
    limit = 10,
    lastRowIds,
    pathname
}) => {
    
    const nextPageParams = useCallback(() => {
        const newLastRowIds =
          customers.length > 1
              ? [...lastRowIds, customers[customers.length - 1].id]
              : lastRowIds;
    
        return { limit, searchTerm, lastRowIds: newLastRowIds };
    }, [searchTerm, lastRowIds, limit, customers]);

    const previousPageParams = useCallback(
        () => ({
            limit,
            searchTerm,
            lastRowIds: lastRowIds.slice(0, -1)
        }),
        [searchTerm, lastRowIds, limit]
    );
    
    const limitParams = useCallback(
        newLimit => ({
            limit: newLimit,
            searchTerm,
            lastRowIds
        }),
        [searchTerm, lastRowIds]
    );
    
    const hasNext = customers.length === limit;
    const hasPrevious = lastRowIds.length > 0;

    return (
        <div className="button-bar">
            <ToggleRouterButton
                id="limit-10"
                toggled={ limit === 10 }
                queryParams={ limitParams(10) }
                pathname={ pathname }>
                10
            </ToggleRouterButton>
            <ToggleRouterButton
                id="limit-20"
                toggled={ limit === 20 }
                queryParams={ limitParams(20) }
                pathname={ pathname }>
                20
            </ToggleRouterButton>
            <ToggleRouterButton
                id="limit-50"
                toggled={ limit === 50 }
                queryParams={ limitParams(50) }
                pathname={ pathname }>
                50
            </ToggleRouterButton>
            <ToggleRouterButton
                id="limit-100"
                toggled={ limit === 100 }
                queryParams={ limitParams(100) }
                pathname={ pathname }>
                100
            </ToggleRouterButton>
            <RouterButton
                id="previous-page"
                queryParams={ previousPageParams() }
                disabled={ !hasPrevious }
                pathname={ pathname }>
                Previous
            </RouterButton>
            <RouterButton
                id="next-page"
                queryParams={ nextPageParams() }
                disabled={ !hasNext }
                pathname={ pathname }>
                Next
            </RouterButton>
        </div>
    );
};

export default SearchButtons;