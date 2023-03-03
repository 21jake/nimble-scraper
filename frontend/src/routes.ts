import React from 'react';

const Table = React.lazy(() => import('./components/dummy/Table'));

const Dashboard = React.lazy(() => import('./components/dummy/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./components/dummy/theme/colors/Colors'))
const Typography = React.lazy(() => import('./components/dummy/theme/typography/Typography'))

//Base
const Accordion = React.lazy(() => import('./components/dummy/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./components/dummy/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./components/dummy/base/cards/Cards'))
const Carousels = React.lazy(() => import('./components/dummy/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./components/dummy/base/collapses/Collapses'))
const Jumbotrons = React.lazy(() => import('./components/dummy/base/jumbotrons/Jumbotrons'))
const ListGroups = React.lazy(() => import('./components/dummy/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./components/dummy/base/navs/Navs'))
const Paginations = React.lazy(() => import('./components/dummy/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./components/dummy/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./components/dummy/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./components/dummy/base/progress/Progress'))
const Spinners = React.lazy(() => import('./components/dummy/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./components/dummy/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./components/dummy/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./components/dummy/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./components/dummy/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./components/dummy/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./components/dummy/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./components/dummy/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./components/dummy/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./components/dummy/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./components/dummy/forms/layout/Layout'))
const Range = React.lazy(() => import('./components/dummy/forms/range/Range'))
const Select = React.lazy(() => import('./components/dummy/forms/select/Select'))
const Validation = React.lazy(() => import('./components/dummy/forms/validation/Validation'))

const Charts = React.lazy(() => import('./components/dummy/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./components/dummy/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./components/dummy/icons/flags/Flags'))
const Brands = React.lazy(() => import('./components/dummy/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./components/dummy/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./components/dummy/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./components/dummy/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./components/dummy/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./components/dummy/widgets/Widgets'))

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

const routes = [
  { path: '/table', name: 'table', component: Table },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', component: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/jumbotrons', name: 'Jumbotron', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', component: Placeholders },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress', name: 'Progress', component: Progress },
  { path: '/base/spinners', name: 'Spinners', component: Spinners },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/forms', name: 'Forms', component: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', component: FormControl },
  { path: '/forms/select', name: 'Select', component: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', component: ChecksRadios },
  { path: '/forms/range', name: 'Range', component: Range },
  { path: '/forms/input-group', name: 'Input Group', component: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', component: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', component: Layout },
  { path: '/forms/validation', name: 'Validation', component: Validation },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toasts', name: 'Toasts', component: Toasts },
  { path: '/widgets', name: 'Widgets', component: Widgets },
];

export default routes;
