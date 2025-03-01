import React from 'react'
import Link from 'next/link'
import get from 'lodash/get'
import clsx from 'clsx'

import { Tooltip } from 'ui'
import { InjectableComponentType as ComponentType } from 'types'
import translations from 'i18n/locales'

const contentRegex = /content="(.*?)"/
const hrefRegex = /href="(.*?)"/
const targetRegex = /target="(.*?)"/
const relRegex = /rel="(.*?)"/
const idRegex = /id="(.*?)"/
const classNameRegex = /className="(.*?)"/
const labelRegex = />(.*?)</

const componentRegexes = {
  [ComponentType.Link]: /<Link(.*?)>(.*?)<\/Link>/gim,
  [ComponentType.Tooltip]: /<Tooltip(.*?)>(.*?)<\/Tooltip>/gim,
  [ComponentType.A]: /<a(.*?)>(.*?)<\/a>/gim,
  [ComponentType.LineBreak]: /<br(.*?)>/gim,
}

export function t(key: string, lang: string) {
  if (!key) {
    return '{missing_translation_key}'
  }

  const translation = get(translations, `${lang}.${key}`)

  if (!translation) {
    // If the translation is unavailable in the locale we just return the key.
    return key
  }

  if (
    translation.indexOf('</Tooltip>') === -1 &&
    translation.indexOf('</Link>') === -1 &&
    translation.indexOf('</a>') === -1 &&
    translation.indexOf('<br') === -1
  ) {
    return translation
  }

  let result = []

  result = injectComponent([translation], ComponentType.Link)
  result = injectComponent(result, ComponentType.Tooltip)
  result = injectComponent(result, ComponentType.A)
  result = injectComponent(result, ComponentType.LineBreak)

  return result
}

function injectComponent(result, type) {
  return result.map((part) => {
    if (typeof part !== 'string') {
      return part
    }

    const regex = componentRegexes[type]
    const parts = []
    let match
    let index = 0
    let lastIndex = 0

    while ((match = regex.exec(part))) {
      parts.push(part.slice(lastIndex, match.index))

      const html = match[0]
      const label = getFirstMatch(html, labelRegex)
      const href = getFirstMatch(html, hrefRegex)
      const className = getFirstMatch(html, classNameRegex)

      switch (type) {
        case ComponentType.A: {
          const target = getFirstMatch(html, targetRegex)
          const rel = getFirstMatch(html, relRegex)

          parts.push(
            <a
              key={index}
              href={href}
              target={target}
              rel={rel}
              className="underline"
            >
              {label}
            </a>
          )
          break
        }

        case ComponentType.Link: {
          parts.push(
            <Link
              key={index}
              href={href}
              className={clsx('cursor-pointer', className)}
              target="_blank"
            >
              {label}
            </Link>
          )
          break
        }

        case ComponentType.Tooltip: {
          const id = getFirstMatch(html, idRegex)
          const tkey = getFirstMatch(html, contentRegex)

          parts.push(
            <Tooltip
              id={id}
              key={tkey}
              href={href}
              className={clsx('cursor-pointer', className)}
              content={tkey}
            >
              {label}
            </Tooltip>
          )
          break
        }

        case ComponentType.LineBreak: {
          parts.push(<br />)
          break
        }
      }

      lastIndex = regex.lastIndex
      index++
    }

    parts.push(part.slice(lastIndex))

    return parts.length > 1 ? parts : parts[0]
  })
}

function getFirstMatch(input: string, regex: RegExp) {
  const match = input.match(regex)

  return match?.length > 0 ? match[1] : null
}
