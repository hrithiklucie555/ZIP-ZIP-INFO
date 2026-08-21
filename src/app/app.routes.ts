import { Routes } from '@angular/router';
import { CommonLogin } from './shared/common-login/common-login';

// ==========================
// Admin
// ==========================

import { Login } from './admin/login/login';
import { Dashboard } from './admin/dashboard/dashboard';
import { Newsletters } from './admin/newsletters/newsletters';
import { ManageNewsletters } from './admin/manage-newsletters/manage-newsletters';
import { Subscribers } from './admin/subscribers/subscribers';
import { Reports } from './admin/reports/reports';
import { Settings } from './admin/settings/settings';
import { HelpSupport } from './admin/help-support/help-support';

// ==========================
// Subscriber
// ==========================

import { Register } from './subscriber/register/register';
import { Login as SubscriberLogin } from './subscriber/login/login';
import { SubscriberHome } from './subscriber/home/home';
import { Inbox } from './subscriber/inbox/inbox';
import { ReadNewsletter } from './subscriber/read-newsletter/read-newsletter';
import { HelpSupport as SubscriberHelpSupport } from './subscriber/help-support/help-support';

// ==========================
// Editor
// ==========================

import { Dashboard as EditorDashboard } from './editor/dashboard/dashboard';
import { CreateNewsletter } from './editor/create-newsletter/create-newsletter';

// ==========================
// Layouts
// ==========================

import { Layout } from './layout/layout';
import { Layout as SubscriberLayout } from './subscriber/layout/layout';


export const routes: Routes = [

  // ==========================
  // Portal Selection
  // ==========================

  {
    path: '',
    component: CommonLogin
  },




  // ==========================
  // Admin Login
  // ==========================

  {
    path: 'login',
    component: Login
  },


  // ==========================
  // Admin Layout
  // ==========================

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
      },

      {
        path: 'help-support',
        component: HelpSupport
      }

    ]
  },


  // ==========================
  // Subscriber Authentication
  // ==========================

  {
    path: 'subscriber-register',
    component: Register
  },

  {
    path: 'subscriber-login',
    component: SubscriberLogin
  },


  // ==========================
  // Subscriber Layout
  // ==========================

  {
    path: 'subscriber',

    component: SubscriberLayout,

    children: [

      {
        path: 'home',
        component: SubscriberHome
      },

      {
        path: 'inbox',
        component: Inbox
      },

      {
        path: 'help-support',
        component: SubscriberHelpSupport
      },

      {
        path: 'newsletter/:id',
        component: ReadNewsletter
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]
  },


  // ==========================
  // Editor Dashboard
  // ==========================

  {
    path: 'editor/dashboard',
    component: EditorDashboard
  },

  {
  path: 'editor/create-newsletter',
  component: CreateNewsletter
},


  // ==========================
  // Wildcard
  // ==========================

  {
    path: '**',
    redirectTo: ''
  }

];