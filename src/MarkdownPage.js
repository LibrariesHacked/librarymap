import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'markdown-to-jsx'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import SiteBreadcrumbs from './SiteBreadcrumbs'

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h3',
        color: 'primary',
        textAlign: 'center'
      }
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h4', color: 'textSecondary' }
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h5', color: 'textSecondary' }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h6',
        paragraph: true,
        color: 'textSecondary'
      }
    },
    p: {
      component: Typography,
      props: { paragraph: true, color: 'textPrimary' }
    },
    a: { component: Link },
    li: {
      component: ({ ...props }) => (
        <li>
          <Typography component='span' {...props} />
        </li>
      )
    }
  }
}

export function MarkdownPage (props) {
  const { page, pageName, pageIcon } = props
  const [pageText, setPageText] = useState('')

  useEffect(() => {
    async function fetchPage () {
      const pageData = await window.fetch(page)
      const pageText = await pageData.text()
      setPageText(pageText)
    }
    fetchPage()
  }, [page])

  return (
    <>
      <SiteBreadcrumbs currentPageName={pageName} currentPageIcon={pageIcon} />
      <ReactMarkdown options={options}>{pageText}</ReactMarkdown>
    </>
  )
}

export const MemoMarkdownPage = React.memo(MarkdownPage)
