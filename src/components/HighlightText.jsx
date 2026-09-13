import React from 'react'

// Wraps every case-insensitive match of `query` in <mark>
const HighlightText = ({ text = '', query = '' }) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return <>{text}</>

  const haystack = text.toLowerCase()
  const parts = []
  let start = 0
  let index = haystack.indexOf(needle)

  while (index !== -1) {
    if (index > start) parts.push(text.slice(start, index))
    parts.push(
      <mark key={index} className="search-highlight">
        {text.slice(index, index + needle.length)}
      </mark>
    )
    start = index + needle.length
    index = haystack.indexOf(needle, start)
  }
  if (start < text.length) parts.push(text.slice(start))

  return <>{parts}</>
}

export default HighlightText
