var _process_env___NEXT_DEV_INDICATOR;
import { useReducer } from 'react';
export const ACTION_STATIC_INDICATOR = 'static-indicator';
export const ACTION_BUILD_OK = 'build-ok';
export const ACTION_BUILD_ERROR = 'build-error';
export const ACTION_BEFORE_REFRESH = 'before-fast-refresh';
export const ACTION_REFRESH = 'fast-refresh';
export const ACTION_VERSION_INFO = 'version-info';
export const ACTION_UNHANDLED_ERROR = 'unhandled-error';
export const ACTION_UNHANDLED_REJECTION = 'unhandled-rejection';
export const ACTION_DEBUG_INFO = 'debug-info';
export const ACTION_DEV_INDICATOR = 'dev-indicator';
export const STORAGE_KEY_THEME = '__nextjs-dev-tools-theme';
export const STORAGE_KEY_POSITION = '__nextjs-dev-tools-position';
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e)=>{
            // Filter out duplicate errors
            return e.event.reason.stack !== err.event.reason.stack;
        }),
        err
    ];
}
const shouldDisableDevIndicator = ((_process_env___NEXT_DEV_INDICATOR = process.env.__NEXT_DEV_INDICATOR) == null ? void 0 : _process_env___NEXT_DEV_INDICATOR.toString()) === 'false';
export const INITIAL_OVERLAY_STATE = {
    nextId: 1,
    buildError: null,
    errors: [],
    notFound: false,
    staticIndicator: false,
    // To prevent flickering, set the initial state to disabled.
    disableDevIndicator: true,
    refreshState: {
        type: 'idle'
    },
    rootLayoutMissingTags: [],
    versionInfo: {
        installed: '0.0.0',
        staleness: 'unknown'
    },
    debugInfo: {
        devtoolsFrontendUrl: undefined
    }
};
function getInitialState(routerType) {
    return {
        ...INITIAL_OVERLAY_STATE,
        routerType
    };
}
export function useErrorOverlayReducer(routerType) {
    return useReducer((_state, action)=>{
        switch(action.type){
            case ACTION_DEBUG_INFO:
                {
                    return {
                        ..._state,
                        debugInfo: action.debugInfo
                    };
                }
            case ACTION_STATIC_INDICATOR:
                {
                    return {
                        ..._state,
                        staticIndicator: action.staticIndicator
                    };
                }
            case ACTION_BUILD_OK:
                {
                    return {
                        ..._state,
                        buildError: null
                    };
                }
            case ACTION_BUILD_ERROR:
                {
                    return {
                        ..._state,
                        buildError: action.message
                    };
                }
            case ACTION_BEFORE_REFRESH:
                {
                    return {
                        ..._state,
                        refreshState: {
                            type: 'pending',
                            errors: []
                        }
                    };
                }
            case ACTION_REFRESH:
                {
                    return {
                        ..._state,
                        buildError: null,
                        errors: // Errors can come in during updates. In this case, UNHANDLED_ERROR
                        // and UNHANDLED_REJECTION events might be dispatched between the
                        // BEFORE_REFRESH and the REFRESH event. We want to keep those errors
                        // around until the next refresh. Otherwise we run into a race
                        // condition where those errors would be cleared on refresh completion
                        // before they can be displayed.
                        _state.refreshState.type === 'pending' ? _state.refreshState.errors : [],
                        refreshState: {
                            type: 'idle'
                        }
                    };
                }
            case ACTION_UNHANDLED_ERROR:
            case ACTION_UNHANDLED_REJECTION:
                {
                    switch(_state.refreshState.type){
                        case 'idle':
                            {
                                return {
                                    ..._state,
                                    nextId: _state.nextId + 1,
                                    errors: pushErrorFilterDuplicates(_state.errors, {
                                        id: _state.nextId,
                                        event: action
                                    })
                                };
                            }
                        case 'pending':
                            {
                                return {
                                    ..._state,
                                    nextId: _state.nextId + 1,
                                    refreshState: {
                                        ..._state.refreshState,
                                        errors: pushErrorFilterDuplicates(_state.refreshState.errors, {
                                            id: _state.nextId,
                                            event: action
                                        })
                                    }
                                };
                            }
                        default:
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const _ = _state.refreshState;
                            return _state;
                    }
                }
            case ACTION_VERSION_INFO:
                {
                    return {
                        ..._state,
                        versionInfo: action.versionInfo
                    };
                }
            case ACTION_DEV_INDICATOR:
                {
                    return {
                        ..._state,
                        disableDevIndicator: shouldDisableDevIndicator || !!action.devIndicator.disabledUntil
                    };
                }
            default:
                {
                    return _state;
                }
        }
    }, getInitialState(routerType));
}
export const REACT_REFRESH_FULL_RELOAD_FROM_ERROR = '[Fast Refresh] performing full reload because your application had an unrecoverable error';

//# sourceMappingURL=shared.js.map