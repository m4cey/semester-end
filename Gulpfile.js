import gulp from "gulp";
const { src, dest, series, watch } = gulp;
import { deleteAsync as del } from "del";
import njk from "gulp-nunjucks-render";
import beautify from "gulp-beautify";

var env_hook = function (env) {
	env.addGlobal("pages", ["index", "form"]);
};

function clean() {
	return del(["dist"]);
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
		.pipe(dest("dist"));
}

function watchFiles() {
	watch("src/html/**/*", html);
}

function copy() {
	return src("favicon.ico").pipe(dest("dist"));
}

export default series(clean, copy, html, watchFiles);
export const build = series(clean, copy, html);
