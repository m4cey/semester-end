import gulp from "gulp";
const { src, dest, series, watch } = gulp;
import { deleteAsync as del } from "del";
import njk from "gulp-nunjucks-render";
import beautify from "gulp-beautify";

function clean() {
	return del(["dist"]);
}

function html() {
	return src("src/html/pages/*.+(html|njk)")
		.pipe(
			njk({
				path: ["src/html"],
			}),
		)
		.pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
		.pipe(dest("dist"));
}

function watchFiles() {
	watch("src/html/**/*", html);
}

// exports.build = series(clean, html);
// exports.default = series(clean, html, watchFiles);
export default series(clean, html, watchFiles);
export const build = series(clean, html);
