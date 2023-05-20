import {
  Cookie,
  setCookie,
} from "https://deno.land/std@0.187.0/http/cookie.ts";
import {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.187.0/http/http_status.ts";

type Body = unknown;

interface BaseOptions {
  cookies?: Cookie[];
  headers?: HeadersInit;
}

interface ResponseOptions extends BaseOptions {
  status?: Status;
  statusText?: string;
}

export function response(body?: Body, options?: ResponseOptions): Response {
  const headers = new Headers(options?.headers);

  if (options?.cookies) {
    options.cookies.forEach((c) => setCookie(headers, c));
  }

  const status = options?.status ?? Status.OK;
  const statusText = options?.statusText ?? STATUS_TEXT[status];

  const responseInit: ResponseInit = { headers, status, statusText };

  // All types form https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
  // except String as it is not a valid type for BodyInit in Deno
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
