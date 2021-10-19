import { s3 } from '../index'

class Uploader {
  public async uploadFile(file: any, path: string = '') {
    try {
      if (path.length) {
        const name = path.split('/')
        console.log(path, name)
        const answer = await s3.Remove(`images/${name[name.length - 1]}`)
      }
      const upload: {
        ETag: string
        VersionId: string
        Location: string
        key: string
        Key: string
        Bucket: string
      } = await s3.Upload({ buffer: file.buffer }, '/images/')
      return upload.Location
    } catch(e) {
      throw new Error(e.message)
    }
  }
}

const uploadAssets = new Uploader()
export default uploadAssets
