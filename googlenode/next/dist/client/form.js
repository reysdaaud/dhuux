'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = require("react/jsx-runtime");
const _react = require("react");
const _addbasepath = require("./add-base-path");
const _routercontextsharedruntime = require("../shared/lib/router-context.shared-runtime");
const _formshared = require("./form-shared");
const Form = /*#__PURE__*/ (0, _react.forwardRef)(function FormComponent(param, ref) {
    let { replace, scroll, prefetch: prefetchProp, ...props } = param;
    const router = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
    const actionProp = props.action;
    const isNavigatingForm = typeof actionProp === 'string';
    // Validate `action`
    if (process.env.NODE_ENV === 'development') {
        if (isNavigatingForm) {
            (0, _formshared.checkFormActionUrl)(actionProp, 'action');
        }
    }
    // Validate `prefetch`
    if (process.env.NODE_ENV === 'development') {
        if (prefetchProp !== undefined) {
            console.error('Passing `prefetch` to a <Form> has no effect in the pages directory.');
        }
    }
    // Validate `scroll` and `replace`
    if (process.env.NODE_ENV === 'development') {
        if (!isNavigatingForm && (replace !== undefined || scroll !== undefined)) {
            console.error('Passing `replace` or `scroll` to a <Form> whose `action` is a function has no effect.\n' + 'See the relevant docs to learn how to control this behavior for navigations triggered from actions:\n' + '  `router.replace()` - https://nextjs.org/docs/pages/api-reference/functions/use-router#routerreplace\n');
        }
    }
    // Clean up any unsupported form props (and warn if present)
    for (const key of _formshared.DISALLOWED_FORM_PROPS){
        if (key in props) {
            if (process.env.NODE_ENV === 'development') {
                console.error("<Form> does not support changing `" + key + "`.");
            }
            delete props[key];
        }
    }
    if (!isNavigatingForm) {
        return /*#__PURE__*/ (0, _jsxruntime.jsx)("form", {
            ...props,
            ref: ref
        });
    }
    const actionHref = (0, _addbasepath.addBasePath)(actionProp);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("form", {
        ...props,
        ref: ref,
        action: actionHref,
        onSubmit: (event)=>onFormSubmit(event, {
                router,
                actionHref,
                replace,
                scroll,
                onSubmit: props.onSubmit
            })
    });
});
const _default = Form;
function onFormSubmit(event, param) {
    let { actionHref, onSubmit, replace, scroll, router } = param;
    if (typeof onSubmit === 'function') {
        onSubmit(event);
        // if the user called event.preventDefault(), do nothing.
        // (this matches what Link does for `onClick`)
        if (event.defaultPrevented) {
            return;
        }
    }
    if (!router) {
        // Form was somehow used outside of the router (but not in app/, the implementation is forked!).
        // We can't perform a soft navigation, so let the native submit handling do its thing.
        return;
    }
    const formElement = event.currentTarget;
    const submitter = event.nativeEvent.submitter;
    let action = actionHref;
    if (submitter) {
        // this is page-router-only, so we don't need to worry about false positives
        // from the attributes that react adds for server actions.
        if ((0, _formshared.hasUnsupportedSubmitterAttributes)(submitter)) {
            return;
        }
        // client actions have `formAction="javascript:..."`. We obviously can't prefetch/navigate to that.
        if ((0, _formshared.hasReactClientActionAttributes)(submitter)) {
            return;
        }
        // If the submitter specified an alternate formAction,
        // use that URL instead -- this is what a native form would do.
        // NOTE: `submitter.formAction` is unreliable, because it will give us `location.href` if it *wasn't* set
        // NOTE: this should not have `basePath` added, because we can't add it before hydration
        const submitterFormAction = submitter.getAttribute('formAction');
        if (submitterFormAction !== null) {
            if (process.env.NODE_ENV === 'development') {
                (0, _formshared.checkFormActionUrl)(submitterFormAction, 'formAction');
            }
            action = submitterFormAction;
        }
    }
    const targetUrl = (0, _formshared.createFormSubmitDestinationUrl)(action, formElement);
    // Finally, no more reasons for bailing out.
    event.preventDefault();
    const method = replace ? 'replace' : 'push';
    const targetHref = targetUrl.href // TODO: will pages router be happy about an absolute URL here?
    ;
    // TODO(form): Make this use a transition so that pending states work
    //
    // Unlike the app router, pages router doesn't use startTransition,
    // and can't easily be wrapped in one because of implementation details
    // (e.g. it doesn't use any react state)
    // But it's important to have this wrapped in a transition because
    // pending states from e.g. `useFormStatus` rely on that.
    // So this needs some follow up work.
    router[method](targetHref, undefined, {
        scroll
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=form.js.map