import { XMLParser } from 'fast-xml-parser'

// BGG's XML is double-encoded for some fields (e.g. "King&amp;#039;s Court"),
// so entities surviving the parser's own decoding pass need decoding again.
const decodeEntities = (value: string): string =>
  value.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10)
      return String.fromCodePoint(code)
    }

    switch (entity) {
      case 'amp': return '&'
      case 'lt': return '<'
      case 'gt': return '>'
      case 'quot': return '"'
      case 'apos': return '\''
      default: return match
    }
  })

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  tagValueProcessor: (_tagName, value) => decodeEntities(value),
  attributeValueProcessor: (_attrName, value) => decodeEntities(value),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?.path ?? ''
  const query = getQuery(event)

  const url = new URL(`${config.public.bggApiBaseUrl}/${path}`)
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${config.bggApiKey}`,
    }
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: response.statusText })
  }

  const xml = await response.text()

  return parser.parse(xml)
})