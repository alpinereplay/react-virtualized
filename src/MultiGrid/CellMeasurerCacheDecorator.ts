import { CellMeasurerCache } from "../CellMeasurer"
type CellMeasurerCacheDecoratorParams = {
    cellMeasurerCache: CellMeasurerCache | undefined
    columnIndexOffset: number
    rowIndexOffset: number
}
type IndexParam = {
    index: number
}
/**
 * Caches measurements for a given cell.
 */

export default class CellMeasurerCacheDecorator {
    _cellMeasurerCache: CellMeasurerCache | undefined
    _columnIndexOffset: number
    _rowIndexOffset: number

    constructor(
        params: CellMeasurerCacheDecoratorParams = {
            cellMeasurerCache: undefined,
            columnIndexOffset: 0,
            rowIndexOffset: 0,
        }
    ) {
        const {
            cellMeasurerCache,
            columnIndexOffset = 0,
            rowIndexOffset = 0,
        } = params
        this._cellMeasurerCache = cellMeasurerCache
        this._columnIndexOffset = columnIndexOffset
        this._rowIndexOffset = rowIndexOffset
    }

    clear(rowIndex: number, columnIndex: number): void {
        this._cellMeasurerCache?.clear(
            rowIndex + this._rowIndexOffset,
            columnIndex + this._columnIndexOffset
        )
    }

    clearAll(): void {
        this._cellMeasurerCache?.clearAll()
    }

    columnWidth = ({ index }: IndexParam) => {
        this._cellMeasurerCache?.columnWidth({
            index: index + this._columnIndexOffset,
        })
    }

    get defaultHeight(): number {
        return this._cellMeasurerCache?.defaultHeight ?? 0
    }

    get defaultWidth(): number {
        return this._cellMeasurerCache?.defaultWidth ?? 0
    }

    hasFixedHeight(): boolean {
        return this._cellMeasurerCache?.hasFixedHeight() ?? false
    }

    hasFixedWidth(): boolean {
        return this._cellMeasurerCache?.hasFixedWidth() ?? false
    }

    getHeight(
        rowIndex: number,
        columnIndex: number | null | undefined = 0
    ): number | null | undefined {
        let cio: number = this._columnIndexOffset ?? 0
        let ci: number = columnIndex ?? 0
        return this._cellMeasurerCache?.getHeight(
            rowIndex + this._rowIndexOffset,
            ci + cio
        )
    }

    getWidth(
        rowIndex: number,
        columnIndex: number | null | undefined = 0
    ): number | null | undefined {
        let cio: number = this._columnIndexOffset ?? 0
        let ci: number = columnIndex ?? 0
        return this._cellMeasurerCache?.getWidth(
            rowIndex + this._rowIndexOffset,
            ci + cio
        )
    }

    has(rowIndex: number, columnIndex: number | null | undefined = 0): boolean {
        let cio: number = this._columnIndexOffset ?? 0
        let ci: number = columnIndex ?? 0
        return (
            this._cellMeasurerCache?.has(
                rowIndex + this._rowIndexOffset,
                ci + cio
            ) ?? false
        )
    }

    rowHeight = ({ index }: IndexParam) => {
        this._cellMeasurerCache?.rowHeight({
            index: index + this._rowIndexOffset,
        })
    }

    set(
        rowIndex: number,
        columnIndex: number,
        width: number,
        height: number
    ): void {
        this._cellMeasurerCache?.set(
            rowIndex + this._rowIndexOffset,
            columnIndex + this._columnIndexOffset,
            width as number,
            height as number
        )
    }
}
