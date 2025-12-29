import * as cheerio from 'cheerio'
import { env } from '@/env'
import type {
  ScrapedModInfo,
  SteamWorkshopFileDetails,
  WorkshopInfo,
} from './steam-client-protocols'

export class SteamClient {
  private apiKey: string
  private appId: string
  private lastRequestTime = 0
  private readonly REQUEST_DELAY = 5000 // 5 seconds delay

  constructor(apiKey: string, appId = '108600') {
    this.apiKey = apiKey
    this.appId = appId
  }

  private async enforceDelay() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const waitTime = this.REQUEST_DELAY - timeSinceLastRequest
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
  }

  async querySteamWorkshopFiles(
    workshopId: string,
  ): Promise<SteamWorkshopFileDetails | null> {
    await this.enforceDelay()
    const url = `https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=${this.apiKey}&query_type=0&cursor=*&appid=${this.appId}&return_previews=true&return_details=true&publishedfileids[0]=${encodeURIComponent(workshopId)}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status} - ${response.statusText}`,
        )
      }
      const data = await response.json()
      const details = data.response?.publishedfiledetails?.[0]

      if (!details || details.result !== 1) {
        return null
      }

      return details
    } catch (error) {
      throw error
    }
  }

  async scrapeWorkshopPage(workshopId: string): Promise<ScrapedModInfo> {
    await this.enforceDelay()
    const workshopUrl = `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`

    try {
      const response = await fetch(workshopUrl)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch workshop page: ${response.status} ${response.statusText}`,
        )
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text().replace('Steam Workshop::', '')

      if (title === 'Steam Community :: Error') {
        return {
          workshop_id: parseInt(workshopId, 10),
          mod_id: null,
          map_folder: null,
          title: 'Error',
          modsRequirements: [],
          error: 'Mod not found',
        }
      }

      const modsRequirements: {
        name: string
        id: string | null
        url: string
      }[] = []

      const metaDescription =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content')
      const image = $('meta[property="og:image"]').attr('content')
      const rawDescription = $('#highlightContent').html() || ''

      // Check if it is a collection
      const isCollection =
        $('.collectionChildren').length > 0 ||
        $('.subscribeCollection').length > 0

      const collectionItems: string[] = []
      if (isCollection) {
        $('.collectionChildren .collectionItem').each((_, element) => {
          const url = $(element).find('.collectionItemDetails a').attr('href')
          if (url) {
            const urlParams = new URL(url)
            const id = urlParams.searchParams.get('id')
            if (id) collectionItems.push(id)
          }
        })
      }

      $('.requiredItemsContainer a').each((_, element) => {
        const url = $(element).attr('href')
        const name = $(element).find('.requiredItem').text().trim()
        if (url) {
          const urlParams = new URL(url)
          const id = urlParams.searchParams.get('id')
          modsRequirements.push({ name, id, url })
        }
      })

      const modInfo = this.findInfo(rawDescription)

      return {
        title: title.replace('Steam Workshop::', ''),
        description: metaDescription,
        rawDescription: rawDescription,
        imageURL: image,
        modsRequirements: modsRequirements,
        ...modInfo,
        error: null,
        isCollection,
        collectionItems,
      }
    } catch (error) {
      throw error
    }
  }

  private findInfo(contentText: string | null): WorkshopInfo {
    if (!contentText) {
      return { workshop_id: null, mod_id: null, map_folder: null }
    }

    // Remove HTML tags for regex matching
    const cleanText = contentText.replace(/<[^>]*>?/gm, '\n')

    const workshopIdMatch = cleanText.match(/Workshop ID:\s*(\d+)/i)

    const modIdSet = new Set<string>()
    // Match "Mod ID:" followed by anything until newline or <br>
    const modIdLines = cleanText.matchAll(/Mod ID:\s*([^\n<]+)/gi)
    for (const match of modIdLines) {
      if (match[1]) {
        // Split by comma or semicolon
        const ids = match[1].split(/[,;]/)
        for (const id of ids) {
          const trimmed = id.trim()
          if (trimmed) {
            modIdSet.add(trimmed)
          }
        }
      }
    }

    const mapFolderSet = new Set<string>()
    const mapFolderLines = cleanText.matchAll(/Map Folder:\s*([^\n<]+)/gi)
    for (const match of mapFolderLines) {
      if (match[1]) {
        // Map folders can contain commas (e.g. "Constown, KY"), so we split by semicolon only
        const folders = match[1].split(';')
        for (const folder of folders) {
          const trimmed = folder.trim()
          if (trimmed) {
            mapFolderSet.add(trimmed)
          }
        }
      }
    }

    return {
      workshop_id: workshopIdMatch ? parseInt(workshopIdMatch[1], 10) : null,
      mod_id: modIdSet.size > 0 ? Array.from(modIdSet) : null,
      map_folder: mapFolderSet.size > 0 ? Array.from(mapFolderSet) : null,
    }
  }
}

export const steamClient = new SteamClient(env.STEAM_API_KEY)
