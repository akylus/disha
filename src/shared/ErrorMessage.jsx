import React from "react";
import { Col, Row } from "react-bootstrap";
import { Container, Typography } from "@material-ui/core";

let posts = [];
class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Typography variant="h4">So sorry, there has been an error!</Typography>
            <Typography variant="h6">
              {this.props.error.code} - {this.props.error.message}
            </Typography>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ErrorMessage;
