import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Image, Col, Row, Container, Alert } from "react-bootstrap";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefault";

function PostEditForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({ title: "", content: "", image: "" });

  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}`)
        const { title, content, image, is_owner } = data;
        is_owner ? setPostData({ title, content, image }) : navigate("/");
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [navigate, id]);



  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0])
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/posts/${id}/`, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data)
      }
    }
  };

  const textFields = (
    <div className="text-center">
      {/* Add your form fields here */}

      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          className={styles.Input}
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.title?.map((message, idx) =>
        <Alert variant="warning" key={idx}>{message}</Alert>)}

      <Form.Group controlId="content">
        <Form.Label>Content</Form.Label>
        <Form.Control
          className={styles.Input}
          as="textarea"
          name="content"
          rows={6}
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.content?.map((message, idx) =>
        <Alert variant="warning" key={idx}>{message}</Alert>)}

      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={() => { }} >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        Save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`} >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload" >
                  Change the image
                </Form.Label>
              </div>
              <Form.Control type="file" id="image-upload" accept="image/*" onChange={handleChangeImage} ref={imageInput} />
            </Form.Group>
            {errors.image?.map((message, idx) =>
              <Alert variant="warning" key={idx}>{message}</Alert>)}
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;