<div align="center" >
    <img src="https://raw.githubusercontent.com/Alexandre-Fernandez/astro-i18n/0fb145cf64ef94968ca70c36b52a922fa897d11a/img/logo.svg" alt="astro-i18n logo" width="33%">
    <br/>
	<h1>astro-i18n</h1>
    <p>A TypeScript-first internationalization library for <a href="https://github.com/withastro/astro">Astro</a>.</p>
</div>

## Features

-   🪶 Lightweight.
-   🌏 Internationalized routing.
-   🔒 Type-safety and autocompletion.
-   🔧 Support for plurals, context, interpolations and formatters.
-   🚀 Built for [Astro](https://github.com/withastro/astro) and nothing else.
-   💻 Astro island compatible.

## Introduction

Most internationalization libraries rely on raw untyped strings to access their translations. This is equally possible with astro-i18n however it can generate project specific types to get type-safety and autocompletion for your translations.

## Installation

```yml
# npm
npm install astro-i18n
# yarn
yarn add astro-i18n
# pnpm
pnpm add astro-i18n
```

## Get started

Run the quick install command :

```yml
./node_modules/.bin/astro-i18n install
# serverless (no filesystem/node.js setup)
./node_modules/.bin/astro-i18n install --serverless
```

Verify that your middleware file at `src/middleware.ts` or `src/middleware/index.ts` uses the `astro-i18n` middleware. If the file was generated by the quick install command it should be fine.

```ts
// src/middleware.ts
import { sequence } from "astro/middleware"
import { useAstroI18n } from "astro-i18n"

const astroI18n = useAstroI18n(/* astro-i18n config, custom formatters */)

export const onRequest = sequence(astroI18n)
```

If you are using **serverless all your initial data needs to be passed to the middleware** (mainly inside the config).

When using node (SSR or SSG) you can either go for the same workflow as serverless or use the filesystem to store your config and translations.

If you used the quick install (with node) a config file for `astro-i18n` should have been generated, you will find it in your root directory (`astro-i18n.config.(ts|js|cjs|mjs|json)`). This is the same as passing it in the middleware parameters.
**Configure it as needed, you can set your `primaryLocale` and `secondaryLocales` there**.

You can put your translations in four locations :

-   Inside the middleware config.
-   Inside the config file at the root.
-   In your `src/pages` folder (local page translations), see below.
-   In the `src/i18n` directory, see below.

**`astro-i18n` works on the server-side and on the client-side** so that it can work with client-side frameworks. Because of this **translations are aggregated into groups**:

-   The `"common"` group which is accesible on every page.
-   The current page group named after its route, such as `"/about"` or `"/posts/[id]"`, as its name implies it's only accessible on the current page.
-   Any other custom group named by yourself, for example `"admin"`. It's up to you to decide on which pages your custom group is accessible.

**By default any translation accessible on the current page is visible on the client-side** (you may change that in the config).

![Filesystem translations screenshot](https://raw.githubusercontent.com/Alexandre-Fernandez/astro-i18n/2.0/img/json_translations.png "Filesystem translations screenshot")

As shown in the screenshot above, local page translations can be either in `src/pages` or `src/i18n/pages`, nest them just like you do with astro file-based routing.
All the following translation file formats are valid :

```ts
const regular = `${locale}.json` // fr.json
const private = `_${locale}.json` // _fr.json
const regularWithTranslation = `${locale}.${segmentTranslation}.json` // fr.translated-page-name.json
const privateWithTranslation = `_${locale}.${segmentTranslation}.json` // _fr.translated-page-name.json
```

These files can either be directly in the page directory or grouped in a special directory called `i18n` by default.
Concerning custom groups, create a directory containing the translation files named after your group in `src/i18n`. To make them accessible in a page check the `loadingRules`.

To get **type-safety and generate your translated routes run the following command `npm run i18n:sync`**.

Once you have some translations you can use the main translation function `t` :

```ts
// src/pages/about/_i18n/en.json
{
	"my_nested": {
		"translation_key": "hello"
	}
}
// src/pages/about/_i18n/fr.a-propos.json
{
	"my_nested": {
		"translation_key": "bonjour"
	}
}
```

```ts
// src/pages/about/index.astro
import { astroI18n, t } from "astro-i18n"

astroI18n.locale // "en"
t("my_nested.translation_key") // hello

// src/pages/fr/a-propos/index.astro
import { astroI18n, t } from "astro-i18n"

astroI18n.locale // "fr"
t("my_nested.translation_key") // bonjour
```

If there's duplicate keys `t` will return the more specific one (custom group => local page => common group).

To translate a link use the `l` function, **by default all route segment translations are visible on the client-side** :

```ts
// src/pages/fr/a-propos/index.astro
import { astroI18n, l } from "astro-i18n"

astroI18n.locale // "en"
l("/about") // "about"

// src/pages/fr/a-propos/index.astro
import { astroI18n, l } from "astro-i18n"

astroI18n.locale // "fr"
l("/about") // "a-propos"
```

That's it for the basics, for more keep reading !

## Configuration

### `primaryLocale`

The default locale for your app.

### `secondaryLocales`

All the other locales supported by your app.

### `fallbackLocale`

If left undefined this will be equal to your `primaryLocale`, to disable it set it to an empty string. The locale to search a translation in when it's missing in another one.

### `showPrimaryLocale`

Boolean deciding whether to show the default locale in the url or not.

### `trailingSlash`

Possible values are `"always"` or `"never"` (default). When set to `"always"`, generated routes will have a trailing slash.

### `run`

Possible values are `"server"` or `"client+server"` (default). When set to `"client+server"` the available translations for the current page and all route translations will be serialized and sent to the client so that astro-i18n can work with client-side frameworks. You can disable this behaviour by setting `run` to `"server"`.

### `translations`

Your app translations in the following format :

```json
{
	"common": {
		"en": {
			"hello": "Hello",
			"form": {
				// accessed with the "form.first_name" key :
				"first_name": "First name"
			}
		},
		"fr": {
			"hello": "Bonjour",
			"form": {
				"first_name": "Prénom"
			}
		}
	},
	"admin": {
		"en": {
			"how_are_you": "How are you ?"
		},
		"fr": {
			"how_are_you": "Comment allez vous ?"
		}
	},
	// routes are also a valid group, they will automatically load in the corresponding page :
	"/posts/[id]": {
		"en": {
			"bye": "Bye"
		},
		"fr": {
			"bye": "Au revoir"
		}
	}
}
```

### `translationLoadingRules`

An array of rules specifying what group to load on which page :

```json
[
	{
		"routes": ["^/admin.*"], // regex for all routes beginning with "/admin"
		"groups": ["^admin$"] // regex to load the "admin" group
	}
]
```

### `translationDirectory`

Which name to use for the directories in `src` and in `src/pages`, by default it's `"i18n"` (`/src/i18n` and `src/pages/i18n`/`src/pages/about/i18n`).

```json
{
	"i18n": "i18n",
	"pages": "i18n"
}
```

### `routes`

Your route segment translations. This is where you can translate your routes, for example `"/about"` to `"/a-propos"`.

```json
{
	// only specify secondary locales
	"fr": {
		// "primary_locale_segment": "translated_segment"
		"about": "a-propos"
	}
}
```

## Variants

Variants are the way that plurals and context are handled. You can set multiple variables, numbers will match the closest value however other types will only match exact matches. They are set in the translation key, here's some examples :

```json
{
	"car": "There is a car.", // default value for "car" key
	"car{{ cars: 2 }}": "There are two cars.",
	"car{{ cars: 3 }}": "There are many cars.",
	"foo{{ multiple: [true, 'bar'] }}": "baz.",
	"context{{ weather: 'rain' }}": "It's rainy.",
	"context{{ weather: 'sun' }}": "It's sunny."
}
```

```ts
import { astroI18n, t } from "astro-i18n"

t("car") // "There is a car."
t("car", { cars: 0 }) // "There are two cars."
t("car", { cars: 1 }) // "There are two cars."
t("car", { cars: 2 }) // "There are two cars."
t("car", { cars: 3 }) // "There are many cars."
t("car", { cars: 18 }) // "There are many cars."
t("foo", { multiple: true }) // "baz."
t("foo", { multiple: "bar" }) // "baz."
t("context", { weather: "rain" }) // "It's rainy."
t("context", { weather: "sun" }) // "It's sunny."
```

## Interpolations

Interpolations can be used to display dynamic data in your translation values, here's some examples :

```json
{
	"interpolation_1": "{# variable #}",
	"interpolation_2": "{# variable(alias) #}",
	"interpolation_3": "{# variable(alias)>uppercase #}",
	"interpolation_4": "{# 15>intl_format_number({ style: 'currency', currency: currency }) #}",
	"interpolation_5": "{# { foo: 'bar'}(alias)>json(false)>uppercase #}"
}
```

```ts
import { astroI18n, t } from "astro-i18n"

astroI18n.locale // "en"

t("interpolation_1", { variable: "foo" }) // "foo"
t("interpolation_2", { alias: "bar" }) // "bar"
t("interpolation_3", { alias: "baz" }) // "BAZ"
t("interpolation_4", { currency: "EUR" }) // "€15.00"
t("interpolation_5") // '{"FOO":"BAR"}'
t("interpolation_5", { alias: { bar: "baz" } }) // '{"BAR":"BAZ"}'
```

As you can see there's multiple parts to an interpolation :

-   The interpolation value which is what the formatters apply on.
-   The interpolation alias which can either change the name of the value if it's a variable or make the value a default value replaceable by the alias variable.
-   The interpolation formatters which can take arguments, you can chain them and create your own. When creating a formatter, if you want it to work on the client side it must not use anything outside the function scope.

You can apply this to any value, even if it's nested or inside the formatters arguments.

## Interpolation formatters

An interpolation formatter is a function that takes the interpolation value and transforms it, if there's multiple of them they will be chained.
These are the default interpolation formatters :

-   `upper()` : `value.toUpperCase()`.
-   `uppercase()` : alias for `upper`.
-   `lower()` : `value.toLowerCase()`.
-   `lowercase()` : alias for `lower`.
-   `capitalize()` : Capitalizes the first character of `value` and lowers the others.
-   `json(format = true)` : `JSON.stringify(value)`, if format is true it will format the JSON.
-   `default_falsy(defaultValue)` : When `!value`, `defaultValue` will be used instead.
-   `default(defaultValue)` : alias for `default_falsy`.
-   `default_nullish(defaultValue)` : When `value == null`, `defaultValue` will be used instead.
-   `default_non_string(defaultValue)` : When `typeof value !== "string"`, `defaultValue` will be used instead.
-   `intl_format_number(options, locale = astroI18n.locale)` : Formats `value` with [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
-   `intl_format_date(options, locale = astroI18n.locale)` : Formats `value` with [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

If the formatter has no arguments you can write it without parenthesises, for example `value>upper`.

You can add your own custom formatters in the second argument of the middleware. If you want them to work on the client-side they must not use anything outside the function scope. Here's an example of a custom formatter :

```ts
export function xXify(value: unknown, repeats: unknown = 1) {
	if (typeof repeats !== "number") {
		throw new Error("repeats must be a number")
	}
	if (repeats <= 0) return value
	return `${"xX".repeat(repeats)}${value}${"Xx".repeat(repeats)}`
}

// example that wouldn't work client-side :
const error = new Error("repeats must be a number")
function xXify(value: unknown, repeats: unknown = 1) {
	if (typeof repeats !== "number") throw error // cannot use anything outside of scope
	// ...
}
```

## Reference

### `defineAstroI18nConfig`

```ts
function defineAstroI18nConfig(
	config: Partial<AstroI18nConfig>,
): Partial<AstroI18nConfig>
```

Utility function to get type safety when defining the config.

### `useAstroI18n`

```ts
function useAstroI18n(
	config?: Partial<AstroI18nConfig> | string, // string if path to config file
	formatters?: {
		[name: string]: (value: unknown, ...args: unknown[]) => unknown
	},
): AstroMiddleware
```

The astro-i18n middleware, mandatory to make the library work.

### `createGetStaticPaths`

```ts
function createGetStaticPaths(
	callback: (
		props: GetStaticPathsProps,
	) => GetStaticPathsItem[] | Promise<GetStaticPathsItem[]>,
): GetStaticPathsItem[] | Promise<GetStaticPathsItem[]>
```

You should use this function if you plan to use any translation features inside a getStaticPaths. This is to fix some Astro behaviour. Using the `t` function is not recommended inside getStaticPaths.

### `t`

Alias for `astroI18n.t`.

### `l`

Alias for `astroI18n.l`.

### `astroI18n.environment`

```ts
environment: "node" | "none" | "browser"
```

The current detected environment.

### `astroI18n.route`

```ts
route: string
```

The current route (without the locale, for example `/fr/about` will return `/about`).

### `astroI18n.pages`

```ts
pages: string[]
```

An array of all the available pages.

### `astroI18n.page`

```ts
page: string
```

The corresponding page for the current route, for example `/posts/my-cool-slug` will be `/posts/[slug]`.

### `astroI18n.locale`

```ts
locale: string
```

The locale for the current page.

### `astroI18n.locales`

```ts
locales: string[]
```

All the supported locales.

### `astroI18n.primaryLocale`

```ts
primaryLocale: string
```

The configured primary locale.

### `astroI18n.secondaryLocales`

```ts
secondaryLocales: string
```

The configured secondary locales.

### `astroI18n.fallbackLocale`

```ts
fallbackLocale: string
```

The configured fallback locale.

### `astroI18n.isInitialized`

```ts
isInitialized: boolean
```

True once the config has been loaded and the state initialized.

### `astroI18n.t`

```ts
function t(
	key: string,
	properties?: Record<string, unknown>,
	options?: {
		route?: string
		locale?: string
		fallbackLocale?: string
	},
): string
```

The main translation function (`t` is an alias).

### `astroI18n.l`

```ts
function l(
	route: string,
	parameters?: Record<string, unknown>,
	options?: {
		targetLocale?: string
		routeLocale?: string
		showPrimaryLocale?: boolean
		query?: Record<string, unknown>
	},
): string
```

The main routing function (`l` is an alias).

### `astroI18n.addTranslations`

```ts
function addTranslations(translations: {
	[group: string]: {
		[locale: string]: DeepStringRecord
	}
}): AstroI18n
```

Adds new translations at runtime.

### `astroI18n.addFormatters`

```ts
function addFormatters(formatters: {
	[name: string]: (value: unknown, ...args: unknown[]) => unknown
}): AstroI18n
```

Adds new formatters at runtime.

### `astroI18n.addTranslationLoadingRules`

```ts
function addTranslationLoadingRules(
	translationLoadingRules: {
		groups: string[]
		routes: string[]
	}[],
): AstroI18n
```

Adds new translation loading rules at runtime.

### `astroI18n.addRoutes`

```ts
function addRoutes(routes: {
	[secondaryLocale: string]: {
		[segment: string]: string
	}
}): AstroI18n
```

Adds new route segment translations at runtime.

### `astroI18n.extractRouteLocale`

```ts
function extractRouteLocale(route: string): string
```

Utility function to parse one of the configured locales out of the given route.

## Components

You can use these premade components in your project :

### HrefLangs

SEO component, see [hreglang](https://en.wikipedia.org/wiki/Hreflang).

```astro
---
import { astroI18n } from "astro-i18n"

const params: Record<string, string> = {}
for (const [key, value] of Object.entries(Astro.params)) {
	if (value === undefined) continue
	params[key] = String(value)
}

const hrefLangs = astroI18n.locales.map((locale) => ({
	href:
		Astro.url.origin +
		astroI18n.l(Astro.url.pathname, params, {
			targetLocale: locale,
		}),
	hreflang: locale,
}))
---

{
	hrefLangs.map(({ href, hreflang }) => (
		<link rel="alternate" href={href} hreflang={hreflang} />
	))
}

```

### LanguageSwitcher

Simple component to switch locales.

```astro
---
import { astroI18n, l } from "astro-i18n"

interface Props {
	showCurrent: boolean
	labels: {
		[locale: string]: string
	}
}

const { showCurrent = true, labels = {} } = Astro.props

const params: Record<string, string> = {}
for (const [key, value] of Object.entries(Astro.params)) {
	if (value === undefined) continue
	params[key] = String(value)
}

let links = astroI18n.locales.map((locale) => ({
	locale,
	href: l(Astro.url.pathname, params, {
		targetLocale: locale,
	}),
	label: labels[locale] || locale.toUpperCase(),
}))

if (!showCurrent) {
	links = links.filter((link) => link.locale !== astroI18n.locale)
}
---

<nav>
	<ul>
		{
			links.map(({ href, label }) => (
				<li>
					<a href={href}>{label}</a>
				</li>
			))
		}
	</ul>
</nav>

```

## CLI

### `astro-i18n install`

Generates default files and add i18n commands to `package.json`.

### `astro-i18n generate:pages`

Generates the pages corresponding to your current config and `src/pages` folder. You can use the `--purge` argument to clear old pages.

### `astro-i18n generate:types`

Generates types in `src/env.d.ts` to give you type safety according to your config & translations.

### `astro-i18n extract:keys`

Extract all the translation keys used in `src/pages` (as long as they are strings and not variables), and adds them to your i18n folder for every locale.
This is useful if you use your keys as values.
