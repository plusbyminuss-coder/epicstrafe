import { JSX, useCallback } from "react";
import { Pagination, PaginationItem, PaginationRenderItemParams, TablePaginationActionsProps, useMediaQuery } from "@mui/material";
import { gridPageCountSelector, useGridApiContext } from "@mui/x-data-grid";
import { useGridSelector } from "@mui/x-data-grid/internals";
import { numDigits } from "../../../common/utils";
import SimpleNumberField from "../../forms/SimpleNumberField";

interface NumberGridPaginationProps extends TablePaginationActionsProps {
    rowCount: number
}

function NumberGridPagination(props: NumberGridPaginationProps) {
    const { page, className, rowCount } = props;

    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const screen390px = useMediaQuery(`@media screen and (max-width: 390px)`);
    const screen410px = useMediaQuery(`@media screen and (max-width: 410px)`);
    const screen430px = useMediaQuery(`@media screen and (max-width: 430px)`);
    const smallScreen = useMediaQuery(`@media screen and (max-width: 530px)`);

    const rowDigits = numDigits(rowCount);
    let showPageInput = !screen390px;
    if (rowDigits > 5) showPageInput = !screen430px;
    else if (rowDigits > 4) showPageInput = !screen410px;

    const changePage = useCallback((newPage: number) => {
        const lastPage = Math.max(0, pageCount - 1);
        apiRef.current.setPage(Math.max(0, Math.min(newPage, lastPage)));
    }, [apiRef, pageCount]);

    const renderItem = useCallback((item: PaginationRenderItemParams): JSX.Element | null => {

        if (item.selected && showPageInput) {

            const width = numDigits(pageCount) * 8 + 28;
            return (
                <SimpleNumberField
                    size="small"
                    disabled={pageCount <= 1}
                    sx={{
                        width: `${width}px`,
                        "& input": {
                            textAlign: "center",
                            height: "20px",
                            fontSize: "14px"
                        }
                    }}
                    value={page + 1}
                    onValueChange={(value) => {
                        const newPage = value - 1;
                        changePage(newPage);
                        return Math.max(1, Math.min(value, pageCount));
                    }}
                    max={pageCount}
                />
            );
        }


        if (item.type === "page" || item.type === "start-ellipsis" || item.type === "end-ellipsis") {
            return null;
        }


        return <PaginationItem {...item} />;
    }, [changePage, page, pageCount, showPageInput]);

    return (
        <Pagination
            className={className}
            count={pageCount}
            page={page + 1}
            showFirstButton={!smallScreen}
            showLastButton={!smallScreen}
            siblingCount={0}
            boundaryCount={0}
            onChange={(event, newPage) => changePage(newPage - 1)}
            renderItem={renderItem}
        />
    );
}

export default NumberGridPagination;
