import { Glob } from "bun";
import { basename, extname, join } from "path";
import { statSync } from "fs"
import sharp from "sharp";

const glob = new Glob("src/assets/*.{webp,jpg,jpeg,png}");

for await (const file of glob.scan(".")) {
    const base = join("public", "_thumbnail");
    let newFile = "";

    console.info(`* Converting ${file}`);

    try {
        if (extname(file) !== ".webp") {
            newFile = join(
                base,
                `${basename(file).split(".")[0]}.webp`
            )
        } else {
            newFile = join(base, basename(file));
        }

        const convert = sharp(file).webp({
            lossless: false,
            quality: 5,
        });

        await convert.toFile(newFile);

        const sizeOrigin = statSync(file).size
        const sizeNew = statSync(newFile).size

        console.info(`before: ${sizeOrigin}kb - after: ${sizeNew}kb`);
    } catch (error) {
        console.error("I have a error", error);
    }
}
