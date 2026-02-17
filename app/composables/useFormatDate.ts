export const useFormatDate = () => {
  const formatDate = (dateString: string, format: 'short' | 'long' = 'long'): string => {
    if (!dateString) return ''
    const date = new Date(dateString)

    if (format === 'short') {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }

    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return { formatDate }
}
