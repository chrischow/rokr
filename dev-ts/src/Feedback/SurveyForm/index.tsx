import { useEffect, useLayoutEffect, useState } from 'react';
import $ from 'jquery';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AiFillStar } from 'react-icons/ai';
import useToken from '../../shared/hooks/useToken';
import { ISurveyForm } from '../../shared/types';
import { config } from '../../config';

import './styles.css';
import { validateSurveyForm } from '../../shared/utils/validators';
import { createQuery } from '../../shared/utils/query';

interface ISurveyFromProps {
  formCleanup: Function;
}

interface IQuestion {
  qnKey: string;
  qnText: string;
}

export default function SurveyForm(props: ISurveyFromProps) {
  // Get token
  const token = useToken();

  const [surveyPage, setSurveyPage] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [formErrors, setFormErrors] = useState({
    lookAndFeel: true,
    easeOfUse: true,
    meetNeeds: true,
    likeMost: true,
    likeLeast: true,
    suggestions: true,
    overall: true,
  });
  const [hoverState, setHoverState] = useState({
    lookAndFeel: 0,
    easeOfUse: 0,
    meetNeeds: 0,
    overall: 0
  });
  const [formValues, setFormValues] = useState<ISurveyForm>({
    app: 'ROKR',
    Title: 'Survey',
    lookAndFeel: 0,
    easeOfUse: 0,
    meetNeeds: 0,
    likeMost: '',
    likeLeast: '',
    suggestions: '',
    overall: 0
  });

  // Error messages:
  // const errorMessages = {
  //   lookAndFeel: "Choose a score from 1 to 5 on the app's look and feel.",
  //   easeOfUse: "Choose a score from 1 to 5 on the app's ease of use.",
  //   meetNeeds: "Choose a score from 1 to 5 on the app's ability to meet your needs.",
  //   overall: "Choose a score from 1 to 5 on your overall satisfaction with the app."
  // }

  // Survey questions
  const questions = [
    { qnKey: 'lookAndFeel', qnText: 'How would you rate the look and feel of the app?' },
    { qnKey: 'easeOfUse', qnText: 'How would you rate the ease of use of the app?' },
    { qnKey: 'meetNeeds', qnText: 'Does the app meet your needs?' },
    { qnKey: 'likeMost', qnText: 'What do you like most about the app and why?' },
    { qnKey: 'likeLeast', qnText: 'What do you like least about the app and why?' },
    { qnKey: 'suggestions', qnText: 'What would you suggest we do to improve the app?' },
    { qnKey: 'overall', qnText: 'What is your overall satisfaction with the app?' }
  ];

  // Text area
  useLayoutEffect(() => {
    $(function () {
      ['likeMost', 'likeLeast', 'suggestions'].forEach(qnKey => {
        const feedbackTextArea = $(`#${qnKey}`);
        feedbackTextArea.on("change input", function () {
          this.style.height = "auto";
          this.style.height = this.scrollHeight + "px";
        });
      });
    });
  }, []);

  // Focus into text area on survey page load
  useEffect(() => {
    if ([3, 4, 5].includes(surveyPage)) {
      const qnKey = questions[surveyPage].qnKey;
      const nextTextArea = document.getElementById(qnKey);
      nextTextArea && setTimeout(
        () => nextTextArea.focus(),
        300
      );
    }
  }, [surveyPage]);

  // Handle page change
  const handleSelect = (selectedPage: number, e: any) => {
    setSurveyPage(selectedPage);
  };

  // Handle qualitative response
  const handleText = (event: any) => {
    setFormValues(prevData => {
      return {
        ...prevData,
        [event.target.name]: event.target.value
      };
    })
  };

  // Handle completion of text input
  const handleTextDone = (event: any) => {
    if (event.keyCode === 13 && event.ctrlKey) {
      setSurveyPage(prevPage => prevPage + 1)
    }
  };

  // Submit form
  const submitForm = () => {
    // Clear previous errors
    setFormErrors({
      lookAndFeel: true,
      easeOfUse: true,
      meetNeeds: true,
      likeMost: true,
      likeLeast: true,
      suggestions: true,
      overall: true
    });

    // Disable submit button while checking
    setSubmitEnabled(false);

    // Form validation
    const formOkay = validateSurveyForm(
      formValues.lookAndFeel,
      formValues.easeOfUse,
      formValues.meetNeeds,
      formValues.overall,
      token.isSuccess,
      setFormErrors
    );

    if (formOkay) {
      const reqDigest = token.isSuccess && token.data.FormDigestValue;
      const data = {
        __metadata: {
          type: config.surveyListItemEntityTypeFullName
        },
        ...formValues
      }
      createQuery(config.surveyListId, data, reqDigest, props.formCleanup, config.feedbackUrl);
    }
    console.log(formErrors);
    // Re-enable submit button
    setSubmitEnabled(true);
  };

  return (
    <>
      <Carousel
        activeIndex={surveyPage}
        onSelect={handleSelect}
        interval={null}
        wrap={false}
      >
        {
          questions.map((question: IQuestion) => {
            if (['likeMost', 'likeLeast', 'suggestions'].includes(question.qnKey)) {
              return (
                <Carousel.Item onKeyDown={handleTextDone}>
                  <div className="survey-content w-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="survey-question text-center">
                      {question.qnText}
                    </div>
                    <div className="text-grey text-center">
                      Once you're done putting in your feedback, hit <code>Ctrl + Enter</code> to continue.
                    </div>
                    <div className="mt-3" style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
                      <Form.Control
                        as="textarea"
                        id={question.qnKey}
                        name={question.qnKey}
                        className="form-dark form--edit text-small"
                        value={formValues[question.qnKey as keyof ISurveyForm]}
                        onChange={handleText}
                      />
                    </div>
                  </div>
                </Carousel.Item>
              );
            }
            return (
              <Carousel.Item>
                <div className="survey-content w-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="survey-question text-center">
                    {question.qnText}
                  </div>
                  <div className="survey-rating text-center">
                    {
                      [...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <span
                            key={index}
                            className={
                              index <= (hoverState[question.qnKey as keyof typeof hoverState]) ?
                                'survey-star-on' : 'survey-star-off'
                            }
                            onClick={() => {
                              setFormValues(prevData => {
                                return {
                                  ...prevData,
                                  [question.qnKey]: index
                                };
                              });
                              setSurveyPage(prevPage => prevPage + 1);
                            }}
                            // Handle hover
                            onMouseEnter={() => {
                              setHoverState(prevData => {
                                return {
                                  ...prevData,
                                  [question.qnKey]: index
                                };
                              })
                            }}
                            onMouseLeave={() => {
                              setHoverState(prevData => {
                                return {
                                  ...prevData,
                                  [question.qnKey]: formValues[question.qnKey as keyof ISurveyForm]
                                };
                              })
                            }}
                          >
                            <AiFillStar />
                          </span>
                        );
                      })
                    }
                  </div>
                </div>
                {question.qnKey === 'overall' &&
                  <Carousel.Caption>
                    <span className="text-grey">
                      You'll get to check your responses on the next page.
                    </span>
                  </Carousel.Caption>
                }
              </Carousel.Item>
            );
          })
        }
        <Carousel.Item>
          <div className="survey-check text-center">
            <div className="survey-question text-center mt-3">
              Click on the question title to go back to the survey question.
            </div>
            <Row className="justify-content-center">
              {
                questions.map((question: IQuestion, qnIndex: number) => {
                  const qnKey = question.qnKey;
                  const responseValue = formValues[qnKey as keyof typeof hoverState];
                  let textTitle;
                  if (qnKey === 'likeMost') {
                    textTitle = 'What You Liked Most';
                  } else if (qnKey === 'likeLeast') {
                    textTitle = 'What You Liked Least';
                  } else if (qnKey === 'suggestions') {
                    textTitle = 'Your Suggestions';
                  }
                  return (
                    <Col xs={6}>
                      <div
                        className={`survey-check-title mt-3 ${!formErrors[qnKey as keyof typeof formErrors] ? "survey-check-error" : ""}`}
                      >
                        <span onClick={() => setSurveyPage(qnIndex)}>
                          {question.qnText}
                        </span>
                      </div>
                      {![3, 4, 5].includes(qnIndex) &&
                        <div className="survey-check-stars">
                          {[...Array(5)].map((star, index) => {
                            return (
                              <span
                                className={
                                  index < (responseValue) ?
                                    'survey-star-on' : 'survey-star-off'
                                }
                              >
                                <AiFillStar />
                              </span>
                            );
                          })}
                        </div>
                      }
                      {[3, 4, 5].includes(qnIndex) && !responseValue &&
                        <span className="text-grey survey-check-text">
                          Nil
                        </span>
                      }
                      {[3, 4, 5].includes(qnIndex) && Boolean(responseValue) &&
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={
                            <Popover id={`popover-${qnKey}`}>
                              <Popover.Header>
                                {textTitle}
                              </Popover.Header>
                              <Popover.Body>
                                {responseValue}
                              </Popover.Body>
                            </Popover>}
                        >
                          <span className="text-green survey-check-text">Place your cursor here to see your response.</span>
                        </OverlayTrigger>
                      }
                    </Col>
                  );
                })
              }
            </Row>
            <button
              className="btn btn-green mt-3"
              onClick={submitForm}
              disabled={!submitEnabled}
            >
              Submit Survey
            </button>
          </div>
        </Carousel.Item>
      </Carousel>
    </>
  );
}