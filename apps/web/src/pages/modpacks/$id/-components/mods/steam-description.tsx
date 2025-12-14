import type React from 'react'
import { useMemo } from 'react'

interface SteamDescriptionProps {
  content?: string | null
}

type Token =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'tag'
      content: string
      tagName: string
      param?: string
      isClose: boolean
    }

export function SteamDescription({ content }: SteamDescriptionProps) {
  const parsedContent = useMemo(() => {
    if (!content) return null
    return parseBBCode(content)
  }, [content])

  if (!content) return null

  return (
    <div className="steam-description text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
      {parsedContent}
    </div>
  )
}

function parseBBCode(input: string): React.ReactNode {
  const tagRegex =
    /(\[(?:\/)?(?:h1|h2|h3|b|i|u|s|img|url|quote|list|hr|code|\*)(?:=[^\]]+)?\])/gi
  const parts = input.split(tagRegex)

  const tokens: Token[] = parts
    .map((part) => {
      const match = part.match(
        /^\[(\/?)(h1|h2|h3|b|i|u|s|img|url|quote|list|hr|code|\*)(?:=(.+))?\]$/i,
      )
      if (match) {
        return {
          type: 'tag' as const,
          content: part,
          isClose: match[1] === '/',
          tagName: match[2].toLowerCase(),
          param: match[3],
        }
      }
      return { type: 'text' as const, content: part }
    })
    .filter((t) => t.content !== '')

  const root: { tagName: string; children: React.ReactNode[] } = {
    tagName: 'root',
    children: [],
  }
  const stack: {
    tagName: string
    children: React.ReactNode[]
    param?: string
  }[] = [root]

  tokens.forEach((token, index) => {
    const current = stack[stack.length - 1]

    if (token.type === 'text') {
      current.children.push(token.content)
      return
    }

    if (token.type === 'tag') {
      const tagName = token.tagName

      if (tagName === 'hr') {
        current.children.push(
          <hr key={`hr-${index}`} className="my-4 border-border" />,
        )
        return
      }

      if (tagName === '*') {
        // Handle list item
        if (current.tagName === 'list' || current.tagName === 'li') {
          if (current.tagName === 'li') {
            const popped = stack.pop()
            if (popped) {
              const element = <li key={`li-${index}`}>{popped.children}</li>
              stack[stack.length - 1].children.push(element)
            }
          }
          stack.push({ tagName: 'li', children: [] })
          return
        }

        current.children.push(' • ')
        return
      }

      if (token.isClose) {
        if (tagName === 'list' && current.tagName === 'li') {
          const popped = stack.pop()
          if (popped) {
            const element = (
              <li key={`li-${index}-implicit`}>{popped.children}</li>
            )
            stack[stack.length - 1].children.push(element)
          }
        }

        let j = stack.length - 1
        while (j > 0) {
          if (stack[j].tagName === tagName) {
            while (stack.length > j) {
              const popped = stack.pop()
              if (popped) {
                if (popped.tagName === tagName) {
                  const element = renderTag(
                    tagName,
                    popped.param,
                    popped.children,
                    index,
                  )
                  stack[stack.length - 1].children.push(element)
                } else {
                  stack[stack.length - 1].children.push(...popped.children)
                }
              }
            }
            break
          }
          j--
        }
      } else {
        stack.push({ tagName, children: [], param: token.param })
      }
    }
  })

  while (stack.length > 1) {
    const popped = stack.pop()
    if (popped) {
      if (popped.tagName === 'li') {
        stack[stack.length - 1].children.push(
          <li key="dangling-li">{popped.children}</li>,
        )
      } else {
        stack[stack.length - 1].children.push(...popped.children)
      }
    }
  }

  return root.children
}

function renderTag(
  tagName: string,
  param: string | undefined,
  children: React.ReactNode[],
  key: string | number,
) {
  switch (tagName) {
    case 'b':
      return <strong key={key}>{children}</strong>
    case 'i':
      return <em key={key}>{children}</em>
    case 'u':
      return <u key={key}>{children}</u>
    case 's':
      return <s key={key}>{children}</s>
    case 'h1':
      return (
        <h1 key={key} className="text-2xl font-bold mt-6 mb-2 border-b pb-1">
          {children}
        </h1>
      )
    case 'h2':
      return (
        <h2 key={key} className="text-xl font-bold mt-5 mb-2">
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={key} className="text-lg font-bold mt-4 mb-1">
          {children}
        </h3>
      )
    case 'quote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary/50 pl-4 italic my-4 bg-muted/30 p-3 rounded-r text-muted-foreground"
        >
          {children}
        </blockquote>
      )
    case 'code':
      return (
        <pre
          key={key}
          className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto my-4 whitespace-pre wrap-break-word"
        >
          {children}
        </pre>
      )
    case 'url': {
      let href = param
      if (!href && Array.isArray(children) && typeof children[0] === 'string') {
        href = children.join('')
      }
      if (!href) href = '#'
      const finalHref =
        href.startsWith('http') || href.startsWith('//')
          ? href
          : `https://${href}`
      return (
        <a
          key={key}
          href={finalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {children}
        </a>
      )
    }
    case 'img': {
      const src = Array.isArray(children) ? children.join('').trim() : ''
      if (!src) return null
      return (
        <img
          key={key}
          src={src}
          className="max-w-full h-auto rounded-md my-4 block"
          alt={`Mod content ${key}`}
          loading="lazy"
        />
      )
    }
    case 'list':
      return (
        <ul key={key} className="list-disc pl-6 my-2 space-y-1">
          {children}
        </ul>
      )
    default:
      return <span key={key}>{children}</span>
  }
}
