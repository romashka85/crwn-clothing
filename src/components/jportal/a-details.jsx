import * as React from 'react';
import { QualityAuditQuestion, QualityAuditQuestionMetadata} from 'interfaces';
import './AuditItemDetails.css';

interface AuditItemDetailsProps {
  metaData: {[id: string]: QualityAuditQuestionMetadata};
  question: QualityAuditQuestion;
  showDisputeComment: boolean;
  setDisputerComment: (event: string) => void;
  setDisputerCommentId: (id: string) => void;
  addDisputerDetails: () => void;
}

export const AuditItemDetails: React.FunctionComponent<AuditItemDetailsProps> = ({question, metaData, showDisputeComment,
  setDisputerComment, setDisputerCommentId, addDisputerDetails}) => {
  const { comment, score, answer, id } = question;

  return (
    <div className="audit-item-details">
      <div className={comment
        ? 'audit-item-details__row audit-item-details__row_comment'
        : 'audit-item-details__row'
      }>
        <div>{id || ''}</div>
        <div></div>
        <div>{metaData[id].text}</div>
        <div></div>
        <div>{score || ''}</div>
        <div>{answer}</div>
        {comment ? <div></div> : null}
        {comment ? <div></div> : null}
        {comment ? <div>{comment}</div> : null}
        <div></div>
        <div></div>
        {showDisputeComment ?
          (<div className="dispute-question">
            <textarea placeholder="Dispute the question here" onChange={event => {
            setDisputerComment(id);
            setDisputerCommentId(event.target.value);
            addDisputerDetails();
            }}/>
            <div className="audit-item-details__info">Dispute the Question</div>
          </div>) :
          null}
      </div>
    </div>
  );
};
