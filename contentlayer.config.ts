import path from 'path'
import {
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files'

export const PostMDX = defineDocumentType(() => ({
  name: 'PostMDX',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true }
  }
}))

export const PostMD = defineDocumentType(() => ({
  name: 'PostMD',
  filePathPattern: '**/*.md',
  contentType: 'md',
  fields: {
    title: { type: 'string', required: true }
  }
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [PostMDX, PostMD],
  // Assuming a Markdown bundler works similar to mdx-bundler, the config behavior would be similar for both
  // md: (context) => {
  mdx: (context) => {
    return {
      cwd: path.dirname(context.filePath),
      remarkPlugins: [
        remarkMdxImages,
      ],
      esbuildOptions: (options) => {
        options.platform = 'node'
        options.outdir = path.join(process.cwd(), 'public'),
        options.assetNames = `images/[dir]/[name]`
        options.loader = {
          ...options.loader,
          '.png': 'file',
          '.jpg': 'file',
          '.jpeg': 'file',
        }
        options.publicPath = '/'
        options.write = true
        return options
      }
    }
  }
})
