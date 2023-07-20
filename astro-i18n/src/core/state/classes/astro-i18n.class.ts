import Config from "@src/core/config/classes/config.class"
import Environment from "@src/core/state/enums/environment.enum"
import MissingConfigArgument from "@src/core/state/errors/missing-config-argument.error"
import UnreachableCode from "@src/errors/unreachable-code.error"
import TranslationBank from "@src/core/translation/classes/translation-bank.class"
import type { AstroI18nConfig } from "@src/core/config/types"

class AstroI18n {
	environment: Environment

	#config = new Config()

	#translations = new TranslationBank()

	constructor() {
		if (
			typeof process === "object" &&
			typeof process.versions === "object" &&
			typeof process.versions.node !== "undefined"
		) {
			this.environment = Environment.NODE
		} else if (typeof window === "undefined") {
			this.environment = Environment.NONE
		} else {
			this.environment = Environment.BROWSER
		}
	}

	get locales() {
		return [this.#config.primaryLocale, ...this.#config.secondaryLocales]
	}

	get primaryLocale() {
		return this.#config.primaryLocale
	}

	get secondaryLocales() {
		return this.#config.secondaryLocales
	}

	/**
	 * Initializes state accordingly to the environment (node, browser, etc)
	 * where it's runned.
	 * For example in a node environment it might parse the config from the
	 * filesystem.
	 */
	async init(config?: Partial<AstroI18nConfig> | string) {
		switch (this.environment) {
			case Environment.NODE: {
				if (typeof config !== "object") {
					this.#config = await Config.fromFilesystem(config)
					break
				}
				this.#config = new Config(config)
				break
			}
			case Environment.BROWSER: {
				break
			}
			case Environment.NONE: {
				if (typeof config !== "object") {
					throw new MissingConfigArgument()
				}
				this.#config = new Config(config)
				break
			}
			default: {
				throw new UnreachableCode()
			}
		}

		this.#translations = TranslationBank.fromConfig(
			this.#config.translations,
		)
	}

	toHtml() {
		return `<script type="text/json"></script>`
	}
}

export default AstroI18n
