import validator from 'validator';

type ErrorList = string[];

export const validateObjectiveForm = (
  inputTitle: string,
  inputStartDate: string,
  inputEndDate: string,
  tokenStatus: boolean,
  errorSetter: Function
) => {
  let formOkay = true;

  if (!inputTitle) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a title."];
    });
    formOkay = formOkay && false;
  }

  if (!inputStartDate) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Set a start date."];
    });
    formOkay = formOkay && false;
  } else {
    const validStartDate = validator.isDate(inputStartDate, {format: 'YYYY-MM-DD'});
    if (!validStartDate) {
      errorSetter((prevData: ErrorList) => {
        return [...prevData, "Set a valid start date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!inputEndDate) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Set an end date."];
    });
    formOkay = formOkay && false;
  } else {
    const validEndDate = validator.isDate(inputEndDate, {format: 'YYYY-MM-DD'});
    if (!validEndDate) {
      errorSetter((prevData: ErrorList) => {
        return [...prevData, "Please set a valid end date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!tokenStatus) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Invalid token. Check your permissions."];
    });
    formOkay = formOkay && false;
  }
  
  return formOkay;
}

export const validateKrForm = (
    inputTitle: string,
    inputStartDate: string,
    inputEndDate: string,
    inputMinValue: number | string,
    inputCurrentValue: number | string,
    inputMaxValue: number | string,
    tokenStatus: boolean,
    errorSetter: Function
  ) => {
  let formOkay = true;

  if (!inputTitle) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a title."];
    });
    formOkay = formOkay && false;
  }

  if (!inputStartDate) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Set a start date."];
    });
    formOkay = formOkay && false;
  } else {
    const validStartDate = validator.isDate(inputStartDate, {format: 'YYYY-MM-DD'});
    if (!validStartDate) {
      errorSetter((prevData: ErrorList) => {
        return [...prevData, "Set a valid start date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!inputEndDate) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Set an end date."];
    });
    formOkay = formOkay && false;
  } else {
    const validEndDate = validator.isDate(inputEndDate, {format: 'YYYY-MM-DD'});
    if (!validEndDate) {
      errorSetter((prevData: ErrorList) => {
        return [...prevData, "Please set a valid end date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (inputMinValue === "") {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a minimum value."];
    });
    formOkay = formOkay && false;
  } else if (inputMinValue < 0) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a minimum value of zero or greater."]
    });
    formOkay = formOkay && false;
  } else if(inputMinValue > inputCurrentValue) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Minimum value cannot be greater than current value."]
    });
    formOkay = formOkay && false;
  }

  if (inputMaxValue === "") {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a maximum value."];
    });
    formOkay = formOkay && false;
  } else if (inputMaxValue < 1) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input a maximum value of 1 or greater."]
    });
    formOkay = formOkay && false;
  } else if(inputMaxValue < inputCurrentValue) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Maximum value cannot be smaller than current value."]
    });
    formOkay = formOkay && false;
  }

  if (!tokenStatus) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Invalid token. Check your permissions."];
    });
    formOkay = formOkay && false;
  }
  
  return formOkay;
}

export const validateUpdateForm = (
  inputDate: string,
  inputUpdateText: string,
  tokenStatus: boolean,
  errorSetter: Function
) => {
  let formOkay = true;

  if (!inputUpdateText) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Input an update."];
    });
    formOkay = formOkay && false;
  }

  if (!inputDate) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Set a start date."];
    });
    formOkay = formOkay && false;
  } else {
    const validDate = validator.isDate(inputDate, {format: 'YYYY-MM-DD'});
    if (!validDate) {
      errorSetter((prevData: ErrorList) => {
        return [...prevData, "Set a valid start date."];
      });
      formOkay = formOkay && false;
    }
  }

  if (!tokenStatus) {
    errorSetter((prevData: ErrorList) => {
      return [...prevData, "Invalid token. Check your permissions."];
    });
    formOkay = formOkay && false;
  }
  
  return formOkay;
}