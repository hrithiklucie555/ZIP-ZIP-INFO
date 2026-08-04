import { Routes } from '@angular/router';

import { PortalSelection } from './shared/portal-selection/portal-selection';

import { Login } from './admin/login/login';
import { Dashboard } from './admin/dashboard/dashboard';
import { Newsletters } from './admin/newsletters/newsletters';
import { ManageNewsletters } from './admin/manage-newsletters/manage-newsletters';
import { Subscribers } from './admin/subscribers/subscribers';
import { Reports } from './admin/reports/reports';
import { Settings } from './admin/settings/settings';

import { Register } from './subscriber/register/register';
import { Login as SubscriberLogin } from './subscriber/login/login';
import { Home } from './subscriber/home/home';
import { Inbox } from './subscriber/inbox/inbox';
import { ReadNewsletter } from './subscriber/read-newsletter/read-newsletter';

import { Layout } from './layout/layout';
import { HelpSupport } from './admin/help-support/help-support';
import { HelpSupport as SubscriberHelpSupport } from './subscriber/help-support/help-support';

export const routes: Routes = [


  {
    path: '',
    component: PortalSelection
  },



  {
    path: 'login',
    component: Login
  },



  {
    path: '',
    component: Layout,
    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'newsletters',
        component: Newsletters
      },

      {
        path: 'manage-newsletters',
        component: ManageNewsletters
      },

      {
        path: 'subscribers',
        component: Subscribers
      },

      {
        path: 'reports',
        component: Reports
      },

      {
        path: 'settings',
        component: Settings
      }

    ]
  },



  {
    path: 'subscriber-register',
    component: Register
  },

  {
    path: 'subscriber-login',
    component: SubscriberLogin
  },

  {
    path: 'subscriber-home',
    component: Home
  },

  {
    path: 'subscriber-inbox',
    component: Inbox
  },

  {
    path: 'newsletter/:id',
    component: ReadNewsletter
  },

  {
    path: 'help-support',
    component: HelpSupport
   },

   {
    path: 'subscriber/help-support',
    component: SubscriberHelpSupport
   },


  {
    path: '**',
    redirectTo: ''
  }

];