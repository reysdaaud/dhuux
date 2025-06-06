import path from 'path';
import { stringify } from 'querystring';
import { WEBPACK_RESOURCE_QUERIES } from '../../../../lib/constants';
import { isMetadataRoute } from '../../../../lib/metadata/is-metadata-route';
import { AppBundlePathNormalizer } from '../../../../server/normalizers/built/app/app-bundle-path-normalizer';
import { AppPathnameNormalizer } from '../../../../server/normalizers/built/app/app-pathname-normalizer';
import { loadEntrypoint } from '../../../load-entrypoint';
import { getFilenameAndExtension } from '../next-metadata-route-loader';
export async function createAppRouteCode({ name, page, pagePath, resolveAppRoute, pageExtensions, nextConfigOutput }) {
    // routePath is the path to the route handler file,
    // but could be aliased e.g. private-next-app-dir/favicon.ico
    const routePath = pagePath.replace(/[\\/]/, '/');
    // This, when used with the resolver will give us the pathname to the built
    // route handler file.
    let resolvedPagePath = await resolveAppRoute(routePath);
    if (!resolvedPagePath) {
        throw Object.defineProperty(new Error(`Invariant: could not resolve page path for ${name} at ${routePath}`), "__NEXT_ERROR_CODE", {
            value: "E281",
            enumerable: false,
            configurable: true
        });
    }
    // If this is a metadata route, then we need to use the metadata loader for
    // the route to ensure that the route is generated.
    const fileBaseName = path.parse(resolvedPagePath).name;
    if (isMetadataRoute(name) && fileBaseName !== 'route') {
        const { ext } = getFilenameAndExtension(resolvedPagePath);
        const isDynamicRouteExtension = pageExtensions.includes(ext);
        resolvedPagePath = `next-metadata-route-loader?${stringify({
            filePath: resolvedPagePath,
            isDynamicRouteExtension: isDynamicRouteExtension ? '1' : '0'
        })}!?${WEBPACK_RESOURCE_QUERIES.metadataRoute}`;
    }
    const pathname = new AppPathnameNormalizer().normalize(page);
    const bundlePath = new AppBundlePathNormalizer().normalize(page);
    return await loadEntrypoint('app-route', {
        VAR_USERLAND: resolvedPagePath,
        VAR_DEFINITION_PAGE: page,
        VAR_DEFINITION_PATHNAME: pathname,
        VAR_DEFINITION_FILENAME: fileBaseName,
        VAR_DEFINITION_BUNDLE_PATH: bundlePath,
        VAR_RESOLVED_PAGE_PATH: resolvedPagePath
    }, {
        nextConfigOutput: JSON.stringify(nextConfigOutput)
    });
}

//# sourceMappingURL=create-app-route-code.js.map