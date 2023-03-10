import './App.css';
import React, { useState } from "react";
import ReactSwitch from 'react-switch';
import axios from 'axios'
import { Button, Card, Navbar, Container, Form, Alert, Modal } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currImage, setCurrImage] = useState(null);
  const [className, setClassName] = useState(null);
  const [mainMethod, setMainMethod] = useState(false);
  const [base64, setBase64] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(true); //true if no errors
  const [output, setOutput] = useState(null);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [loading, setLoading] = useState(false);

  const width = window.innerWidth;

  const onImageChange=(e)=>{
    const image = e.target.files[0];
    getBase64(image).then(base64Output => {
      setBase64(base64Output);
    })
    setCurrImage(URL.createObjectURL(image));
  }

  const onClassChange=(e)=>{
    setClassName(e.target.value);
  }

  const changeChecked=(val)=>{
    setMainMethod(val);
  }

  const getBase64=(file)=> {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
     });
  }

  const uploadDocument=()=>{
    if(allFieldsComplete()){
      setDocuments(documents.concat({
        image: currImage,
        className: className,
        mainMethod: mainMethod,
        base64: base64
    }));
    }
    else{
      setShow2(true);
    }

  }

  const allFieldsComplete=()=>{
    if(className && currImage){
      setShow2(false);
      return true;
    }
    return false;
  }

  const submit = async () => {
    setLoading(true);
    let valid = false;
    let numMain = 0;
    if(documents.length != 0){
      documents.forEach((document) => {(document.mainMethod==true) ? numMain++ : numMain = numMain});
    }
    if(documents.length > 0 && numMain == 1){
      valid = true;
    }
    if(valid){    
      try {
      let response = await axios.post("http://localhost:8080/",{documents})
      console.log(response.data);
      setResult(response.data.result);
      if(response.data.output == "error processing files"){
        setShow3(true);
      }
      setOutput(response.data.output);
    } catch(e) {
      console.log("ERROR" + e);
      setShow(true);
    }
    setSubmitted(true);
  }
  else{
    setShow2(true);
  }
  setLoading(false);

  }

  const refresh = () => window.location.reload(true)

  return (
    <div className="App">
      <Navbar expand="lg" variant="dark" bg="primary">
        <Container>
          <Navbar.Brand href="#">Paper++</Navbar.Brand>
        </Container>
      </Navbar>
      {show && <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <img src="https://http.cat/405" width={250}/>
      </Alert>}
      {show2 && <Alert variant="danger" onClose={() => setShow2(false)} dismissible>
        <Alert.Heading>Invalid input</Alert.Heading>
        <p>Check that all fields are filled out, you have at least one document, and exactly one main method</p>
        <img src="https://http.cat/418" width={250}/>
      </Alert>}
      {show3 && <Alert variant="danger" onClose={() => setShow3(false)} dismissible>
        <Alert.Heading>Faulty file</Alert.Heading>
        <p>Image failed to process</p>
        <img src="https://http.cat/400" width={250}/>
      </Alert>}
      <div className="Parent">
        <div className="child1">
      <h1>Upload Documents</h1>
            <p>Upload handwritten code</p>
            <div className='d-flex justify-content-center'>
              <input style={{width: 500}} class="form-control" type="file" id="formFile" onChange={onImageChange}/>
            </div>
            <br />
            <p>Enter the name of the class in the photo</p>
            <div className='d-flex justify-content-center'>
              <Form style={{width: 250}}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Enter class name" onChange={onClassChange} />
              </Form.Group>
              </Form>
            </div>
            {/* <input type="text" name="className" onChange={onClassChange} /> */}
            <p>This document contains the main method: </p>
            <ReactSwitch
                checked={mainMethod}
                onChange={changeChecked}
            />  
            <br />
            <br />
            <Button variant="primary" onClick={uploadDocument}>Upload document</Button>
            <h2 style={{marginTop: '20px'}}>Current documents: </h2>
            <div className='d-flex justify-content-center'>
              <div className="d-flex flex-row mb-3 justify-content-center" id="cardDiv">
              {(documents.length==0) && <p>Currently no uploaded documents</p>}
              {documents.map(doc => (
              <div className="p-2">
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={doc.image} width={250}/>
                <Card.Body>
                  <Card.Title>{doc.className}</Card.Title>
                  <Card.Text>
                    is main method: {doc.mainMethod.toString()}
                  </Card.Text>
                  </Card.Body>
                </Card>
              </div>))} 
              </div>        
            </div>
            {loading ? (<Modal show={true}>
              <Modal.Header closeButton>
                <Modal.Title>Loading</Modal.Title>
              </Modal.Header>
              <Modal.Body><img src="https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?resize=476%2C280&ssl=1" width="467vw"/></Modal.Body>
            </Modal>) : <Button variant="primary" onClick={submit}>Submit</Button>}
              {/* <form onSubmit={submit}>
                <input class="btn btn-primary" type="submit" value="Submit" />
              </form> */}
          </div>
          <div className="child2 bg-light">
            <h1>Output</h1>
                <div className="bg-dark" style={{minHeight: '500px', margin: '30px', marginTop: '0px', borderRadius: '12px'}}>
                  <p className="output">{output ? output : "No output to display"}</p>
                </div>
                {submitted && <div>
                  <p>Code submitted! Output should display above</p>
                  <Button variant="primary" onClick={refresh}>Reset</Button>
                </div>}
          </div>
        </div>
    </div>
  );
}

export default App;
