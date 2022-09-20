import axios from 'axios';
import { PostObjective, PostKeyResult, PostUpdate } from '../types';
import { config } from '../../config';

// Construct query URL
export function constructUrl(
  listId: string,
  selectStr: string,
  expandStr: string,
  filterStr: string
) {
  return `${config.apiUrl}web/Lists(guid'${listId}')/items?` + 
    `$select=${selectStr}` +
    `${expandStr ? '&$expand=' + expandStr : ''}` +
    `${filterStr ? '&$filter=' + filterStr : ''}` +
    `&$top=5000`;
}

// Construct function for get query and returning data
export function constructReadQueryFn(url: string) {
  return async () => {
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json; odata=nometadata'
      }
    });
    return data.value;
  };
};

export function constructCreateQueryFn(url: string) {
  return async () => {
    const { data } = await axios.post(url, {
      headers: {
        'Accept': 'application/json; odata=verbose'
      }
    });
    return data;
  }
};

export async function createQuery(
  listId: string,
  data: PostObjective | PostKeyResult | PostUpdate,
  token: string,
  callback: Function
) {
  const url = `${config.apiUrl}web/Lists(guid'${listId}')/items`
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token
      }
    });
    // const newId = response.data.value[0].ItemId;
    callback();
  } catch (error) {
    console.log('Error:', error);
  }
};

export async function updateQuery(
  listId: string,
  itemId: string,
  data: PostObjective | PostKeyResult | PostUpdate,
  token: string,
  callback: Function
) {
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
};

export async function deleteQuery(
  listId: string,
  itemId: string,
  token: string,
  callback: Function
) {
  const url = `${config.apiUrl}web/Lists(guid'${listId}')/items(${itemId})`
  try {
    const response = await axios.post(url, undefined, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'DELETE'
      }
    });
    // console.log(response);
    callback();
  } catch (error) {
    console.log('Error:', error);
  }
};