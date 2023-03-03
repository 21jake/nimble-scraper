import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

interface IRoute {
  path: string;
  name: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  exact?: boolean;
}

interface IBreadCrumbs {
  pathname: string,
  name: string,
  active: boolean
}

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname : string, routes : IRoute[]) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    if (!currentRoute) return "";
    return currentRoute.name
  }

  const getBreadcrumbs = (location: string) => {
    const breadcrumbs : IBreadCrumbs[]  = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, routes),
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
