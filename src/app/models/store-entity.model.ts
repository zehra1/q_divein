import { BehaviorSubject, Observable, combineLatest } from 'rxjs'
import { filter, map, share, shareReplay } from 'rxjs/operators'

export class StoreEntity<T> {
    constructor(
        private _entityInitValue: any,
        private _loadingInitValue: boolean,
        private _sharedObservable?: boolean,
        private _replayCount = 0
    ) {}

    private readonly _data = new BehaviorSubject<T>(this._entityInitValue)
    private readonly _dataDefault = this._data
        .asObservable()
        .pipe(filter((val) => val != null))
    readonly data$ = this._sharedObservable
        ? this._replayCount > 0
            ? this._dataDefault.pipe(shareReplay(this._replayCount))
            : this._dataDefault.pipe(share())
        : this._dataDefault

    private readonly _initialCall = new BehaviorSubject<boolean>(false)
    private readonly initialCall$ = this._initialCall.asObservable()

    private readonly _loading = new BehaviorSubject<boolean>(
        this._loadingInitValue
    )
    readonly loading$ = this._loading.asObservable().pipe(shareReplay(1))

    get showNoData$(): Observable<boolean> {
        return combineLatest([this.initialCall$, this.data$]).pipe(
            map(([initialCall, data]) => {
                return initialCall
                    ? Array.isArray(data)
                        ? data.length === 0
                        : Object.keys(data).length === 0
                    : false
            }),
            shareReplay(1)
        )
    }

    get data(): T {
        return this._data.getValue()
    }

    set data(value: T) {
        if (!this._initialCall.value) {
            this._initialCall.next(true)
        }
        this._data.next(value)
    }

    get loading(): boolean {
        return this._loading.getValue()
    }

    set loading(value: boolean) {
        this._loading.next(value)
    }
}
