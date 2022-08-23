import axios from 'axios';
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

export function constructCreateQueryFn(url) {
  return async () => {
    const { data } = await axios.post(url, {
      headers: {
        'Accept': 'application/json; odata=verbose'
      }
    });
    return data;
  }
};

export async function createQuery(listId, data, token, callback) {
  const url = `${config.apiUrl}web/Lists(guid'${listId}')/items`
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token
      }
    });
    // console.log(response);
    callback();
  } catch (error) {
    console.log('Error:', error);
  }
}

export async function updateQuery(listId, itemId, data, token, callback) {
  const url = `${config.apiUrl}web/Lists(guid'${listId}')/items(${itemId})`
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'MERGE'
      }
    });
    // console.log(response);
    callback();
  } catch (error) {
    console.log('Error:', error);
  }
}