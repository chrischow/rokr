import validator from 'validator';

export const validateObjectiveForm = (inputTitle, inputStartDate, inputEndDate, tokenStatus, errorSetter) => {
  let formOkay = true;

  if (!inputTitle) {
    errorSetter(prevData => {
      return [...prevData, "Input a title."];
    });
    formOkay = formOkay && false;
  }

  if (!inputStartDate) {
    errorSetter(prevData => {
      return [...prevData, "Set a start date."];
    });
    formOkay = formOkay && false;
  } else {
    const validStartDate = validator.isDate(inputStartDate, 'YYYY-MM-DD');
    if (!validStartDate) {
      errorSetter(prevData => {
        return [...prevData, "Set a valid start date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!inputEndDate) {
    errorSetter(prevData => {
      return [...prevData, "Set an end date."];
    });
    formOkay = formOkay && false;
  } else {
    const validEndDate = validator.isDate(inputEndDate, 'YYYY-MM-DD');
    if (!validEndDate) {
      errorSetter(prevData => {
        return [...prevData, "Please set a valid end date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!tokenStatus) {
    errorSetter(prevData => {
      return [...prevData, "Invalid token. Check your permissions."];
    });
    formOkay = formOkay && false;
  }
  
  return formOkay;
}

export const validateKrForm = (
    inputTitle, inputStartDate, inputEndDate, inputMinValue,
    inputMaxValue, tokenStatus, errorSetter
  ) => {
  let formOkay = true;

  if (!inputTitle) {
    errorSetter(prevData => {
      return [...prevData, "Input a title."];
    });
    formOkay = formOkay && false;
  }

  if (!inputStartDate) {
    errorSetter(prevData => {
      return [...prevData, "Set a start date."];
    });
    formOkay = formOkay && false;
  } else {
    const validStartDate = validator.isDate(inputStartDate, 'YYYY-MM-DD');
    if (!validStartDate) {
      errorSetter(prevData => {
        return [...prevData, "Set a valid start date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!inputEndDate) {
    errorSetter(prevData => {
      return [...prevData, "Set an end date."];
    });
    formOkay = formOkay && false;
  } else {
    const validEndDate = validator.isDate(inputEndDate, 'YYYY-MM-DD');
    if (!validEndDate) {
      errorSetter(prevData => {
        return [...prevData, "Please set a valid end date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (inputMinValue === "") {
    errorSetter(prevData => {
      return [...prevData, "Input a minimum value."];
    });
    formOkay = formOkay && false;
  }

  if (inputMaxValue === "") {
    errorSetter(prevData => {
      return [...prevData, "Input a maximum value."];
    });
    formOkay = formOkay && false;
  }

  if (!tokenStatus) {
    errorSetter(prevData => {
      return [...prevData, "Invalid token. Check your permissions."];
    });
    formOkay = formOkay && false;
  }
  
  return formOkay;
}