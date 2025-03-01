'use client'

import { useState } from 'react'
import Button from './Button'
import CopyIcon from 'public/assets/icons/copy.svg'
import CopyActiveIcon from 'public/assets/icons/copy_active.svg'
import clsx from 'clsx'

export default function CopyButton({
  content,
  children,
  compact,
  classes,
  style,
}: {
  content: string
  children?: any
  compact?: boolean
  classes?: string
  style?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const el = document.createElement('textarea')
    el.value = content
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    setCopied(true)
    setTimeout(() => setCopied(false), compact ? 800 : 2000)
  }

  if (compact) {
    return (
      <button
        className={clsx('cursor-pointer', classes)}
        onClick={copy}
        title={copied ? 'Copied!' : 'Copy'}
      >
        {!copied && <CopyIcon className="w-8" />}
        {copied && <CopyActiveIcon className="w-8" />}
      </button>
    )
  }

  return (
    <Button
      classes={classes}
      round
      style={style || 'green'}
      size="tiny"
      onClick={copy}
    >
      {copied ? 'Copied!' : children}
    </Button>
  )
}
