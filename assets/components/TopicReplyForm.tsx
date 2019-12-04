import React, { SFC, useState, useContext } from "react";
import topicReplyService from "../services/topicReply.service";
import authContext from "../contexts/auth.context";

export interface TopicReplyFormProps {
  topic_id: number;
  addReply: (value: any) => void;
}

const TopicReplyForm: SFC<TopicReplyFormProps> = ({ topic_id, addReply }) => {
  const [content, setContent] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const { userData } = useContext(authContext);

  const handleChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsSubmit(true);

    const credentials = {
      content: content,
      topic: `/api/topics/${topic_id}`,
      author: `/api/users/${userData.id}`
    };

    topicReplyService
      .create(credentials)
      .then(response => {
        const data = {
          ["@id"]: response.data["@id"],
          ["@type"]: response.data["@type"],
          id: response.data.id,
          content: response.data.content,
          author: response.data.author
        };
        addReply(data);
        setContent("");
        setIsSubmit(false);
      })
      .catch(err => {
        console.error(err);
        setIsSubmit(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          name="content"
          className="form__textarea"
          value={content}
          placeholder="Content"
          onChange={handleChange}
          id="content"
          minLength={2}
          cols={10}
          rows={10}
        ></textarea>
        <label htmlFor="content" className="form__label">
          Content
        </label>
      </div>
      <button
        type="submit"
        className={`btn btn--center ${isSubmit ? "btn--disabled" : ""}`}
      >
        {(!isSubmit && (
          <>
            <svg>
              <use xlinkHref="../img/sprite.svg#icon-reply" />
            </svg>
            Reply
          </>
        )) || <>Loading...</>}
      </button>
    </form>
  );
};

export default TopicReplyForm;