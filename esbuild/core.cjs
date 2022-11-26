require("esbuild").build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: true,
	external: ["esbuild", "get-file-exports"],
	outdir: "dist/src",
	platform: "node",
	target: "node14",
	format: "esm",
	outExtension: {
		".js": ".mjs",
	},
	sourcemap: false,
	sourcesContent: false,
})
