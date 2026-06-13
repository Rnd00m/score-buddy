import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type {BggGame, BggSearchItem, BggSearchResponse} from '~/types/bgg'

export const useBggGameSearch = (query: Ref<string>) => {
  return useQuery({
    queryKey: ['bgg-game-search', query],
    queryFn: async (): Promise<BggGame[]> => {
      const response = await $fetch('/api/bgg/search', {
        query: {
          query: query.value,
          type: 'boardgame',
        },
      })

      const items = response.items?.item ?? []
      const list = Array.isArray(items) ? items : [items]

      return list.map((item: BggSearchItem): BggGame => {
        const names = Array.isArray(item.name) ? item.name : [item.name]
        const primaryName = names.find((name) => name.type === 'primary') ?? names[0]

        return {
          id: Number(item.id),
          name: primaryName.value,
          yearPublished: item.yearpublished ? Number(item.yearpublished.value) : null,
        }
      })
    },
    enabled: computed(() => query.value.trim().length > 1),
    staleTime: 1000 * 60 * 1440,
  })
}