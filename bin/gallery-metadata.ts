import { Glob } from 'bun';
import { imageMeta } from 'image-meta'
import { join } from 'node:path';

const glob = new Glob(
    'public/_thumbnail/*.{webp}'
);

interface MetadataTypes {
    width: number,
    height: number,
    src: string
    alt: string
}
const Images: MetadataTypes[] = []
let i = 0

for await (const file of glob.scan('.')) {
    i++
    const data = await Bun.file(file).arrayBuffer()
    const {
        height = 0,
        width = 0,
    } = imageMeta(Buffer.from(data))

    Images.push({
        width,
        height,
        src: file.replace("public", ""),
        alt: `galeria - imagen n${i}`
    })
}

const outputPath = join(process.cwd(), 'src/data/meta-gallery.json')
await Bun.write(outputPath, JSON.stringify(Images))
