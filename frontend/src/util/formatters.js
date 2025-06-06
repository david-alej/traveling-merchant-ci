export const formatPhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== "string" || !/^\d{10}$/.test(phoneNumber)) {
    throw new Error("Input is not a string that has 10 digits.")
  }

  return `(${phoneNumber.substring(0, 3)})${phoneNumber.substring(
    3,
    6
  )}-${phoneNumber.substring(6)}`
}

export const isIsoStr = (str) =>
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)

export const formatDate = (dateString) => {
  if (!dateString) return ""

  if (!isIsoStr(dateString)) {
    throw new Error("Input is not a date in ISO string format.")
  }

  const dateObj = new Date(dateString)

  const formatter = new Intl.DateTimeFormat("en-US", {
    minute: "numeric",
    hour: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "US/Central",
    formatMatcher: "basic",
  })

  return formatter.format(dateObj)
}

export const getTodayIsoDate = () => new Date().toISOString()

export const formatFullDate = (dateString) => formatDate(dateString)

export const formatSimpleDate = (dateString) =>
  formatDate(dateString).split(",").slice(0, -1).join()

export const formatTagsColumn = (arrayTags, shallow) => {
  let tagsString = `${arrayTags[0]}`

  for (let i = 1; i < arrayTags.length; i++) {
    tagsString += `, ${arrayTags[i]}`

    if (i === 2 && shallow) {
      tagsString += ", ..."
      break
    }
  }

  return tagsString
}
