import { Request, Response } from 'express'

class Intro {
  public async intro(req: Request, res: Response) {
    try {
      return res.status(200).json({ ok: 200 })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}

const intro = new Intro()
export default intro
