import axios from 'axios';
import $ from 'jquery';
import { config } from '../config';

// Construct query URL
export function constructUrl(listId, selectStr, expandStr, filterStr) {
  return `${config.apiUrl}web/Lists(guid'${listId}')/items?` + 
    `$select=${selectStr}` +
    `${expandStr ? '&$expand=' + expandStr : ''}` +
    `${filterStr ? '&$filter=' + filterStr : ''}` +
    `&$top=5000`;
}

// Construct function for get query and returning data
export function constructReadQueryFn(url) {
  return async () => {
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json; odata=nometadata'
      }
    });
    return data.value;
  };
};

export function constructPostQueryFn(url) {
  return async () => {
    const { data } = await axios.post(url, {
      headers: {
        'Accept': 'application/json; odata=verbose'
      }
    });
    return data;
  }
};