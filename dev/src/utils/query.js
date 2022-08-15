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

export function getXRequestDigestValue() {
  const reqDigest = $.ajax({
      url: config.apiUrl + 'contextinfo',
      method: 'POST',
      async: false,
      headers: {
          'Accept': 'application/json; odata=verbose'
      },
      success: function(data) {
          return data;
      },
      error: function(error) {
          console.log(JSON.stringify(error));
      }
  });

  return reqDigest.responseJSON.d.GetContextWebInformation.FormDigestValue;
}

