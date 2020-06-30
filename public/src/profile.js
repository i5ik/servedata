import {w, clone} from './web_modules/bepis.js';
import {initializeDSS} from './web_modules/style.dss.js';
import {stylists} from './style.js';
import {hiddenInput, auth_fields as fields} from './fields.js';

const _ = null;
const State = {};


export function init() {
  const {state} = self.loadData;
  Object.assign(State, clone(state));

  initializeDSS({}, stylists);
  Profile(State)(document.body);

  self.addEventListener('hashchange', Route);
  self.addEventListener('submit', saveHash);

  restoreSavedHash();
}

function restoreSavedHash() {
  const hashOnSubmit = localStorage.getItem('hash-on-submit');
  if ( hashOnSubmit ) {
    location.hash = hashOnSubmit;
  }
}

function saveHash() {
  const hashOnSubmit = location.hash.slice(1);
  localStorage.setItem('hash-on-submit', hashOnSubmit);
}

function Route() {
  localStorage.removeItem('hash-on-submit');
  ActiveContent(State);
}

export function Header() {
  return w`
    header ${_} ${"header"}, 
      nav ul ${_} ${"responsiveList"},
        li a ${{href:'/', class:'brand-link'}}  :text ${"Capi.Click"}  .
      .
    .

  `
}

export function Profile({newEmail: newEmail = null, username:username = null, email:email = null, _id:_id = null}) {
  const state = {username, newEmail, email, _id};
  return w`${true}
    main ${_} ${"profileGrid"},
      header ${_} ${"header"}, 
        nav ul ${_} ${"responsiveList"},
          li a ${{href:'/', class:'brand-link'}}  :text ${"Capi.Click"}  .
          li button ${{form:'logout', class:'button-like'}} :text ${"Logout"}.
        .
      .
      section ${{class:'vertical-tabs'}} ${"verticalTabs"},
        ul,
          li a ${{href:'#profile'}} :text ${`My Profile`}.
          li a ${{href:'#account'}}:text  ${`Capi.Click account`}.
          li a ${{href:'#subscriptions'}} :text ${`Purchase`}.
          li a ${{href:'#billing'}} :text ${`Billing account`}.
          li a ${{href:'#usage'}} :text ${`Usage`}.
        .
      .
      section ${{class:'content'}} ${"profileContent"},
        :comp ${state} ${ActiveContent}.
      .
      form ${{
        hidden:true,
        id: 'logout',
        method: 'POST',
        action: `/form/action/logout/redir/app`,
      }},
        input ${{
          type:'hidden', 
          name:'state',
          value:'logged-out'
        }}.
      .
  `;
}

function NewEmail(state) {
  if ( state.newEmail ) {
    return w`
      dt ${"New email (unverified)"},
        br.
        small i ${"check your email for link"}.
      .
      dd ${state.newEmail}.
    `;
  } else {
    return w`dt.`;
  }
}

function Account(state) {
  return w`
    article,
      h1 ${`My Capi.Click Account`}.
      hr.
      dl,
        dt ${"Username"}.
        dd ${state.username}.
        dt ${"Email"}.
        dd ${state.email}.
        :comp ${state} ${NewEmail}.
      .
      section ${{class:'shrink-fit'}},
        form ${{
          class:'v-gapped full-width',
          method: 'POST',
          action: `/form/action/update_email/redir/profile`
        }} ${'form'},
          fieldset,
            legend ${"Change email"}.
            p label ${"Email"} input ${fields.email}.
            :comp ${{name:'_id', value:state._id}} ${hiddenInput}.
            :comp ${{name:'username', value:state.username}} ${hiddenInput}.
            p label button ${"Update"}.
          .
        .
        form ${{
            class:'v-gapped full-width',
            method: 'POST',
            action: `/form/table/users/${state._id}/with/profile`
          }} ${'form'},
          fieldset,
            legend ${"Change username"}.
            p label ${"Username"} input ${fields.username}.
            p label button ${"Update"}.
          .
        .
        form ${{
            class:'v-gapped full-width',
            method: 'POST',
            action: `/form/action/update_password/redir/profile`
          }} ${'form'},
          fieldset,
            legend ${"Change password"}.
            :comp ${{name:'_id', value:state._id}} ${hiddenInput}.
            :comp ${{name:'username', value:state.username}} ${hiddenInput}.
            p label ${"Password"} input ${fields.password}.
            p label button ${"Update"}.
          .
        .
      .
    .
  `
}

function BillingAccount() {
  return w`
    article,
      h1 ${"Billing Account"}.
      hr.
      b ${"Credit balance "}.
      span ${"100 credits"}.
    .
  `;
}

function Usage() {
  return w`
    article,
      h1 ${"Usage"}.
      hr.
      b ${"Credits used "}.
      span ${"50 credits"}.
    .
  `;
}

function Purchases() {
  return w`
    article,
      h1 ${"Credits & Subscriptions"}.
      hr.
      section ${{class:'shrink-fit'}},
        form ${{
            class:'full-width',
            method: 'POST',
            action: '/form/action/pay/with/tocheckout'
          }} ${'form'},
          fieldset,
            legend ${"Subscription purchase"}.
            :comp ${{name:'mode', value:"subscription"}} ${hiddenInput}.
            p label ${{innerText:"Purchase option "}} select ${{name:'price'}},
              option ${{value:"price_1GxoLaBKxtsqOlor5Dr9pXR1"}} :text ${"Capi.Click Monthly Subscription"}.
            .
            p button ${"Buy Now"}.
          .
        .
        form ${{
            class:'full-width',
            method: 'POST',
            action: '/form/action/pay/with/tocheckout'
          }} ${'form'},
          fieldset,
            legend ${"Credit pack purchase"}.
            :comp ${{name:'mode', value:"payment"}} ${hiddenInput}.
            p label ${{innerText:"Purchase option "}} select ${{name:'price'}},
              option ${{value:"price_1GxoLbBKxtsqOlor1N2goLyw"}} :text ${"Task Run Credits Recharge 9100 Pack"}.
              option ${{value:"price_1GxoLcBKxtsqOlorY0TVJahM"}} :text ${"Task Run Credits Recharge 2400 Pack"}.
              option ${{value:"price_1GxoLcBKxtsqOlor6lT2W0na"}} :text ${"Task Run Credits Recharge 750 Pack"}.
            .
            p button ${"Buy Now"}.
          .
        .
      .
    .
  `;
}

function Default() {
  return w`
    article ${{class:'profile'}},
      h1 ${`My profile`}.
      hr.
      dl,
        dt ${"Active Purchases"}.
        dd ${"Some Credit Pack"}.
        dd ${"Some Subscription"}.
      .
      dl,
        dt ${"Current Balance"}.
        dd ${"50 Credits."}.
      .
      dl,
        dt ${"Services Uses"}.
        dd ${"RemoteView"}.
        dd ${"22120"}.
      .
    .
  `
}

function ActiveContent(state) {
  const hash = window.location.hash.slice(1);
  let view = Default;
  switch(hash) {
    case "billing":
      view = BillingAccount;
      break;
    case "usage":
      view = Usage;
      break;
    case "onetimepayments":
    case "subscriptions":
      view = Purchases;
      break;
    case "account":
      view = Account;
      break;
    default: 
      view = Default;
      break;
  }

  // make a pinner container for active content to render and be replaced in 
  return w`${true}
    :comp ${state} ${view}
  `;
}

