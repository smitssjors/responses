import {
  Cookie,
  setCookie,
} from "https://deno.land/std@0.198.0/http/cookie.ts";
import {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.198.0/http/http_status.ts";

type Body = unknown;

interface BaseOptions {
  cookies?: Cookie[];
  headers?: HeadersInit;
}

interface LocationOptions extends BaseOptions {
  location?: string | URL;
}

interface ResponseOptions extends LocationOptions {
  status?: Status;
  statusText?: string;
}

export function response(body?: Body, options?: ResponseOptions): Response {
  const headers = new Headers(options?.headers);

  if (options?.cookies) {
    options.cookies.forEach((c) => setCookie(headers, c));
  }

  if (options?.location) {
    const url = typeof options.location === "string"
      ? options.location
      : options.location.toString();

    headers.set("Location", url);
  }

  const status = options?.status ?? Status.OK;
  const statusText = options?.statusText ?? STATUS_TEXT[status];

  const responseInit: ResponseInit = { headers, status, statusText };

  // All types form https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
  // except String as it is for some reason not a valid type for BodyInit in Deno
  if (
    body == null || typeof body === "string" || body instanceof Blob ||
    body instanceof ReadableStream || body instanceof ArrayBuffer ||
    body instanceof Int8Array || body instanceof Uint8Array ||
    body instanceof Uint8ClampedArray || body instanceof Int16Array ||
    body instanceof Uint16Array || body instanceof Int32Array ||
    body instanceof Uint32Array || body instanceof Float32Array ||
    body instanceof Float64Array || body instanceof BigInt64Array ||
    body instanceof BigUint64Array || body instanceof DataView ||
    body instanceof FormData || body instanceof URLSearchParams
  ) {
    return new Response(body, responseInit);
  }

  if (body instanceof String) {
    return new Response(body.valueOf(), responseInit);
  }

  // Not a supported type so try to return a JSON response
  return Response.json(body, responseInit);
}

type OkResponseOptions = BaseOptions;

export function ok(body?: Body, options?: OkResponseOptions): Response {
  return response(body, options);
}

type CreatedResponseOptions = LocationOptions;

export function created(
  body?: Body,
  options?: CreatedResponseOptions,
): Response {
  return response(body, { ...options, status: Status.Created });
}

type NoContentResponseOptions = BaseOptions;

export function noContent(options?: NoContentResponseOptions): Response {
  return response(null, { ...options, status: Status.NoContent });
}

interface RedirectResponseOptions extends BaseOptions {
  status?: Status;
}

export function redirect(
  url: string | URL,
  options?: RedirectResponseOptions,
): Response {
  const status = options?.status ?? Status.Found;
  return response(null, { ...options, location: url, status });
}

type BadRequestResponseOptions = BaseOptions;

export function badRequest(
  body?: Body,
  options?: BadRequestResponseOptions,
): Response {
  return response(body, { ...options, status: Status.BadRequest });
}

type UnauthorizedResponseOptions = BaseOptions;

export function unauthorized(
  body?: Body,
  options?: UnauthorizedResponseOptions,
): Response {
  return response(body, { ...options, status: Status.Unauthorized });
}

type ForbiddenResponseOptions = BaseOptions;

export function forbidden(
  body?: Body,
  options?: ForbiddenResponseOptions,
): Response {
  return response(body, { ...options, status: Status.Forbidden });
}

type NotFoundResponseOptions = BaseOptions;

export function notFound(
  body?: Body,
  options?: NotFoundResponseOptions,
): Response {
  return response(body, { ...options, status: Status.NotFound });
}
