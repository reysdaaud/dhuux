'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useEffect, useCallback, useContext, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import Head from '../../shared/lib/head';
import { imageConfigDefault, VALID_LOADERS } from '../../shared/lib/image-config';
import { useIntersection } from '../use-intersection';
import { ImageConfigContext } from '../../shared/lib/image-config-context.shared-runtime';
import { warnOnce } from '../../shared/lib/utils/warn-once';
import { normalizePathTrailingSlash } from '../normalize-trailing-slash';
function normalizeSrc(src) {
    return src[0] === '/' ? src.slice(1) : src;
}
const supportsFloat = typeof ReactDOM.preload === 'function';
const DEFAULT_Q = 75;
const configEnv = process.env.__NEXT_IMAGE_OPTS;
const loadedImageURLs = new Set();
const allImgs = new Map();
let perfObserver;
const emptyDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
if (typeof window === 'undefined') {
    ;
    globalThis.__NEXT_IMAGE_IMPORTED = true;
}
const VALID_LOADING_VALUES = [
    'lazy',
    'eager',
    undefined
];
function imgixLoader(param) {
    let { config, src, width, quality } = param;
    // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
    const url = new URL("" + config.path + normalizeSrc(src));
    const params = url.searchParams;
    // auto params can be combined with comma separation, or reiteration
    params.set('auto', params.getAll('auto').join(',') || 'format');
    params.set('fit', params.get('fit') || 'max');
    params.set('w', params.get('w') || width.toString());
    if (quality) {
        params.set('q', quality.toString());
    }
    return url.href;
}
function akamaiLoader(param) {
    let { config, src, width } = param;
    return "" + config.path + normalizeSrc(src) + "?imwidth=" + width;
}
function cloudinaryLoader(param) {
    let { config, src, width, quality } = param;
    // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
    const params = [
        'f_auto',
        'c_limit',
        'w_' + width,
        'q_' + (quality || 'auto')
    ];
    const paramsString = params.join(',') + '/';
    return "" + config.path + paramsString + normalizeSrc(src);
}
function customLoader(param) {
    let { src } = param;
    throw Object.defineProperty(new Error('Image with src "' + src + '" is missing "loader" prop.' + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader"), "__NEXT_ERROR_CODE", {
        value: "E252",
        enumerable: false,
        configurable: true
    });
}
function defaultLoader(param) {
    let { config, src, width, quality } = param;
    var _config_qualities;
    if (process.env.NODE_ENV !== 'production') {
        const missingValues = [];
        // these should always be provided but make sure they are
        if (!src) missingValues.push('src');
        if (!width) missingValues.push('width');
        if (missingValues.length > 0) {
            throw Object.defineProperty(new Error("Next Image Optimization requires " + missingValues.join(', ') + " to be provided. Make sure you pass them as props to the `next/image` component. Received: " + JSON.stringify({
                src,
                width,
                quality
            })), "__NEXT_ERROR_CODE", {
                value: "E188",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('//')) {
            throw Object.defineProperty(new Error('Failed to parse src "' + src + '" on `next/image`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)'), "__NEXT_ERROR_CODE", {
                value: "E360",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('/') && config.localPatterns) {
            if (process.env.NODE_ENV !== 'test' && // micromatch isn't compatible with edge runtime
            process.env.NEXT_RUNTIME !== 'edge') {
                // We use dynamic require because this should only error in development
                const { hasLocalMatch } = require('../../shared/lib/match-local-pattern');
                if (!hasLocalMatch(config.localPatterns, src)) {
                    throw Object.defineProperty(new Error("Invalid src prop (" + src + ") on `next/image` does not match `images.localPatterns` configured in your `next.config.js`\n" + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns"), "__NEXT_ERROR_CODE", {
                        value: "E426",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (!src.startsWith('/') && (config.domains || config.remotePatterns)) {
            let parsedSrc;
            try {
                parsedSrc = new URL(src);
            } catch (err) {
                console.error(err);
                throw Object.defineProperty(new Error('Failed to parse src "' + src + '" on `next/image`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)'), "__NEXT_ERROR_CODE", {
                    value: "E63",
                    enumerable: false,
                    configurable: true
                });
            }
            if (process.env.NODE_ENV !== 'test' && // micromatch isn't compatible with edge runtime
            process.env.NEXT_RUNTIME !== 'edge') {
                // We use dynamic require because this should only error in development
                const { hasRemoteMatch } = require('../../shared/lib/match-remote-pattern');
                if (!hasRemoteMatch(config.domains, config.remotePatterns, parsedSrc)) {
                    throw Object.defineProperty(new Error("Invalid src prop (" + src + ') on `next/image`, hostname "' + parsedSrc.hostname + '" is not configured under images in your `next.config.js`\n' + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host"), "__NEXT_ERROR_CODE", {
                        value: "E231",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (quality && config.qualities && !config.qualities.includes(quality)) {
            throw Object.defineProperty(new Error("Invalid quality prop (" + quality + ") on `next/image` does not match `images.qualities` configured in your `next.config.js`\n" + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-qualities"), "__NEXT_ERROR_CODE", {
                value: "E623",
                enumerable: false,
                configurable: true
            });
        }
    }
    const q = quality || ((_config_qualities = config.qualities) == null ? void 0 : _config_qualities.reduce((prev, cur)=>Math.abs(cur - DEFAULT_Q) < Math.abs(prev - DEFAULT_Q) ? cur : prev)) || DEFAULT_Q;
    if (!config.dangerouslyAllowSVG && src.split('?', 1)[0].endsWith('.svg')) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        return src;
    }
    return normalizePathTrailingSlash(config.path) + "?url=" + encodeURIComponent(src) + "&w=" + width + "&q=" + q;
}
const loaders = new Map([
    [
        'default',
        defaultLoader
    ],
    [
        'imgix',
        imgixLoader
    ],
    [
        'cloudinary',
        cloudinaryLoader
    ],
    [
        'akamai',
        akamaiLoader
    ],
    [
        'custom',
        customLoader
    ]
]);
const VALID_LAYOUT_VALUES = [
    'fill',
    'fixed',
    'intrinsic',
    'responsive',
    undefined
];
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}
function getWidths(param, width, layout, sizes) {
    let { deviceSizes, allSizes } = param;
    if (sizes && (layout === 'fill' || layout === 'responsive')) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for(let match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            const smallestRatio = Math.min(...percentSizes) * 0.01;
            return {
                widths: allSizes.filter((s)=>s >= deviceSizes[0] * smallestRatio),
                kind: 'w'
            };
        }
        return {
            widths: allSizes,
            kind: 'w'
        };
    }
    if (typeof width !== 'number' || layout === 'fill' || layout === 'responsive') {
        return {
            widths: deviceSizes,
            kind: 'w'
        };
    }
    const widths = [
        ...new Set(// > This means that most OLED screens that say they are 3x resolution,
        // > are actually 3x in the green color, but only 1.5x in the red and
        // > blue colors. Showing a 3x resolution image in the app vs a 2x
        // > resolution image will be visually the same, though the 3x image
        // > takes significantly more data. Even true 3x resolution screens are
        // > wasteful as the human eye cannot see that level of detail without
        // > something like a magnifying glass.
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [
            width,
            width * 2 /*, width * 3*/ 
        ].map((w)=>allSizes.find((p)=>p >= w) || allSizes[allSizes.length - 1]))
    ];
    return {
        widths,
        kind: 'x'
    };
}
function generateImgAttrs(param) {
    let { config, src, unoptimized, layout, width, quality, sizes, loader } = param;
    if (unoptimized) {
        return {
            src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    const { widths, kind } = getWidths(config, width, layout, sizes);
    const last = widths.length - 1;
    return {
        sizes: !sizes && kind === 'w' ? '100vw' : sizes,
        srcSet: widths.map((w, i)=>loader({
                config,
                src,
                quality,
                width: w
            }) + " " + (kind === 'w' ? w : i + 1) + kind).join(', '),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            config,
            src,
            quality,
            width: widths[last]
        })
    };
}
function getInt(x) {
    if (typeof x === 'number') {
        return x;
    }
    if (typeof x === 'string') {
        return parseInt(x, 10);
    }
    return undefined;
}
function defaultImageLoader(loaderProps) {
    var _loaderProps_config;
    const loaderKey = ((_loaderProps_config = loaderProps.config) == null ? void 0 : _loaderProps_config.loader) || 'default';
    const load = loaders.get(loaderKey);
    if (load) {
        return load(loaderProps);
    }
    throw Object.defineProperty(new Error('Unknown "loader" found in "next.config.js". Expected: ' + VALID_LOADERS.join(', ') + ". Received: " + loaderKey), "__NEXT_ERROR_CODE", {
        value: "E338",
        enumerable: false,
        configurable: true
    });
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, src, layout, placeholder, onLoadingCompleteRef, setBlurComplete) {
    if (!img || img.src === emptyDataURL || img['data-loaded-src'] === src) {
        return;
    }
    img['data-loaded-src'] = src;
    const p = 'decode' in img ? img.decode() : Promise.resolve();
    p.catch(()=>{}).then(()=>{
        if (!img.parentNode) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        loadedImageURLs.add(src);
        if (placeholder === 'blur') {
            setBlurComplete(true);
        }
        if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
            const { naturalWidth, naturalHeight } = img;
            // Pass back read-only primitive values but not the
            // underlying DOM element because it could be misused.
            onLoadingCompleteRef.current({
                naturalWidth,
                naturalHeight
            });
        }
        if (process.env.NODE_ENV !== 'production') {
            var _img_parentElement;
            if ((_img_parentElement = img.parentElement) == null ? void 0 : _img_parentElement.parentElement) {
                const parent = getComputedStyle(img.parentElement.parentElement);
                if (!parent.position) {
                // The parent has not been rendered to the dom yet and therefore it has no position. Skip the warnings for such cases.
                } else if (layout === 'responsive' && parent.display === 'flex') {
                    warnOnce('Image with src "' + src + '" may not render properly as a child of a flex container. Consider wrapping the image with a div to configure the width.');
                } else if (layout === 'fill' && parent.position !== 'relative' && parent.position !== 'fixed' && parent.position !== 'absolute') {
                    warnOnce('Image with src "' + src + '" may not render properly with a parent using position:"' + parent.position + '". Consider changing the parent style to position:"relative" with a width and height.');
                }
            }
        }
    });
}
const ImageElement = (param)=>{
    let { imgAttributes, heightInt, widthInt, qualityInt, layout, className, imgStyle, blurStyle, isLazy, placeholder, loading, srcString, config, unoptimized, loader, onLoadingCompleteRef, setBlurComplete, setIntersection, onLoad, onError, isVisible, noscriptSizes, ...rest } = param;
    loading = isLazy ? 'lazy' : loading;
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("img", {
                ...rest,
                ...imgAttributes,
                decoding: "async",
                "data-nimg": layout,
                className: className,
                style: {
                    ...imgStyle,
                    ...blurStyle
                },
                ref: useCallback((img)=>{
                    if (process.env.NODE_ENV !== 'production') {
                        if (img && !srcString) {
                            console.error('Image is missing required "src" property:', img);
                        }
                    }
                    setIntersection(img);
                    if (img == null ? void 0 : img.complete) {
                        handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
                    }
                }, [
                    setIntersection,
                    srcString,
                    layout,
                    placeholder,
                    onLoadingCompleteRef,
                    setBlurComplete
                ]),
                onLoad: (event)=>{
                    const img = event.currentTarget;
                    handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
                    if (onLoad) {
                        onLoad(event);
                    }
                },
                onError: (event)=>{
                    if (placeholder === 'blur') {
                        // If the real image fails to load, this will still remove the placeholder.
                        setBlurComplete(true);
                    }
                    if (onError) {
                        onError(event);
                    }
                }
            }),
            (isLazy || placeholder === 'blur') && /*#__PURE__*/ _jsx("noscript", {
                children: /*#__PURE__*/ _jsx("img", {
                    ...rest,
                    // @ts-ignore - TODO: upgrade to `@types/react@17`
                    loading: loading,
                    decoding: "async",
                    "data-nimg": layout,
                    style: imgStyle,
                    className: className,
                    ...generateImgAttrs({
                        config,
                        src: srcString,
                        unoptimized,
                        layout,
                        width: widthInt,
                        quality: qualityInt,
                        sizes: noscriptSizes,
                        loader
                    })
                })
            })
        ]
    });
};
export default function Image(param) {
    let { src, sizes, unoptimized = false, priority = false, loading, lazyRoot = null, lazyBoundary, className, quality, width, height, style, objectFit, objectPosition, onLoadingComplete, placeholder = 'empty', blurDataURL, ...all } = param;
    const configContext = useContext(ImageConfigContext);
    const config = useMemo(()=>{
        var _c_qualities;
        const c = configEnv || configContext || imageConfigDefault;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        const qualities = (_c_qualities = c.qualities) == null ? void 0 : _c_qualities.sort((a, b)=>a - b);
        return {
            ...c,
            allSizes,
            deviceSizes,
            qualities
        };
    }, [
        configContext
    ]);
    let rest = all;
    let layout = sizes ? 'responsive' : 'intrinsic';
    if ('layout' in rest) {
        // Override default layout if the user specified one:
        if (rest.layout) layout = rest.layout;
        // Remove property so it's not spread on <img>:
        delete rest.layout;
    }
    let loader = defaultImageLoader;
    if ('loader' in rest) {
        if (rest.loader) {
            const customImageLoader = rest.loader;
            loader = (obj)=>{
                const { config: _, ...opts } = obj;
                // The config object is internal only so we must
                // not pass it to the user-defined loader()
                return customImageLoader(opts);
            };
        }
        // Remove property so it's not spread on <img>
        delete rest.loader;
    }
    let staticSrc = '';
    if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw Object.defineProperty(new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received " + JSON.stringify(staticImageData)), "__NEXT_ERROR_CODE", {
                value: "E460",
                enumerable: false,
                configurable: true
            });
        }
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!layout || layout !== 'fill') {
            height = height || staticImageData.height;
            width = width || staticImageData.width;
            if (!staticImageData.height || !staticImageData.width) {
                throw Object.defineProperty(new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received " + JSON.stringify(staticImageData)), "__NEXT_ERROR_CODE", {
                    value: "E48",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    src = typeof src === 'string' ? src : staticSrc;
    let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');
    if (src.startsWith('data:') || src.startsWith('blob:')) {
        // https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if (typeof window !== 'undefined' && loadedImageURLs.has(src)) {
        isLazy = false;
    }
    if (config.unoptimized) {
        unoptimized = true;
    }
    const [blurComplete, setBlurComplete] = useState(false);
    const [setIntersection, isIntersected, resetIntersected] = useIntersection({
        rootRef: lazyRoot,
        rootMargin: lazyBoundary || '200px',
        disabled: !isLazy
    });
    const isVisible = !isLazy || isIntersected;
    const wrapperStyle = {
        boxSizing: 'border-box',
        display: 'block',
        overflow: 'hidden',
        width: 'initial',
        height: 'initial',
        background: 'none',
        opacity: 1,
        border: 0,
        margin: 0,
        padding: 0
    };
    const sizerStyle = {
        boxSizing: 'border-box',
        display: 'block',
        width: 'initial',
        height: 'initial',
        background: 'none',
        opacity: 1,
        border: 0,
        margin: 0,
        padding: 0
    };
    let hasSizer = false;
    let sizerSvgUrl;
    const layoutStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        boxSizing: 'border-box',
        padding: 0,
        border: 'none',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        objectFit,
        objectPosition
    };
    let widthInt = getInt(width);
    let heightInt = getInt(height);
    const qualityInt = getInt(quality);
    if (process.env.NODE_ENV !== 'production') {
        if (!src) {
            // React doesn't show the stack trace and there's
            // no `src` to help identify which image, so we
            // instead console.error(ref) during mount.
            widthInt = widthInt || 1;
            heightInt = heightInt || 1;
            unoptimized = true;
        } else {
            if (!VALID_LAYOUT_VALUES.includes(layout)) {
                throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "layout" property. Provided "' + layout + '" should be one of ' + VALID_LAYOUT_VALUES.map(String).join(',') + "."), "__NEXT_ERROR_CODE", {
                    value: "E420",
                    enumerable: false,
                    configurable: true
                });
            }
            if (typeof widthInt !== 'undefined' && isNaN(widthInt) || typeof heightInt !== 'undefined' && isNaN(heightInt)) {
                throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "width" or "height" property. These should be numeric values.'), "__NEXT_ERROR_CODE", {
                    value: "E99",
                    enumerable: false,
                    configurable: true
                });
            }
            if (layout === 'fill' && (width || height)) {
                warnOnce('Image with src "' + src + '" and "layout=\'fill\'" has unused properties assigned. Please remove "width" and "height".');
            }
            if (!VALID_LOADING_VALUES.includes(loading)) {
                throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "loading" property. Provided "' + loading + '" should be one of ' + VALID_LOADING_VALUES.map(String).join(',') + "."), "__NEXT_ERROR_CODE", {
                    value: "E357",
                    enumerable: false,
                    configurable: true
                });
            }
            if (priority && loading === 'lazy') {
                throw Object.defineProperty(new Error('Image with src "' + src + '" has both "priority" and "loading=\'lazy\'" properties. Only one should be used.'), "__NEXT_ERROR_CODE", {
                    value: "E218",
                    enumerable: false,
                    configurable: true
                });
            }
            if (sizes && layout !== 'fill' && layout !== 'responsive') {
                warnOnce('Image with src "' + src + '" has "sizes" property but it will be ignored. Only use "sizes" with "layout=\'fill\'" or "layout=\'responsive\'"');
            }
            if (placeholder === 'blur') {
                if (layout !== 'fill' && (widthInt || 0) * (heightInt || 0) < 1600) {
                    warnOnce('Image with src "' + src + '" is smaller than 40x40. Consider removing the "placeholder=\'blur\'" property to improve performance.');
                }
                if (!blurDataURL) {
                    const VALID_BLUR_EXT = [
                        'jpeg',
                        'png',
                        'webp',
                        'avif'
                    ] // should match next-image-loader
                    ;
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has "placeholder=\'blur\'" property but is missing the "blurDataURL" property.\n          Possible solutions:\n            - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image\n            - Change the "src" property to a static import with one of the supported file types: ' + VALID_BLUR_EXT.join(',') + ' (animated images not supported)\n            - Remove the "placeholder" property, effectively no blur effect\n          Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url'), "__NEXT_ERROR_CODE", {
                        value: "E89",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if ('ref' in rest) {
                warnOnce('Image with src "' + src + '" is using unsupported "ref" property. Consider using the "onLoadingComplete" property instead.');
            }
            if (!unoptimized && loader !== defaultImageLoader) {
                const urlStr = loader({
                    config,
                    src,
                    width: widthInt || 400,
                    quality: qualityInt || 75
                });
                let url;
                try {
                    url = new URL(urlStr);
                } catch (err) {}
                if (urlStr === src || url && url.pathname === src && !url.search) {
                    warnOnce('Image with src "' + src + '" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.' + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader-width");
                }
            }
            if (style) {
                let overwrittenStyles = Object.keys(style).filter((key)=>key in layoutStyle);
                if (overwrittenStyles.length) {
                    warnOnce("Image with src " + src + " is assigned the following styles, which are overwritten by automatically-generated styles: " + overwrittenStyles.join(', '));
                }
            }
            if (typeof window !== 'undefined' && !perfObserver && window.PerformanceObserver) {
                perfObserver = new PerformanceObserver((entryList)=>{
                    for (const entry of entryList.getEntries()){
                        var _entry_element;
                        // @ts-ignore - missing "LargestContentfulPaint" class with "element" prop
                        const imgSrc = (entry == null ? void 0 : (_entry_element = entry.element) == null ? void 0 : _entry_element.src) || '';
                        const lcpImage = allImgs.get(imgSrc);
                        if (lcpImage && !lcpImage.priority && lcpImage.placeholder !== 'blur' && !lcpImage.src.startsWith('data:') && !lcpImage.src.startsWith('blob:')) {
                            // https://web.dev/lcp/#measure-lcp-in-javascript
                            warnOnce('Image with src "' + lcpImage.src + '" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.' + "\nRead more: https://nextjs.org/docs/api-reference/next/legacy/image#priority");
                        }
                    }
                });
                try {
                    perfObserver.observe({
                        type: 'largest-contentful-paint',
                        buffered: true
                    });
                } catch (err) {
                    // Log error but don't crash the app
                    console.error(err);
                }
            }
        }
    }
    const imgStyle = Object.assign({}, style, layoutStyle);
    const blurStyle = placeholder === 'blur' && !blurComplete ? {
        backgroundSize: objectFit || 'cover',
        backgroundPosition: objectPosition || '0% 0%',
        filter: 'blur(20px)',
        backgroundImage: 'url("' + blurDataURL + '")'
    } : {};
    if (layout === 'fill') {
        // <Image src="i.png" layout="fill" />
        wrapperStyle.display = 'block';
        wrapperStyle.position = 'absolute';
        wrapperStyle.top = 0;
        wrapperStyle.left = 0;
        wrapperStyle.bottom = 0;
        wrapperStyle.right = 0;
    } else if (typeof widthInt !== 'undefined' && typeof heightInt !== 'undefined') {
        // <Image src="i.png" width="100" height="100" />
        const quotient = heightInt / widthInt;
        const paddingTop = isNaN(quotient) ? '100%' : "" + quotient * 100 + "%";
        if (layout === 'responsive') {
            // <Image src="i.png" width="100" height="100" layout="responsive" />
            wrapperStyle.display = 'block';
            wrapperStyle.position = 'relative';
            hasSizer = true;
            sizerStyle.paddingTop = paddingTop;
        } else if (layout === 'intrinsic') {
            // <Image src="i.png" width="100" height="100" layout="intrinsic" />
            wrapperStyle.display = 'inline-block';
            wrapperStyle.position = 'relative';
            wrapperStyle.maxWidth = '100%';
            hasSizer = true;
            sizerStyle.maxWidth = '100%';
            sizerSvgUrl = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27" + widthInt + "%27%20height=%27" + heightInt + "%27/%3e";
        } else if (layout === 'fixed') {
            // <Image src="i.png" width="100" height="100" layout="fixed" />
            wrapperStyle.display = 'inline-block';
            wrapperStyle.position = 'relative';
            wrapperStyle.width = widthInt;
            wrapperStyle.height = heightInt;
        }
    } else {
        // <Image src="i.png" />
        if (process.env.NODE_ENV !== 'production') {
            throw Object.defineProperty(new Error('Image with src "' + src + '" must use "width" and "height" properties or "layout=\'fill\'" property.'), "__NEXT_ERROR_CODE", {
                value: "E495",
                enumerable: false,
                configurable: true
            });
        }
    }
    let imgAttributes = {
        src: emptyDataURL,
        srcSet: undefined,
        sizes: undefined
    };
    if (isVisible) {
        imgAttributes = generateImgAttrs({
            config,
            src,
            unoptimized,
            layout,
            width: widthInt,
            quality: qualityInt,
            sizes,
            loader
        });
    }
    let srcString = src;
    if (process.env.NODE_ENV !== 'production') {
        if (typeof window !== 'undefined') {
            let fullUrl;
            try {
                fullUrl = new URL(imgAttributes.src);
            } catch (e) {
                fullUrl = new URL(imgAttributes.src, window.location.href);
            }
            allImgs.set(fullUrl.href, {
                src,
                priority,
                placeholder
            });
        }
    }
    const linkProps = supportsFloat ? undefined : {
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: rest.crossOrigin,
        referrerPolicy: rest.referrerPolicy
    };
    const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
    const onLoadingCompleteRef = useRef(onLoadingComplete);
    const previousImageSrc = useRef(src);
    useEffect(()=>{
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [
        onLoadingComplete
    ]);
    useLayoutEffect(()=>{
        if (previousImageSrc.current !== src) {
            resetIntersected();
            previousImageSrc.current = src;
        }
    }, [
        resetIntersected,
        src
    ]);
    const imgElementArgs = {
        isLazy,
        imgAttributes,
        heightInt,
        widthInt,
        qualityInt,
        layout,
        className,
        imgStyle,
        blurStyle,
        loading,
        config,
        unoptimized,
        placeholder,
        loader,
        srcString,
        onLoadingCompleteRef,
        setBlurComplete,
        setIntersection,
        isVisible,
        noscriptSizes: sizes,
        ...rest
    };
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxs("span", {
                style: wrapperStyle,
                children: [
                    hasSizer ? /*#__PURE__*/ _jsx("span", {
                        style: sizerStyle,
                        children: sizerSvgUrl ? /*#__PURE__*/ _jsx("img", {
                            style: {
                                display: 'block',
                                maxWidth: '100%',
                                width: 'initial',
                                height: 'initial',
                                background: 'none',
                                opacity: 1,
                                border: 0,
                                margin: 0,
                                padding: 0
                            },
                            alt: "",
                            "aria-hidden": true,
                            src: sizerSvgUrl
                        }) : null
                    }) : null,
                    /*#__PURE__*/ _jsx(ImageElement, {
                        ...imgElementArgs
                    })
                ]
            }),
            !supportsFloat && priority ? // Note how we omit the `href` attribute, as it would only be relevant
            // for browsers that do not support `imagesrcset`, and in those cases
            // it would likely cause the incorrect image to be preloaded.
            //
            // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
            /*#__PURE__*/ _jsx(Head, {
                children: /*#__PURE__*/ _jsx("link", {
                    rel: "preload",
                    as: "image",
                    href: imgAttributes.srcSet ? undefined : imgAttributes.src,
                    ...linkProps
                }, '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes)
            }) : null
        ]
    });
}

//# sourceMappingURL=image.js.map