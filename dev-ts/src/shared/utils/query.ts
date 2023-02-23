import axios from 'axios';
import { PostObjective, PostKeyResult, PostUpdate, PostFeedback, PostSurvey } from '../types';
import { config } from '../../config';

// Construct query URL
export function constructUrl(
  listTitle: string,
  selectStr: string,
  expandStr?: string,
  filterStr?: string
) {
  return `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items?` + 
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
}

export function constructCreateQueryFn(url: string) {
  return async () => {
    const { data } = await axios.post(url, {
      headers: {
        'Accept': 'application/json; odata=verbose'
      }
    });
    return data;
  }
}

export async function createQuery(
  listTitle: string,
  data: PostObjective | PostKeyResult | PostUpdate | PostFeedback | PostSurvey,
  token: string,
  callback?: Function | null,
  url: string = `${config.apiUrl}`,
) {
  const queryUrl = `${url}web/lists/GetByTitle('${listTitle}')/items`
  try {
    await axios.post(queryUrl, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token
      }
    });
    callback && callback();
  } catch (error) {
    console.log('Error:', error);
  }
}

export async function updateQuery(
  listTitle: string,
  itemId: number | undefined,
  data: PostObjective | PostKeyResult | PostUpdate,
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items(${itemId})`
  try {
    await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'MERGE'
      }
    });
    callback && callback();
  } catch (error) {
    console.log('Error:', error);
  }
}

export async function deleteQuery(
  listTitle: string,
  itemId: number,
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items(${itemId})`
  try {
    await axios.post(url, undefined, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'DELETE'
      }
    });
    callback && callback();
  } catch (error) {
    console.log('Error:', error);
  }
}