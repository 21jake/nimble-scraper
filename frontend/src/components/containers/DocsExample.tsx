import { cilCode, cilMediaPlay } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react-pro'
import React from 'react'

// import packageJson from '../../package.json'

interface IDocsExample {
  children: React.ReactNode,
  href: string,
}

const DocsExample = (props : IDocsExample) => {
  const { children, href } = props

  const _href = `https://coreui.io/react/docs/4.1/${href}`

  return (
    <div className="example">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink href="#" active>
            <CIcon icon={cilMediaPlay} className="me-2" />
            Preview
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href={_href} target="_blank">
            <CIcon icon={cilCode} className="me-2" />
            Code
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="rounded-bottom">
        <CTabPane className="p-3 preview" visible>
          {children}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

// DocsExample.propTypes = {
//   children: PropTypes.node,
//   href: PropTypes.string,
// }

export default React.memo(DocsExample)
