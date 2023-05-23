# responses

A handy response factory function and a set of commonly used responses. Some
extra benifits are:

- Automatically converting to JSON if the type is not directly supported by
  `Response` (see
  https://developer.mozilla.org/en-US/docs/Web/API/Response/Response)
- Setting cookies with the `options.cookies` option.
- Automatically setting the status text based on the status code.

# Usage

```ts
import { ok, redirect, response } from "https://deno.land/x/responses/mod.ts";

// Empty response, same as new Response()
response();

// We can give it a body as with a Response ...
response("Hello World"); // { "content-type":"text/plain;charset=UTF-8" }

// ... or a plain object which will be serialized to JSON
response({ hello: "world" }); // { "content-type": "application/json" }

// We can also pass options
response("Hello", {
  cookies: [{ name: "my-cookies", value: "dough" }],
  headers: { "X-My-Header": "My Value" },
  location: "/blog", // sets the Location header
  status: 200, // default
  statusText: "OK", // if not provided it is derrived from the status
});

// There are also a handfull of commonly used responses
ok(); // Status: 200, Status Text: "OK".

redirect("/home", { status: 307 });
```
