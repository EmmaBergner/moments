
import styles from "../../styles/Comment.module.css";
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { MoreDropdown } from '../../components/MoreDropdown';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useNavigate } from "react-router-dom";
import { axiosRes } from '../../api/axiosDefault';
import React, { useState } from "react";
import CommentEditForm from "./CommentEditForm";


const Comment = (props) => {

    const {
        id,
        content,
        profile_id,
        profile_image,
        updated_at,
        setComments,
        owner } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner
    const [showEditForm, setShowEditForm] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}/`);
            navigate(-1);
        } catch (err) { console.log(err) }
    };




    return (
        <div>
            <hr />

            <div className='media'>

                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} height={30} />
                </Link>

                <div className="media-body align-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Date}>{updated_at}</span>
                    {showEditForm ? (
                        <CommentEditForm
                            id={id}
                            profile_id={profile_id}
                            content={content}
                            profileImage={profile_image}
                            setComments={setComments}
                            setShowEditForm={setShowEditForm} />
                    ) : (
                        <p>{content}</p>
                    )}
                </div>

                {is_owner && !showEditForm && (
                    <MoreDropdown
                        handleEdit={() => setShowEditForm(true)}
                        handleDelete={handleDelete} />)}
            </div>

        </div>

    )
}

export default Comment