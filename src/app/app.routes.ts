import { Routes } from '@angular/router';
import { CommonLogin } from './shared/common-login/common-login';
import { ForgotPassword } from './shared/forgot-password/forgot-password';

// ==========================
// Admin
// ==========================

import { Dashboard } from './admin/dashboard/dashboard';
import { Newsletters } from './admin/newsletters/newsletters';
import { ManageNewsletters } from './admin/manage-newsletters/manage-newsletters';
import { Subscribers } from './admin/subscribers/subscribers';
import { Reports } from './admin/reports/reports';
import { Settings } from './admin/settings/settings';
import { HelpSupport } from './admin/help-support/help-support';
import { Editors } from './admin/editors/editors';

// ==========================
// Subscriber
// ==========================

import { Register } from './subscriber/register/register';
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
  // Common Login
  // Admin / Editor / Subscriber
  // ==========================

  {
    path: '',
    component: CommonLogin
  },

  {
    path: 'login',
    component: CommonLogin
  },

  
  {
  path: 'forgot-password',
  component: ForgotPassword
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
    path: 'editors',
    component: Editors
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
    redirectTo: '',
    pathMatch: 'full'
  }

];