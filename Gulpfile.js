import gulp from "gulp";
const { task, src, dest, series, watch } = gulp;
import merge from "merge-stream";
import { deleteAsync as del } from "del";
import njk from "gulp-nunjucks-render";
import beautify from "gulp-beautify";

var env_hook = function (env) {
	// env.addGlobal("pages", ["index", "form", "display"]);
};

function clean() {
	return del(["dist/**", "!dist/assets", "!dist/assets/*"]);
}

function html() {
	return src("src/html/pages/*.+(html|njk)")
		.pipe(
			njk({
				path: ["src/html"],
				manageEnv: env_hook,
			}),
		)
		.pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
		.pipe(dest("dist"))
}

// function assets() {
// 	return src("assets/*").pipe(dest("dist/assets"));
//
// }

function assets() {
	return merge([
		src("assets/*").pipe(dest("dist/assets")),
		src("src/css/*").pipe(dest("dist/css")),
	]);
}

function watchFiles() {
	watch("src/**/*", html);
}

export default series(clean, html, assets, watchFiles);
export const build = series(clean, html, assets);
