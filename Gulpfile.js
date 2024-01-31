import gulp from "gulp";
const { task, src, dest, series, watch } = gulp;
import merge from "merge-stream";
import njk from "gulp-nunjucks-render";
import { deleteAsync as del } from "del";
import beautify from "gulp-beautify";

import package_json from "./package.json" assert {type: 'json'};

function clean() {
	return del(["dist/**", "!dist/assets", "!dist/assets/*"]);
}

function html() {
	return src("src/html/pages/*.+(html|njk)")
		.pipe(
			njk({
				path: ["src/html"],
				data: {
					mount_path: package_json.config.mount_path,
				}
			}),
		)
		.pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
		.pipe(dest("dist"))
}

function assets() {
	return merge([
		src("assets/*").pipe(dest("dist/assets")),
		src("src/css/*").pipe(dest("dist/css")),
		src("*.ttf").pipe(dest("dist")),
		src("favicon.ico").pipe(dest("dist")),
	]);
}

function watchFiles() {
	watch("src/**/*", assets, html);
}

export default series(clean, html, assets, watchFiles);
export const build = series(clean, html, assets);
