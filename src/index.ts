import { merge } from 'lodash'
import glob from 'glob'
import fs from 'fs-extra'
import rimraf from 'rimraf'
import path from 'path'

export interface Options {
  cleanDest?: boolean,
  cleanDestExcludes?: string[]
  excludes?: string[]
}

const DEFAULT_OPTIONS: Options = {
  cleanDest: false,
  cleanDestExcludes: [],
  excludes: [],
}

async function getIncludes(relativePath: string, excludes?: string[]) {
  return await glob.glob('**', {
    cwd: relativePath,
    dot: true,
    ignore: excludes || [],
    nodir: true,
  })
}

function rmdir(dirpath: string, excludes?: string[]) {
  return new Promise<boolean>(async(resolve, reject) => {
    if (!await fs.exists(dirpath)) return reject('目标目录不存在！')
    if (!excludes || !excludes.length) return rimraf.rimraf(dirpath)
    const matchList = await getIncludes(dirpath, excludes)
    const result = await Promise.all(
      matchList.map(filepath => rimraf.rimraf(path.resolve(dirpath, filepath)))
    )
    console.log(result)
    resolve(result.every(o => !!o))
  })
}

export function copy(src: string, dest: string, options?: Options) {
  return new Promise<void>(async(resolve, reject) => {
    const opts = merge({}, DEFAULT_OPTIONS, options)
    try {
      if (opts.cleanDest) {
        console.log('删除目标目录')
        await rmdir(dest, opts.cleanDestExcludes)
      }
      const matchList = await getIncludes(src, opts.excludes)
      console.log('开始复制')
      console.log(matchList)
      // await Promise.all(
      //   matchList.map(filepath => fs.copy(path.resolve(src, filepath), path.resolve(dest, filepath)))
      // )
      console.log('复制完成')

      resolve()
    } catch (err) {
      reject(err)
    }

  })
}
