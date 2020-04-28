import {beamsplitter} from 'beamsplitter';

import {DEBUG, COOKIE_NAME, NOUSER_ID, USER_TABLE, SESSION_TABLE} from '../common.js';
import {getSearchResult} from '../db_helpers.js';

export default function action({email, username, password}, {getTable, newItem}, req, res) {
  const utable = getTable(USER_TABLE);
  const stable = getTable(SESSION_TABLE);

  const users = getSearchResult({
    table:utable, 
    _search: { 
      _and: true, 
      email, username,
    }
  });

  let userid;

  if ( users ) {
    let firstMatchingUser;

    for( const user of users ) {
      const {salt} = user;
      const passwordHash = beamsplitter(password, salt).toString(16);
      if ( passwordHash == user.passwordHash ) {
        firstMatchingUser = user;
        break;
      }
    }

    if ( !! firstMatchingUser ) {
      if ( !firstMatchingUser.verified ) {
        throw { status: 401, error: `You cannot login until you verify your email address ${firstMatchingUser.email}`};
      }
      userid = firstMatchingUser._id;
    }
  } else {
    throw {status: 404, error: `No such user ${email||''} ${username||''}`};
  }

  if ( userid ) {
    const session = newItem({table:stable, item: {userid}});
    res.cookie(COOKIE_NAME, session._id);

    return {id:userid};
  } else {
    throw {status: 404, error: `No such user ${email||''} ${username||''}`};
  }
}
