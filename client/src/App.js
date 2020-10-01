import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const App = () => {

  const [dataToken, setDataToken] = useState('')
  const [name, setName] = useState('')
  const [email, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [platform, setPlatform] = useState('')

  useEffect(() => {
    const fetching = async () => {
      const { data } = await axios.get('/api/meteor/get_all_users/desc/_id/20/0')
      console.log(data)
    }

    fetching()
  }, [dataToken])


  const submitRegistrasi = async () => {
    const newUser = {
      name,
      email,
      password
    }
    const { data } = await axios.post(`${platform}/register`, newUser)
    console.log(data)
    setName('')
    setMail('')
    setPassword('')
    setPlatform('')
  }

  const submitLogin = async () => {
    const newUser = {
      email,
      password
    }
    const { data } = await axios.post(`${platform}/login`, newUser)
    console.log(data)
    localStorage.setItem("token", data.token)
    setName('')
    setMail('')
    setPassword('')
  }

  const submitTestToken = async () => {
    console.log(localStorage.getItem('token'))
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`http://localhost:5000${platform}/auth`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })


    console.log(data)
    setName('')
    setMail('')
    setPassword('')
    setPlatform('')
  }

  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <div className="w-100 text-center p-5 ">
              <div className="">
                <h6>Registrasi</h6>
                <input type="text" placeholder="name" className="w-50 p-2 m-1" onChange={(e) => setName(e.target.value)} /><br></br>
                <input type="text" placeholder="email" className="w-50 p-2 m-1" onChange={(e) => setMail(e.target.value)} /><br></br>
                <input type="text" placeholder="password" className="w-50 p-2 m-1" onChange={(e) => setPassword(e.target.value)} /><br></br>
                <select id="platform" name="platform" onChange={(e) => setPlatform(e.target.value)} className="w-50 p-2 m-1">
                  <option value="">Select Platform</option>
                  <option value="/api/abcEducation">abc</option>
                  <option value="/api/abcFinance">abcfinance</option>
                  <option value="/api/defFinance">def</option>
                  <option value="/api/ghiEducation'">ghi</option>
                </select><br></br>

                <button onClick={() => submitRegistrasi()} className="w-50 p-2 m-1">submit</button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <div className="w-100 text-center p-5 ">
              <div className="">
                <h6>Login</h6>
                <input value={email} type="text" placeholder="email" className="w-50 p-2 m-1" onChange={(e) => setMail(e.target.value)} /><br></br>
                <input value={password} type="text" placeholder="password" className="w-50 p-2 m-1" onChange={(e) => setPassword(e.target.value)} /><br></br>
                <select id="platform" name="platform" onChange={(e) => setPlatform(e.target.value)} className="w-50 p-2 m-1">
                  <option value="">Select Platform</option>
                  <option value="/api/abcEducation">abc</option>
                  <option value="/api/abcFinance">abcfinance</option>
                  <option value="/api/defFinance">def</option>
                  <option value="/api/ghiEducation'">ghi</option>
                </select><br></br>

                <button onClick={() => submitLogin()} className="w-50 p-2 m-1">submit</button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <div className="w-100 text-center p-5 ">
              <div className="">
                <h6>Test Token</h6>


                <button onClick={() => submitTestToken()} className="w-50 p-2 m-1">submit</button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
