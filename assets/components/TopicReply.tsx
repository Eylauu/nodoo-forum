import React, { useContext, useState, FormEvent } from "react";
import authContext from "../contexts/auth.context";
import topicReplyService from "../services/topicReply.service";
import topicService from "../services/topic.service";
import DeleteTopicModal from "./DeleteTopicModal";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Button from "./Button";
import Dropdown from "./Dropdown";

interface Props {
  data: any;
  isTopic: boolean;
  updateTitle: (value: string) => void;
  deleteReply: (value: number) => void;
  history: any;
}

const TopicReply: React.SFC<Props> = ({
  data,
  isTopic,
  updateTitle,
  deleteReply,
  history
}) => {
  const { isAuthenticated, userData } = useContext(authContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [credentials, setCredentials] = useState(data);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditBtn = () => {
    setShowDropdown(!showDropdown)
    setShowEditForm(true);
  };

  const handleDeleteBtn = () => {
    setShowDropdown(!showDropdown)
    setShowDeleteModal(!showDeleteModal);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);

    if (isTopic) {
      topicService
        .update({
          id: credentials.id,
          title: credentials.title,
          content: credentials.content
        })
        .then(response => {
          setIsSubmit(false);
          setShowEditForm(false);
          updateTitle(response.data.title);
          history.replace(`/topics/${response.data.slug}--${response.data.id}`);
        })
        .catch(err => {
          console.error(err);
          setIsSubmit(false);
        });
    } else {
      topicReplyService
        .update({ id: credentials.id, content: credentials.content })
        .then(() => {
          setIsSubmit(false);
          setShowEditForm(false);
        })
        .catch(err => {
          console.error(err);
          setIsSubmit(false);
        });
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleEditorChange = (e: any) => {
    setCredentials({ ...credentials, content: e.target.getContent() });
  };

  const handleClose = (e: any) => {
    e.preventDefault();
    setShowEditForm(false);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteTopicModal
          isTopic={isTopic}
          id={credentials.id}
          isDisplayed={setShowDeleteModal}
          displayStatus={showDeleteModal}
          history={history}
          deleteReply={deleteReply}
        />
      )}
      {(showEditForm && (
        <form onSubmit={handleSubmit}>
          {isTopic && (
            <div className="form-group">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={credentials.title}
                className="form__input"
                onChange={handleChange}
                minLength={2}
              />
            </div>
          )}
          <div className="form-group">
            <Editor
              apiKey={process.env.TINYMCE_API_KEY}
              initialValue={credentials.content}
              init={{
                height: 250,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount"
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help"
              }}
              onChange={handleEditorChange}
            />
          </div>
          <div className="reply__actions">
            <Button isSubmit={isSubmit} className="btn--square btn--small" icon="pencil" text="Edit" />
            <button
              className="btn btn--square btn--small btn--light"
              onClick={handleClose}
            >
              <svg>
                <use xlinkHref="../img/sprite.svg#icon-close" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      )) || (
          <div className="topic-informations">
            <div className="topic-informations__author">
              <img
                src={`../img/users/${credentials.author.avatar}`}
                alt="User's avatar"
              />
              <NavLink to={`/profile/${credentials.author.id}`}>
                {credentials.author.username}
              </NavLink>
            </div>
            <div className="topic-informations__main">
              <div className="topic-informations__header">
                <p className="topic-informations__header-date">
                  Created {moment(credentials.createdAt).fromNow()}
                  {credentials.updatedAt !== credentials.createdAt &&
                    `-- Last updated ${moment(credentials.updatedAt).fromNow()}`}
                </p>
                {isAuthenticated &&
                  userData.username === credentials.author.username && (
                    <div className="topic-informations__header-cta">
                      <button onClick={() => setShowDropdown(!showDropdown)} className="dropdown__btn">
                        {(!showDropdown && (
                          <svg>
                            <use xlinkHref="../img/sprite.svg#icon-chevron-down" />
                          </svg>
                        )) || (
                            <svg>
                              <use xlinkHref="../img/sprite.svg#icon-chevron-up" />
                            </svg>
                          )}
                      </button>
                      {showDropdown && (
                        <Dropdown isDisplayed={setShowDropdown} displayStatus={showDropdown}>
                          <button
                            className="dropdown__item"
                            onClick={handleEditBtn}
                          >
                            <svg>
                              <use xlinkHref="../img/sprite.svg#icon-pencil" />
                            </svg>
                            Edit
                        </button>
                          <button
                            className="dropdown__item"
                            onClick={handleDeleteBtn}
                          >
                            <svg>
                              <use xlinkHref="../img/sprite.svg#icon-trash" />
                            </svg>
                            Delete
                        </button>
                        </Dropdown>
                      )}
                    </div>
                  )}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: credentials.content }}
              ></div>
              <div className="topic-informations__cta"></div>
            </div>
          </div>
        )}
    </>
  );
};

export default TopicReply;
