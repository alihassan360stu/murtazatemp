import { UPDATE_SELECTED_ORG } from '@jumbo/constants/ActionTypes';

export const setSelectedOrg = org => {
  return dispatch => {
    localStorage.setItem('cypress_selected_org_1001', JSON.stringify(org));
    dispatch({
      type: UPDATE_SELECTED_ORG,
      payload: org,
    });
  };
};

