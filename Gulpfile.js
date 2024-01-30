import gulp from "gulp";
const { src, dest, series, watch } = gulp;
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
		.pipe(src("favicon.ico"))
		.pipe(src("assets/"))
		.pipe(dest("dist"));
}

function watchFiles() {
	watch("src/**/*", html);
}

export default series(clean, html, watchFiles);
export const build = series(clean, html);
