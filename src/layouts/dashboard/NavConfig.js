// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Groups / contacts',
    path: '/dashboard/groups',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'Messages',
    path: '/dashboard/messages',
    icon: getIcon('eva:message-square-fill'),
  },
];

export default navConfig;
