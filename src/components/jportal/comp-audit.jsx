import * as React from 'react';
import { useState } from 'react';
import './CompletedAudit.css';
import { QualityAudit, QualityAuditMetadata, QualityAuditQuestionMetadata } from 'interfaces';
import { format } from '~lib/format';
import { sortQuestions } from '~state/slices/auditEdit/qa-util';
import { PieChart } from './PieChart/PieChart';
import { AuditItemDetails } from './AuditItemDetails/AuditItemDetails';
import { CheckBoxes } from '../../_common/CheckBoxes/CheckBoxes';
import { DropDownMenu } from '~components/_common/DropDownMenu';
import { getAuditScore } from '../_common/qa-util';
import { useDispatchAction, useOnModalResult } from '~lib/react-util';
import { showModal } from '~state/slices/modal';
import { api } from '~api';

interface CompletedAuditProps {
  audit: QualityAudit;
  metaData: QualityAuditMetadata;
  allowEdit: boolean;
}

const tableProps: {[prop in keyof QualityAudit]?: string} = {
  auditType: 'AUDIT TYPE',
  auditSubType: 'AUDIT SUB-TYPE',
  caseId: 'CASE ID',
  caseOwnerId: 'CASE OWNER ID',
  date: 'DATE',
  interactionType: 'INTERACTION TYPE',
  interactionId: 'INTERACTION ID',
  serviceCategory: 'SERVICE CATEGORY',
  serviceOffering: 'SERVICE OFFERING'
};

const formatPropAsDate = [
  'DATE'
];

const checkboxes = [
  {
    name: 'customer-critical',
    key: 'customerCritical',
    label: 'Customer critical'
  },
  {
    name: 'business-critical',
    key: 'businessCritical',
    label: 'Business critical'
  },
  {
    name: 'compliance',
    key: 'compliance',
    label: 'Compliance'
  },
];

export const CompletedAudit: React.FunctionComponent<CompletedAuditProps> = ({audit, metaData}) => {
  const [showDisputeComment, setShowDisputeComment] = useState(false);
  const [showDisputeButton, setShowDisputeButton] = useState(false);
  const [disputerComment, setDisputerComment] = useState('');
  const [disputerCommentId, setDisputerCommentId] = useState('');
  const [disputerDetails, setDisputerDetails] = useState({});

  const addDisputerDetails = () => {
    return setDisputerDetails({...disputerDetails, id: disputerCommentId, value: disputerComment})
  }
  // console.log(disputerDetails)

  const onClickDispute = () => setShowDisputeComment(true);

  const modalDefaults = {
    height: '20rem',
    width: '30rem',
    title: 'Dispute the question'
  };
  const boundShowModal = useDispatchAction(showModal);
  const onClickSubmitDispute = () => {
    boundShowModal({...modalDefaults, component: 'ConfirmModal', id: 'Dispute/submit', props: {
      text: `Would you like to submit the question?` }
    });
    setShowDisputeComment(false);
    setShowDisputeButton(true);
  };

   // useOnModalResult('Dispute/submit', async () => {
  //   try {
  //     await api.post('', {disputerComment: {disputerComment, disputerCommentId}});  
  //     boundShowModal({...modalDefaults, component: 'InfoModal', props: {
  //       text: 'The question has been submitted successfully'
  //     }});
  //     setDisputeQuestion('');
  //   } catch (error) {
  //     console.error(error);
  //     boundShowModal({...modalDefaults, component: 'InfoModal', props: {text: String(error)}});
  //   }
  // });    commented out until finalizing

  
  const [type, setType] = useState<'standard' | 'copc'>('standard');

  const [checkedItems, setCheckedItems] = useState({'customer-critical': true, 'business-critical': true, 'compliance': true});
  const handleChange = (event: { target: { name: any, checked: any }}) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
  };
  
  const typeItems = [
    {label: 'STANDARD SCORE', value: 'standard'},
    {label: 'COPC SCORE', value: 'copc'}
  ];
  
  const metadataMap: {[id: string]: QualityAuditQuestionMetadata} = metaData.reduce((aggr, q) => {
    aggr[q.id] = q;
    return aggr;
  }, {});
 
  const customerCritical = audit.details.filter(q => metadataMap[q.id].category === 'CUSTOMER CRITICAL');
  const businessCritical = audit.details.filter(q => metadataMap[q.id].category === 'BUSINESS CRITICAL');
  const compliance = audit.details.filter(q => metadataMap[q.id].category === 'COMPLIANCE '); // there is some space here

  const addCustomerCritical = checkedItems['customer-critical'] ? customerCritical : [];
  const addBusinessCritical = checkedItems['business-critical'] ? businessCritical : [];
  const addCompliance = checkedItems.compliance ? compliance : [];
  const auditDetails = [...addCustomerCritical, ...addBusinessCritical, ...addCompliance];
  
  const auditScores = getAuditScore(type, audit);
  
  return (
    <div className="completed-audit">
      <div className="completed-audit__header">
        <div className="completed-audit__table">
            {Object.entries(tableProps).map(([prop, label]) => (
              <div key={label} className="completed-audit__table-row">
                <div className="completed-audit__table-label">{label}</div>
                <div className="completed-audit__table-value">
                  {formatPropAsDate.includes(label as string) ? format.number.asDate(audit[prop] as number) : audit[prop]}
                </div>
              </div>
            ))}
        </div>
        <div className="completed-audit__button-container">
          {
            showDisputeComment ?
            disputerComment ? <div className="completed-audit__dispute-button submit" onClick={onClickSubmitDispute}>Submit dispute</div> :
            <div className="completed-audit__dispute-button" onClick={onClickDispute}>dispute</div>
            :
            showDisputeButton ? null : <div className="completed-audit__dispute-button" onClick={onClickDispute}>dispute</div>
          }
        </div>
        <div className="completed-audit__overview">
          <div>
            <h1>Overview</h1>
            <div className="completed-audit__select">
             <DropDownMenu items={typeItems} selected={type} onChange={setType} className="white" />
            </div>
          </div>
            <div className="completed-audit__score_total">
              {type === 'standard' ? format.number.asFloat(auditScores.overall, 1) : format.number.asInteger(auditScores.overall || 0) + '%'}
            </div>
          <div className="completed-audit__charts">
            <PieChart progress={auditScores.customer} label="CUSTOMER CRITICAL" firstFill="#B8E083" secondFill="#EB0F31"/>
            <PieChart progress={auditScores.business} label="BUSINESS CRITICAL" firstFill="#AACEE5" secondFill="#EB0F31"/>
            <PieChart progress={auditScores.compliance} label="COMPLIANCE" firstFill="#2D77B7" secondFill="#EB0F31"/>
          </div>
        </div>
      </div>
      <div className="completed-audit__container">
        <div className="completed-audit__questions-header">
          <h2>Question Id</h2>
          <h2>Score</h2>
          <div>
            <h2>Questions/Answers/Comments</h2>
            <CheckBoxes checkboxes={checkboxes} handleChange={handleChange} checkedItems={checkedItems}/>
          </div>
        </div>
        {!Array.isArray(auditDetails) ? null : auditDetails.slice().sort(sortQuestions).map(question => 
          <AuditItemDetails key={question.id} metaData={metadataMap} question={question} showDisputeComment={showDisputeComment}
          setDisputerComment={setDisputerComment} setDisputerCommentId={setDisputerCommentId} addDisputerDetails={addDisputerDetails}/>
        )}
      </div>
    </div>
  );
};
